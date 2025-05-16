const Combo = require("../models/comboModel");
const Menu = require("../models/menuModel");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

exports.createCombo = async (req, res) => {
  try {
    const { name, description, price, items } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!name || !price || !items || items.length === 0) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Xử lý upload ảnh
    let imageUrl = "";
    if (req.file) {
      try {
        const uploadDir = path.join(__dirname, "../uploads/combos");

        // Tạo thư mục nếu chưa tồn tại (với recursive: true)
        fs.mkdirSync(uploadDir, { recursive: true });

        const fileExt = path.extname(req.file.originalname);
        const fileName = `combo-${uuidv4()}${fileExt}`;
        const filePath = path.join(uploadDir, fileName);

        // Đọc file từ temp và ghi vào thư mục đích
        const fileData = fs.readFileSync(req.file.path);
        fs.writeFileSync(filePath, fileData);

        // Xóa file temp sau khi đã di chuyển
        fs.unlinkSync(req.file.path);

        imageUrl = `/uploads/combos/${fileName}`;
      } catch (err) {
        console.error("Error processing image:", err);
        throw new Error("Failed to process image");
      }
    } else {
      return res.status(400).json({ message: "Combo image is required" });
    }

    // Lấy quantity nhỏ nhất của các items menu
    const menus = await Menu.find({ _id: { $in: items } });
    if (menus.length !== items.length) {
      return res.status(400).json({ message: "Invalid menu items" });
    }
    const quantity = Math.min(...menus.map((m) => m.quantity));

    // Tạo combo mới
    const combo = new Combo({
      name,
      description,
      price: parseFloat(price),
      items,
      imageUrl,
      quantity,
    });

    await combo.save();

    res.status(201).json({
      success: true,
      message: "Combo created successfully",
      data: combo,
    });
  } catch (err) {
    console.error("Error creating combo:", err);

    // Xóa ảnh đã upload nếu có lỗi
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: "Server error while creating combo",
      error: err.message,
    });
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

exports.getComboByID = async (req, res) => {
  try {
    const comboId = req.params.id; // Lấy ID từ URL params
    const combo = await Combo.findById(comboId); // Tìm combo theo ID trong cơ sở dữ liệu

    if (!combo) {
      return res.status(404).json({ message: "Combo not found" }); // Nếu không tìm thấy combo
    }

    res.status(200).json(combo); // Trả về dữ liệu combo tìm được
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" }); // Xử lý lỗi server
  }
};

exports.getComboReviews = async (req, res) => {
  try {
    const comboId = req.params.id; // Lấy ID từ URL params
    const combo = await Combo.findById(comboId); // Tìm combo theo ID trong cơ sở dữ liệu

    if (!combo) {
      return res.status(404).json({ message: "Combo not found" }); // Nếu không tìm thấy combo
    }

    res.status(200).json(combo.reviews || []); // Trả về danh sách đánh giá của combo
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" }); // Xử lý lỗi server
  }
};
