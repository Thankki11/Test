const mongoose = require("mongoose");

const comboSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu",
      required: true,
    },
  ],
  quantity: { type: Number, required: true, min: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Combo = mongoose.model("Combo", comboSchema);

module.exports = Combo;