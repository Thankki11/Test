const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");
const authenticateToken = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Route thêm đơn hàng (người dùng)
router.post("/add-order", authenticateToken, orderController.addOrder);

// Route lấy danh sách đơn hàng (người dùng và admin)
router.get("/getOrders", authenticateToken, orderController.getOrders);

// Route lấy đơn hàng của người dùng
router.get("/my-orders", authenticateToken, orderController.getUserOrders);

// Route lấy chi tiết đơn hàng theo ID
router.get("/:id", authenticateToken, orderController.getOrderById);

// Route cập nhật thông tin đơn hàng (admin)
router.put("/:id", authenticateToken, adminMiddleware, orderController.updateOrder);

// Cập nhật trạng thái đơn hàng
router.put("/:id/status", orderController.updateOrderStatus);

// Route xóa đơn hàng (admin)
router.delete("/:id", authenticateToken, adminMiddleware, orderController.deleteOrder);

module.exports = router;
