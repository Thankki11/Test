const express = require("express");
const router = express.Router();

// const { authenticateToken } = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  login,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/authController");

const { updateOrder, deleteOrder } = require("../controllers/orderController");

// Route cho admin, bảo vệ bằng middleware
router.post("/login", login);
router.get("/users", adminMiddleware, getAllUsers);
router.post("/users", adminMiddleware, createUser);
router.put("/users/:id", adminMiddleware, updateUser);
router.delete("/users/:id", adminMiddleware, deleteUser);

// Sửa thông tin order
router.put("/orders/:id", adminMiddleware, updateOrder);

// Xóa order
router.delete("/orders/:id", adminMiddleware, deleteOrder);

module.exports = router;
