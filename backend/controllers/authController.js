const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const axios = require("axios");

exports.login = async (req, res) => {
  const { email, password, captchaToken } = req.body;

  // Xác minh reCAPTCHA
  const secretKey = process.env.RECAPTCHA_SECRET_KEY; // Secret Key từ Google reCAPTCHA
  try {
    const captchaResponse = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: secretKey,
          response: captchaToken,
        },
      }
    );

    if (!captchaResponse.data.success) {
      return res.status(400).json({ message: "Captcha verification failed" });
    }
  } catch (err) {
    console.error("Captcha verification error:", err);
    return res.status(500).json({ message: "Captcha verification error" });
  }

  // Xử lý đăng nhập
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token, user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Đăng ký người dùng
exports.register = async (req, res) => {
  const { email, password, captchaToken } = req.body;

  // Xác minh reCAPTCHA
  const secretKey = process.env.RECAPTCHA_SECRET_KEY; // Secret Key từ Google reCAPTCHA
  try {
    const captchaResponse = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: secretKey,
          response: captchaToken,
        },
      }
    );

    if (!captchaResponse.data.success) {
      return res.status(400).json({ message: "Captcha verification failed" });
    }
  } catch (err) {
    console.error("Captcha verification error:", err);
    return res.status(500).json({ message: "Captcha verification error" });
  }

  // Xử lý đăng ký
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Lấy tất cả người dùng (cho admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi lấy danh sách người dùng" });
  }
};

// Thêm người dùng
exports.createUser = async (req, res) => {
  try {
    const { username, email, phone, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser){
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      phone,
      password: hashedPassword,
      role,
      isAdmin: role === "admin",
    });

    await newUser.save();
    res.status(201).json({ message: "Tạo người dùng thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi tạo người dùng" });
  }
};

// Cập nhật người dùng
exports.updateUser = async (req, res) => {
  try {
    const { username, email, phone, role } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, phone, role, isAdmin: role === "admin" },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    res.json({ message: "Cập nhật thành công", user: updated });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi cập nhật người dùng" });
  }
};

// Xoá người dùng
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    res.json({ message: "Xoá người dùng thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi xoá người dùng" });
  }
};
