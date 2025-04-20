const express = require("express");
const router = express.Router();

const {
  getReservations,
  addReservations,
  updateReservation,
  confirmReservation,
  deleteReservation,
  getReservationByID,
} = require("../controllers/reservationController");

// Lấy toàn bộ thông tin đặt bàn
router.post("/get", getReservations);

router.get("/get/:id", getReservationByID);

//Tạo thông tin đặt bàn mới
router.post("/add", addReservations);

//Sửa lại thông tin đặt bàn
router.put("/update/:id", updateReservation);

//Xác nhận đơn đặt bàn (confirm)
router.put("/confirm/:id", confirmReservation);

//Xóa thông tin đặt bàn
router.delete("/delete/:id", deleteReservation);

module.exports = router;
