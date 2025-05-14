const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const axios = require("axios");
const Admin = require("../models/userModel"); // Đảm bảo bạn có model admin

// Lấy tất cả người dùng (cho admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi server khi lấy danh sách người dùng" });
  }
};

// Thêm người dùng
exports.createUser = async (req, res) => {
  try {
    const { username, email, phone, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
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
    const { username, email, phone, role, password } = req.body;

    const updateData = { username, email, phone, role };

    // Nếu có mật khẩu mới, mã hóa mật khẩu trước khi lưu
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Xoá người dùng
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });

    res.json({ message: "Xoá người dùng thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi xoá người dùng" });
  }
};

// Đăng nhập admin
exports.adminLogin = async (req, res) => {
  const { username, password } = req.body; // Chỉnh từ email sang username

  try {
    // Tìm admin theo username thay vì email
    const admin = await Admin.findOne({ username }); // Sử dụng username thay vì email
    if (!admin) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // So sánh mật khẩu đã mã hóa
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Tạo token
    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Trả về token và role
    res.json({ token, role: "admin" });
  } catch (err) {
    console.error("Error during admin login:", err);
    res.status(500).json({ message: "Server error" });
  }
};
