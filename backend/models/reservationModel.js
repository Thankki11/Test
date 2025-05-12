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
    validate: {
      validator: function (v) {
        return /^[0-9]{10}$/.test(v); // Biểu thức chính quy kiểm tra 10 chữ số
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  numberOfGuest: {
    type: Number,
    required: true,
  },
  seatingArea: {
    type: String,
    required: true,
  },
  tableType: {
    type: String,
    required: true,
  },

  // ✅ Trường mới: selectedTable
  selectedTable: {
    type: Object,
    default: null,
  },

  note: {
    type: String,
    required: false,
  },

  dateTime: {
    type: Date,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  createdBy: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    default: "pending",
  },
});

// Tạo model từ schema
const Reservation = mongoose.model("Reservation", reservationSchema);

module.exports = Reservation;
