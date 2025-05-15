const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  position: { type: String, required: true }, // Ví dụ: "Manager", "Chef", "Waiter"
  salary: { type: Number, required: true },
  dateJoined: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Employee", employeeSchema);