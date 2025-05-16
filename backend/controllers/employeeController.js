const Employee = require("../models/employeeModel");

// Lấy danh sách nhân viên
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ message: "Error fetching employees", error: err });
  }
};

// Thêm nhân viên mới
exports.addEmployee = async (req, res) => {
  try {
    const { name, email, phone, position, salary } = req.body;

    // Kiểm tra trùng email
    const existingEmail = await Employee.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Cannot add employee. Email already exists." });
    }

    // Kiểm tra trùng phone
    const existingPhone = await Employee.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ message: "Cannot add employee. Phone number already exists." });
    }

    const newEmployee = new Employee({ name, email, phone, position, salary });
    await newEmployee.save();
    res.status(201).json({ message: "Employee added successfully", employee: newEmployee });
  } catch (err) {
    res.status(500).json({ message: "Error adding employee", error: err });
  }
};

// Cập nhật thông tin nhân viên
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, phone, ...updatedData } = req.body;

    // Kiểm tra trùng email
    const existingEmail = await Employee.findOne({ email, _id: { $ne: id } });
    if (existingEmail) {
      return res.status(400).json({ message: "Cannot update employee. Email already exists." });
    }

    // Kiểm tra trùng phone
    const existingPhone = await Employee.findOne({ phone, _id: { $ne: id } });
    if (existingPhone) {
      return res.status(400).json({ message: "Cannot update employee. Phone number already exists." });
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { email, phone, ...updatedData },
      { new: true }
    );
    res.status(200).json({ message: "Employee updated successfully", employee: updatedEmployee });
  } catch (err) {
    res.status(500).json({ message: "Error updating employee", error: err });
  }
};

// Xóa nhân viên
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    await Employee.findByIdAndDelete(id);
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting employee", error: err });
  }
};