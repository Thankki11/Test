const bcrypt = require("bcrypt");
const crypto = require("crypto"); // Thêm dòng này
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const axios = require("axios");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/users"); // Save files in the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// User Registration
exports.register = async (req, res) => {
  const { username, email, phone, password, confirmPassword } = req.body;

  try {
    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Kiểm tra xác nhận mật khẩu
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Đặt avatar mặc định
    const defaultAvatar = "http://localhost:3001/uploads/users/default-avatar.png";

    // Tạo người dùng mới
    const newUser = new User({
      username,
      email,
      phone,
      password: hashedPassword,
      avatar: defaultAvatar,
      role: "user",
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// User Login
exports.login = async (req, res) => {
  const { email, password, captchaToken } = req.body;

  // Xác minh reCAPTCHA
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
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
    const user = await User.findOne({ email, role: "user" }); // Đảm bảo chỉ tìm người dùng có role là "user"
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    res.json({ message: "Login successful", token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateUser = async (req, res) => {
  const { username, email, phone, address } = req.body;
  const userId = req.user.id; // Assuming `req.user` is populated by middleware

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email, phone, address },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming `req.user` is populated by middleware
    const user = await User.findById(userId).select("-password"); // Exclude the password field

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update user avatar
exports.updateAvatar = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming `req.user` is populated by middleware
    const avatarPath = `http://localhost:3001/uploads/users/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarPath },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Avatar updated successfully", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.handleOAuthLogin = async (profile, provider) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });

    if (!user) {
      // Tạo mật khẩu random
      const randomPassword = crypto.randomBytes(12).toString("hex");
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = new User({
        username: profile.displayName,
        email: profile.emails[0].value,
        password: hashedPassword, // Lưu mật khẩu random đã hash
        avatar: profile.photos[0].value,
        role: "user",
        isOAuth: true,
        provider,
      });
      await user.save();
    }
    // Không cần kiểm tra mật khẩu khi login bằng Google
    return user;
  } catch (err) {
    console.error("Error during OAuth login:", err);
    throw new Error("Server error during OAuth login");
  }
};
module.exports.upload = upload;
