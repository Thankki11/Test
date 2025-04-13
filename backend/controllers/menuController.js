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

exports.getMenuById = async (req, res) => {
  const { id } = req.params; // Lấy id từ params

  try {
    const menu = await Menu.findById(id); // Tìm menu theo id

    if (!menu) {
      return res.status(404).json({ message: "Menu not found" }); // Nếu không tìm thấy menu
    }

    res.json(menu); // Trả về menu chi tiết
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getMenuByCategory = async (req, res) => {
  const { category } = req.params; // Lấy category từ params

  try {
    const menus = await Menu.find({ category }).limit(4); // Tìm menu theo category và giới hạn kết quả là 4 món ăn

    if (!menus) {
      return res.status(404).json({ message: "Menu not found" }); // Nếu không tìm thấy menu
    }

    res.json(menus); // Trả về danh sách menu
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
