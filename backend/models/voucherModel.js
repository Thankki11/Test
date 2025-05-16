const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Tên voucher
  voucherCode: { type: String, required: true, unique: true }, // Mã voucher
  discount_type: { type: String, required: true, enum: ["PERCENT", "FIXED"] }, // Loại giảm giá (phần trăm hoặc cố định)
  discount_value: { type: Number, required: true }, // Giá trị giảm (phần trăm hoặc số tiền cố định)
  min_order_value: { type: Number, required: true }, // Giá trị đơn hàng tối thiểu
  start_date: { type: Date, required: true }, // Ngày bắt đầu
  end_date: { type: Date, required: true }, // Ngày kết thúc
  applied_products: { type: [String], default: [] }, // Danh sách sản phẩm áp dụng voucher
  description: { type: String, required: true }, // Mô tả voucher
  isActive: { type: Boolean, default: true }, // Trạng thái voucher
  createdAt: { type: Date, default: Date.now }, // Ngày tạo voucher
});

module.exports = mongoose.model("Voucher", voucherSchema);
