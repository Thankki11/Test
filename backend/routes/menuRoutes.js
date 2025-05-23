const express = require("express");
const router = express.Router();
const {
  getMenus,
  getMenuById,
  getMenuByCategory,
  updateMenu,
  createMenu,
  deleteMenu,
  getMenuReviews,
  addMenuReview,
  resetAllQuantities,
  getTopRatedMenus,
} = require("../controllers/menuController");

const authenticateToken = require("../middleware/authMiddleware");

// Lấy top 4 món ăn có rating cao nhất
router.get("/top-rated", getTopRatedMenus);

// Route lấy tất cả menu
router.get("/", getMenus);

// Route lấy món ăn theo id
router.get("/:id", getMenuById);

//Route lấy 4 món ăn theo category
router.get("/category/:category", getMenuByCategory);

// Route cập nhật món ăn
router.put("/:id", updateMenu);

// Route to create a new menu item
router.post("/", createMenu);

// Route xóa món ăn
router.delete("/:id", deleteMenu);

// Route lấy đánh giá sản phẩm
router.get("/:id/reviews", getMenuReviews);

// Route thêm đánh giá sản phẩm
router.post("/:id/reviews", authenticateToken, addMenuReview);

// Route to reset all quantities
router.post("/reset-quantities", resetAllQuantities);

module.exports = router;
