const express = require("express");
const router = express.Router();
const { getMenus, getMenuById } = require("../controllers/menuController");

// Route lấy tất cả menu
router.get("/", getMenus);

// Route lấy menu theo id
router.get("/:id", getMenuById);

module.exports = router;
