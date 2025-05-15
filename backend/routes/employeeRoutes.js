const express = require("express");
const router = express.Router();
const {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

// Lấy danh sách nhân viên
router.get("/", getEmployees);

// Thêm nhân viên mới
router.post("/", addEmployee);

// Cập nhật thông tin nhân viên
router.put("/:id", updateEmployee);

// Xóa nhân viên
router.delete("/:id", deleteEmployee);

module.exports = router;