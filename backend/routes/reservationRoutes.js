const express = require("express");
const router = express.Router();

const {
  getReservations,
  addReservations,
} = require("../controllers/reservationController");

// Lấy toàn bộ thông tin đặt bàn
router.post("/get", getReservations);

//Tạo thông tin đặt bàn mới
router.post("/add", addReservations);

module.exports = router;
