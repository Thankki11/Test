const express = require("express");
const router = express.Router();
const { createPayment, vnpayReturn, vnpayIpn } = require("../controllers/paymentController");

router.post("/create_payment_url", createPayment);
router.get("/vnpay_return", vnpayReturn);
router.get("/vnpay_ipn", vnpayIpn);


module.exports = router;
