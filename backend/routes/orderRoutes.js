const express = require("express");
const router = express.Router();

const { addOrder } = require("../controllers/orderController");
const { getOrders } = require("../controllers/orderController");


router.post("/add", addOrder);
router.get("/getOrders", getOrders);

module.exports = router;
