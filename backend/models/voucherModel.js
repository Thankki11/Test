const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // Mã voucher
  discount: { type: Number, required: true }, // Phần trăm giảm giá (0-100)
  expirationDate: { type: Date, required: true }, // Ngày hết hạn
  isActive: { type: Boolean, default: true }, // Trạng thái voucher
  createdAt: { type: Date, default: Date.now }, // Ngày tạo
});

module.exports = mongoose.model("Voucher", voucherSchema);