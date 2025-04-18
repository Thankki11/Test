const express = require("express");
const router = express.Router();

const { addOrder } = require("../controllers/orderController");

// Thêm đặt bàn
router.post("/add", addOrder);

module.exports = router;
