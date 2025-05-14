const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  tableNumber: { type: Number, required: true, unique: true },
  seatingArea: { type: String, required: true },
  tableType: { type: String, required: true },
  capacity: { type: Number, required: true },
  note: { type: String },
  createdAt: { type: Date, default: Date.now },

  // Thêm trường bookingHistory là một mảng chứa các đối tượng
  bookingHistory: {
    type: [
      {
        reservationId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Reservation",
          required: true,
        },
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
      },
    ],
    default: [],
  },
});

const Table = mongoose.model("Table", tableSchema);

module.exports = Table;
