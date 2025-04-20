const express = require("express");
const router = express.Router();
const {
  getSeatingAreas,
  createTable,
  getNextTableNumber,
  getAllTables,
  addNewReservation,
  deleteTable,
} = require("../controllers/tableController");

// Route để lấy danh sách các seatingArea
router.get("/get/seating-areas", getSeatingAreas);

// Route tạo bàn mới
router.post("/create", createTable);

//Route lấy số bàn lớn nhất
router.get("/get/next-table-number", getNextTableNumber);

//Lấy toàn bộ bàn
router.get("/get/all", getAllTables);

//Xác nhận đơn đặt bàn: Lưu lịch sử đặt bàn vào bàn đó
router.put("/confirm/:id", addNewReservation);

//Xóa bàn: Xóa cả lịch sử đặt bàn của bàn đó
router.delete("/delete/:id", deleteTable);

module.exports = router;
