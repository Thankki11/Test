const express = require("express");
const router = express.Router();

const { addOrder } = require("../controllers/orderController");
const { getOrders } = require("../controllers/orderController");
const { getUserOrders } = require("../controllers/orderController");
const { getOrderById } = require("../controllers/orderController");
const { updateOrderStatus } = require("../controllers/orderController");
const authenticateToken = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.post("/add", addOrder);
router.get("/getOrders", getOrders);
router.get("/my-orders", authenticateToken, getUserOrders);
router.get("/:id", authenticateToken, getOrderById);
router.put("/:id/status", authenticateToken, adminMiddleware, updateOrderStatus);

module.exports = router;
