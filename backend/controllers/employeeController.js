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
    const updatedData = req.body;
    const updatedEmployee = await Employee.findByIdAndUpdate(id, updatedData, { new: true });
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