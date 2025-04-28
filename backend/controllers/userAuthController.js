const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

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
  const { username, email, phone, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Set a default avatar URL
    const defaultAvatar = "https://localhost:3001/uploads/default-avatar.png.jpeg"; // Replace with your default avatar URL

    // Create a new user
    const newUser = new User({
      username,
      email,
      phone,
      password: hashedPassword,
      avatar: defaultAvatar, // Assign the default avatar
      role: "user", // Default role
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
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, role: "user" }); // Ensure role is 'user'
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

module.exports.upload = upload;