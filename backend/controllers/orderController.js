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

    const userId = req.user.id;
    
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
      userId,
    });

    // Lưu vào database
    await newOrder.save();

    res.status(201).json({
      message: "Đặt hàng thành công!",
      order: newOrder,
      _id: newOrder._id
    });
  } catch (error) {
    console.error("Lỗi khi thêm order:", error);
    res.status(500).json({ message: "Lỗi server, không thể đặt hàng." });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", err);
    res.status(500).json({ message: "Lỗi server, không thể lấy danh sách đơn hàng." });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming `req.user` is populated by middleware
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Failed to fetch user orders:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Lấy userId từ token

    // Tìm đơn hàng theo id và userId
    const order = await Order.findOne({ _id: id, userId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params; // Lấy order ID từ URL
    const { status } = req.body; // Lấy trạng thái mới từ body

    // Cập nhật trạng thái đơn hàng
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Trả về đơn hàng đã cập nhật
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order status updated successfully", order: updatedOrder });
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Sửa thông tin order
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID order từ URL
    const { customerName, phoneNumber, emailAddress, address, paymentMethod, note, items, totalPrice } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { customerName, phoneNumber, emailAddress, address, paymentMethod, note, items, totalPrice },
      { new: true, runValidators: true } // Trả về order đã cập nhật
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order updated successfully", order: updatedOrder });
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Xóa order
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID order từ URL

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addOrder, getOrders, getUserOrders, getOrderById, updateOrderStatus, updateOrder, deleteOrder };
