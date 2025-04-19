const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  tableNumber: { type: Number, required: true, unique: true },
  seatingArea: { type: String, required: true },
  tableType: { type: String, required: true },
  capacity: { type: Number, required: true },
  note: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Table = mongoose.model("Table", tableSchema);

module.exports = Table;
