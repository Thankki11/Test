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
