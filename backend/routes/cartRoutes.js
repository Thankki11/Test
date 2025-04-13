const express = require("express");
const router = express.Router();

const {
  getCart,
  addToCart,
  removeFromCart,
} = require("../controllers/cartController");

// Lấy giỏ hàng hiện tại
router.get("/", getCart);

// Thêm sản phẩm vào giỏ
router.post("/add", addToCart);

// Xóa sản phẩm khỏi giỏ
router.delete("/remove/:productId", removeFromCart);

module.exports = router;
