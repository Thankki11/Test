const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");
const authenticateToken = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.post("/add-order", authenticateToken, orderController.addOrder);
router.get("/getOrders", orderController.getOrders);
router.get("/my-orders", authenticateToken, orderController.getUserOrders);
router.get("/:id", authenticateToken, orderController.getOrderById);
router.put("/:id/status", authenticateToken, adminMiddleware, orderController.updateOrderStatus);

module.exports = router;
