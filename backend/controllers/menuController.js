const Menu = require("../models/menuModel");
const { saveImageToUploads } = require("./uploadController");
const path = require('path'); 
const fs = require('fs');
// Lấy danh sách menu
exports.getMenus = async (req, res) => {
  try {
    const menus = await Menu.find(); 
    res.json(menus); 
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Lấy menu theo ID
exports.getMenuById = async (req, res) => {
  const { id } = req.params; 

  try {
    const menu = await Menu.findById(id); 

    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    res.json(menu); 
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Lấy menu theo Category
exports.getMenuByCategory = async (req, res) => {
  const { category } = req.params; 

  try {
    const menus = await Menu.find({ category }).limit(4); 

    if (menus.length === 0) {
      return res.status(404).json({ message: "Menu not found" });
    }

    res.json(menus); 
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Cập nhật món ăn
exports.updateMenu = async (req, res) => {
  console.log("Payload received:", req.body);
  const { id } = req.params;
  const { name, description, price, category, imageBuffer, fileName, mimeType, quantity } = req.body;

  try {
    const menu = await Menu.findById(id);
    if (!menu) return res.status(404).json({ message: "Menu not found" });

    menu.name = name || menu.name;
    menu.description = description || menu.description;
    menu.price = price || menu.price;
    menu.category = category || menu.category;
    menu.quantity = quantity !== undefined ? parseInt(quantity) : menu.quantity; // Cập nhật số lượng

    if (imageBuffer && fileName && mimeType) {
      if (menu.imageUrl) {
        const oldPath = path.join(__dirname, `../${menu.imageUrl}`);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      const newImageUrl = saveImageToUploads(imageBuffer, fileName, mimeType, category);
      if (!newImageUrl) return res.status(500).json({ message: "Error saving image" });
      menu.imageUrl = newImageUrl;
    }

    await menu.save();
    res.json({ message: "Menu updated successfully", menu });
  } catch (err) {
    console.error("Update menu error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// Xóa món ăn
exports.deleteMenu = async (req, res) => {
  const { id } = req.params;

  try {
   
    const menu = await Menu.findById(id);

    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    // Xác định đường dẫn ảnh cần xóa
    const imagePath = path.join(__dirname, `../${menu.imageUrl}`);
    console.log("Image path:", imagePath); 

    
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath); 
      console.log("Image deleted successfully"); 
    } else {
      console.log("Image not found at path:", imagePath); 
    }

    
    await Menu.findByIdAndDelete(id);

   
    res.json({ message: "Menu deleted successfully" });
  } catch (err) {
    console.error("Error deleting menu:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Tạo một món ăn mới
exports.createMenu = async (req, res) => {
  try {
    const { name, description, price, category, imageBuffer, fileName, mimeType, quantity } = req.body;

    if (!name || !description || !price || !category || !imageBuffer || !fileName || quantity === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const imageUrl = saveImageToUploads(imageBuffer, fileName, mimeType, category);
    if (!imageUrl) {
      return res.status(500).json({ message: "Error saving image" });
    }

    const menu = new Menu({
      name,
      description,
      price: parseFloat(price),
      category,
      imageUrl,
      quantity: parseInt(quantity), // Lưu số lượng món ăn
    });

    await menu.save();
    res.status(201).json({ message: "Menu created successfully", menu });
  } catch (err) {
    console.error("Error creating menu:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Lấy đánh giá sản phẩm
exports.getMenuReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const menu = await Menu.findById(id);
    if (!menu) return res.status(404).json({ message: "Menu not found" });
    res.json(menu.reviews || []);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Thêm đánh giá sản phẩm (chỉ cho user đã mua)
exports.addMenuReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;
    const username = req.user.username;
    // Kiểm tra user đã mua sản phẩm chưa
    const Order = require("../models/orderModel");
    const orders = await Order.find({ userId, "items.menuItemId": id });
    if (!orders || orders.length === 0) {
      return res.status(403).json({ message: "Bạn phải mua sản phẩm này mới được đánh giá." });
    }
    // Thêm đánh giá
    const menu = await Menu.findById(id);
    if (!menu) return res.status(404).json({ message: "Menu not found" });
    // Không cho phép đánh giá trùng user
    const alreadyReviewed = menu.reviews.find(r => r.userId.toString() === userId);
    if (alreadyReviewed) {
      return res.status(400).json({ message: "Bạn đã đánh giá sản phẩm này rồi." });
    }
    menu.reviews.push({ userId, username, rating, comment });
    await menu.save();
    res.status(201).json({ message: "Đánh giá thành công!", reviews: menu.reviews });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Reset all menu quantities to 200
exports.resetAllQuantities = async (req, res) => {
  try {
    await Menu.updateMany({}, { $set: { quantity: 200 } });
    res.json({ message: "All menu quantities have been reset to 200." });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};