const Reservation = require("../models/reservationModel");

// Lấy danh sách các đặt bàn (reservations) từ cơ sở dữ liệu
exports.getReservations = async (req, res) => {
  try {
    // Lấy các đặt bàn từ cơ sở dữ liệu
    const reservations = await Reservation.find();

    // Trả về danh sách các đơn đặt bàn
    res.json(reservations);
  } catch (err) {
    // Nếu có lỗi xảy ra, trả về thông báo lỗi
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

exports.getReservationByID = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    // Nếu ID không hợp lệ hoặc có lỗi truy vấn
    console.error("Error getting reservation:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while getting reservation",
      error: error.message,
    });
  }
};

//Tạo đơn đặt hàng mới
exports.addReservations = async (req, res) => {
  const {
    customerName,
    emailAddress,
    phoneNumber,
    numberOfGuest,
    seatingArea,
    note,
    dateTime, // Lấy giá trị ngày từ người dùng
  } = req.body;

  try {
    // Chuyển đổi dateTime từ chuỗi sang đối tượng Date
    const date = new Date(dateTime); // Đây sẽ là một đối tượng Date hợp lệ trong MongoDB

    // Kiểm tra nếu dateTime không hợp lệ
    if (isNaN(date)) {
      return res.status(400).json({ message: "Invalid dateTime format" });
    }

    // Tạo đối tượng Reservation mới với dữ liệu từ formData
    const newReservation = new Reservation({
      customerName,
      emailAddress,
      phoneNumber,
      numberOfGuest,
      seatingArea,
      note,
      dateTime: date, // Lưu vào MongoDB dưới dạng đối tượng Date
      createdAt: new Date(), // Thời gian tạo được lưu dưới dạng đối tượng Date
      status: "pending", // Trạng thái mặc định
    });

    // Lưu đối tượng vào MongoDB
    const savedReservation = await newReservation.save();

    // Chuyển đổi _id thành chuỗi nếu cần
    savedReservation._id = savedReservation._id.toString();

    // Trả về kết quả đã lưu dưới dạng JSON
    res.status(201).json(savedReservation);
  } catch (error) {
    // Xử lý lỗi nếu có
    res.status(400).json({ message: "Error creating reservation", error });
  }
};

//Cập nhật lại reservation
exports.updateReservation = async (req, res) => {
  try {
    const { id } = req.params;

    // Loại bỏ các trường không được phép cập nhật
    const { _id, __v, createdAt, ...updateData } = req.body;

    // Cập nhật chỉ với dữ liệu hợp lệ
    const updated = await Reservation.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Xóa reservation
exports.deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedReservation = await Reservation.findByIdAndDelete(id);

    if (!deletedReservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Reservation deleted successfully",
      data: deletedReservation,
    });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting reservation",
    });
  }
};
