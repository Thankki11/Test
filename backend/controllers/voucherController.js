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
    const {
      name,
      voucherCode,
      description,
      discount_type,
      discount_value,
      min_order_value,
      start_date,
      end_date,
    } = req.body;

    // Kiểm tra các trường bắt buộc
    if (
      !name ||
      !voucherCode ||
      !discount_value ||
      !min_order_value ||
      !start_date ||
      !end_date
    ) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields." });
    }

    // Kiểm tra giá trị discount_value
    if (discount_value < 0) {
      return res
        .status(400)
        .json({ message: "Discount value cannot be negative." });
    }

    // Kiểm tra giảm giá phần trăm không thể lớn hơn 100%
    if (discount_type === "PERCENT" && discount_value > 100) {
      return res
        .status(400)
        .json({ message: "Discount percentage cannot be greater than 100%." });
    }

    // Kiểm tra min_order_value không thể là số âm
    if (min_order_value < 0) {
      return res
        .status(400)
        .json({ message: "Minimum order value cannot be negative." });
    }

    // Kiểm tra ngày bắt đầu và ngày kết thúc
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    if (startDate >= endDate) {
      return res
        .status(400)
        .json({ message: "Start date must be before end date." });
    }

    // Kiểm tra mã voucher có tồn tại hay chưa
    const existingVoucher = await Voucher.findOne({ voucherCode });
    if (existingVoucher) {
      return res.status(400).json({ message: "Voucher code already exists." });
    }

    // Tạo voucher mới
    const newVoucher = new Voucher({
      name,
      voucherCode,
      description,
      discount_type,
      discount_value: parseFloat(discount_value),
      min_order_value: parseFloat(min_order_value),
      start_date: startDate,
      end_date: endDate,
    });

    // Lưu voucher vào cơ sở dữ liệu
    await newVoucher.save();

    return res
      .status(201)
      .json({ message: "Voucher created successfully", voucher: newVoucher });
  } catch (err) {
    console.error("Error creating voucher:", err);
    return res.status(500).json({ message: "Failed to create voucher." });
  }
};

// Cập nhật voucher
exports.updateVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedVoucher = await Voucher.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    res.status(200).json({
      message: "Voucher updated successfully",
      voucher: updatedVoucher,
    });
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
