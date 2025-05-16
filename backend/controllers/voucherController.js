const Voucher = require("../models/voucherModel");

// Lấy danh sách voucher
exports.getVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.find();
    res.status(200).json(vouchers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching vouchers", error: err });
  }
};

// Thêm voucher mới
exports.addVoucher = async (req, res) => {
  try {
    const { code, discount, expirationDate } = req.body;
    const newVoucher = new Voucher({ code, discount, expirationDate });
    await newVoucher.save();
    res.status(201).json({ message: "Voucher added successfully", voucher: newVoucher });
  } catch (err) {
    res.status(500).json({ message: "Error adding voucher", error: err });
  }
};

// Cập nhật voucher
exports.updateVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedVoucher = await Voucher.findByIdAndUpdate(id, updatedData, { new: true });
    res.status(200).json({ message: "Voucher updated successfully", voucher: updatedVoucher });
  } catch (err) {
    res.status(500).json({ message: "Error updating voucher", error: err });
  }
};

// Xóa voucher
exports.deleteVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    await Voucher.findByIdAndDelete(id);
    res.status(200).json({ message: "Voucher deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting voucher", error: err });
  }
};

exports.validateVoucher = async (req, res) => {
  const { code } = req.body;

  try {
    const voucher = await Voucher.findOne({ code, isActive: true });
    if (!voucher || new Date(voucher.expirationDate) < new Date()) {
      return res.status(400).json({ message: "Invalid or expired voucher." });
    }

    res.json({ discount: voucher.discount });
  } catch (err) {
    console.error("Error validating voucher:", err);
    res.status(500).json({ message: "Server error." });
  }
};