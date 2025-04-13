const express = require("express");
const router = express.Router();
const {
  getMenus,
  getMenuById,
  getMenuByCategory,
} = require("../controllers/menuController");

// Route lấy tất cả menu
router.get("/", getMenus);

// Route lấy món ăn theo id
router.get("/:id", getMenuById);

//Route lấy 4 món ăn theo category
router.get("/category/:category", getMenuByCategory);

module.exports = router;
