const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Validate user credentials
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a JWT
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role }, // Include role in payload
      process.env.JWT_SECRET, // Secret key
      { expiresIn: "1h" } // Token expiration
    );

    res.json({ message: "Login successful", token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
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
    if (existingUser) return res.status(400).json({ message: "Email đã tồn tại" });

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
