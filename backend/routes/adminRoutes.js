const express = require("express");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

// Example admin-only route
router.get("/dashboard", adminOnly, (req, res) => {
  res.json({ message: "Welcome to the admin dashboard" });
});

module.exports = router;