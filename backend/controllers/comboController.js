const Combo = require("../models/comboModel");
const Menu = require("../models/menuModel");

exports.createCombo = async (req, res) => {
  try {
    const { name, description, price, items, imageUrl } = req.body;

    // Lấy quantity nhỏ nhất của các items menu
    const menus = await Menu.find({ _id: { $in: items } });
    if (menus.length !== items.length) {
      return res.status(400).json({ message: "Invalid menu items" });
    }
    const quantity = Math.min(...menus.map((m) => m.quantity));

    const combo = new Combo({
      name,
      description,
      price,
      items,
      imageUrl,
      quantity,
    });

    await combo.save();
    res.status(201).json(combo);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getCombos = async (req, res) => {
  try {
    const combos = await Combo.find().populate("items");
    res.json(combos);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};