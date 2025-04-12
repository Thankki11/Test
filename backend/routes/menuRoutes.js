const express = require("express");
const router = express.Router();
const { getMenus } = require("../controllers/menuController");

// Route lấy tất cả menu
router.get("/", getMenus);

module.exports = router;
