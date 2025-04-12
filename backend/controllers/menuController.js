const Menu = require("../models/menuModel");

// Lấy danh sách menu
exports.getMenus = async (req, res) => {
  try {
    const menus = await Menu.find(); // Lấy tất cả các menu từ MongoDB
    res.json(menus); // Trả về dữ liệu dưới dạng JSON
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
