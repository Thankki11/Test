const Order = require("../models/orderModel"); // import model

// Controller để thêm một order
const addOrder = async (req, res) => {
  try {
    const {
      customerName,
      phoneNumber,
      emailAddress,
      address,
      paymentMethod,
      note,
      agreeTerms,
      items,
      date,
      totalPrice,
    } = req.body;

    // Tạo đối tượng order mới
    const newOrder = new Order({
      customerName,
      phoneNumber,
      emailAddress,
      address,
      paymentMethod,
      note,
      agreeTerms,
      items,
      totalPrice,
      date: date || new Date(),
    });

    // Lưu vào database
    await newOrder.save();

    res.status(201).json({
      message: "Đặt hàng thành công!",
      order: newOrder,
    });
  } catch (error) {
    console.error("Lỗi khi thêm order:", error);
    res.status(500).json({ message: "Lỗi server, không thể đặt hàng." });
  }
};

module.exports = { addOrder };
