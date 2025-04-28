const express = require("express");
const { register, login, updateUser, getUserInfo, updateAvatar, upload } = require("../controllers/userAuthController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// User Registration
router.post("/register", register);

// User Login
router.post("/login", login);

// Get User Information
router.get("/info", authenticateToken, getUserInfo);

// Update User Information
router.put("/update", authenticateToken, updateUser);

// Update user avatar
router.post("/update-avatar", authenticateToken, upload.single("avatar"), updateAvatar);

module.exports = router;