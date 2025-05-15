const express = require("express");
const router = express.Router();
const {
  getVouchers,
  addVoucher,
  updateVoucher,
  deleteVoucher,
  validateVoucher,
} = require("../controllers/voucherController");

// Lấy danh sách voucher
router.get("/", getVouchers);

// Thêm voucher mới
router.post("/", addVoucher);

// Cập nhật voucher
router.put("/:id", updateVoucher);

// Xóa voucher
router.delete("/:id", deleteVoucher);

// Validate voucher
router.post("/validate", validateVoucher);

module.exports = router;