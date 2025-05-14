const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { register, login, updateUser, getUserInfo, updateAvatar, upload } = require("../controllers/userAuthController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// User Registration
router.post("/register", register);

// User Login
router.post("/login", login);

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Tạo token JWT
    const token = jwt.sign(
      { id: req.user._id, username: req.user.username, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    // Chuyển hướng về frontend với token
    res.redirect(`http://localhost:3000?token=${token}`);
  }
);

// Facebook OAuth
router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  (req, res) => {
    // Tạo token JWT
    const token = jwt.sign(
      { id: req.user._id, username: req.user.username, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    // Chuyển hướng về frontend với token
    res.redirect(`http://localhost:3000?token=${token}`);
  }
);

// Get User Information
router.get("/info", authenticateToken, getUserInfo);

// Update User Information
router.put("/update", authenticateToken, updateUser);

// Update user avatar
router.post("/update-avatar", authenticateToken, upload.single("avatar"), updateAvatar);

module.exports = router;