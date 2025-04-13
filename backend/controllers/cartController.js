const Cart = require("../models/cartModel");

// Lấy giỏ hàng hiện tại
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne(); // lấy cart đầu tiên (giả lập 1 cart duy nhất)
    if (!cart) {
      return res.json({ items: [] }); // chưa có cart thì trả về rỗng
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Thêm sản phẩm vào giỏ hàng
exports.addToCart = async (req, res) => {
  try {
    const { cartId, items } = req.body;

    const cart = await Cart.findById(cartId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Lặp qua từng item gửi lên
    items.forEach((newItem) => {
      const existingItem = cart.items.find((item) => item._id === newItem._id);

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        cart.items.push(newItem);
      }
    });

    const updatedCart = await cart.save();
    res.status(200).json({ message: "Cart updated", data: updatedCart });
  } catch (error) {
    console.error("🔴 Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Xóa sản phẩm khỏi giỏ hàng
exports.removeFromCart = async (req, res) => {
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne();

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => item.productId !== productId);

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
