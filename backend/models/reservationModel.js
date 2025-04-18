const mongoose = require("mongoose");

// Định nghĩa schema cho Reservation
const reservationSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  emailAddress: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  numberOfGuest: {
    type: Number,
    required: true,
  },
  seatingArea: {
    type: String,
    required: true,
  },
  note: {
    type: String,
    required: false,
  },
  dateTime: {
    type: Date, // Đảm bảo rằng dateTime là kiểu Date
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Mặc định sẽ lưu thời gian hiện tại khi tạo mới
  },
  status: {
    type: String,
    default: "pending",
  },
});

// Tạo model từ schema
const Reservation = mongoose.model("Reservation", reservationSchema);

module.exports = Reservation;
