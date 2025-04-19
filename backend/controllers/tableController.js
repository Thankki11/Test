const Table = require("../models/tableModel");

// Lấy danh sách tất cả các khu vực (seatingArea) không trùng lặp
exports.getSeatingAreas = async (req, res) => {
  try {
    // Sử dụng aggregation để lấy danh sách các seatingArea không trùng lặp
    const areas = await Table.aggregate([
      {
        $group: {
          _id: "$seatingArea",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          count: 1,
        },
      },
      {
        $sort: { name: 1 }, // Sắp xếp theo tên khu vực
      },
    ]);

    // Chỉ lấy mảng tên các khu vực
    const areaNames = areas.map((area) => area.name);

    res.status(200).json({
      success: true,
      data: areaNames,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách khu vực:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách khu vực",
    });
  }
};

//Tạo bàn mới
exports.createTable = async (req, res) => {
  try {
    const { tableNumber, seatingArea, tableType, capacity, note } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!tableNumber || !seatingArea || !tableType || !capacity) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Kiểm tra trùng tableNumber
    const existingTable = await Table.findOne({ tableNumber });
    if (existingTable) {
      return res.status(409).json({ message: "Table number already exists." });
    }

    const newTable = new Table({
      tableNumber,
      seatingArea,
      tableType,
      capacity,
      note,
    });

    await newTable.save();

    res
      .status(201)
      .json({ message: "Table created successfully", data: newTable });
  } catch (error) {
    console.error("Error creating table:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Lấy số bàn tiếp theo (tìm số nhỏ nhất chưa tồn tại)
exports.getNextTableNumber = async (req, res) => {
  try {
    const tables = await Table.find({}, "tableNumber").sort("tableNumber");

    const usedNumbers = tables.map((t) => t.tableNumber).sort((a, b) => a - b);

    let nextNumber = 1;
    for (let i = 0; i < usedNumbers.length; i++) {
      if (usedNumbers[i] !== nextNumber) {
        break;
      }
      nextNumber++;
    }

    res.status(200).json({ nextTableNumber: nextNumber });
  } catch (error) {
    console.error("Lỗi khi lấy số bàn tiếp theo:", error);
    res.status(500).json({ error: "Không thể lấy số bàn tiếp theo" });
  }
};

//Lấy toàn bộ bàn
exports.getAllTables = async (req, res) => {
  try {
    const tables = await Table.find().sort({ tableNumber: 1 }); // sắp xếp theo số bàn tăng dần
    res.status(200).json({ success: true, data: tables });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bàn:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};
