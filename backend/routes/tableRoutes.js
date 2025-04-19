const express = require("express");
const router = express.Router();
const {
  getSeatingAreas,
  createTable,
  getNextTableNumber,
  getAllTables,
} = require("../controllers/tableController");

// Route để lấy danh sách các seatingArea
router.get("/get/seating-areas", getSeatingAreas);

// Route tạo bàn mới
router.post("/create", createTable);

//Route lấy số bàn lớn nhất
router.get("/get/next-table-number", getNextTableNumber);

//Lấy toàn bộ bàn
router.get("/get/all", getAllTables);

module.exports = router;
