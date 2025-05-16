import React, { useEffect, useState } from "react";
import axios from "axios";

import * as bootstrap from "bootstrap";

function AdminEmployees() {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    salary: "",
  });
  const [editEmployee, setEditEmployee] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 10;

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/employees");
      setEmployees(response.data || []);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  const handleAddEmployee = async () => {
    try {
      await axios.post("http://localhost:3001/api/employees", newEmployee);
      alert("Employee added successfully");
      setNewEmployee({
        name: "",
        email: "",
        phone: "",
        position: "",
        salary: "",
      });
      fetchEmployees();
    } catch (err) {
      if (err.response && err.response.status === 400) {
        alert(err.response.data.message); // Hiển thị thông báo lỗi từ backend
      } else {
        console.error("Error adding employee:", err);
        alert("Failed to add employee. Please try again.");
      }
    }
  };

  const handleEdit = (employee) => {
    setEditEmployee({ ...employee });
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `http://localhost:3001/api/employees/${editEmployee._id}`,
        editEmployee
      );
      alert("Employee updated successfully");
      setEditEmployee(null);
      fetchEmployees();
    } catch (err) {
      if (err.response && err.response.status === 400) {
        alert(err.response.data.message); // Hiển thị thông báo lỗi từ backend
      } else {
        console.error("Error updating employee:", err);
        alert("Failed to update employee. Please try again.");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(`http://localhost:3001/api/employees/${id}`);
        alert("Employee deleted successfully");
        fetchEmployees();
      } catch (err) {
        console.error("Error deleting employee:", err);
      }
    }
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  return (
    <div className="container">
      <h2 className="text-center mb-3">Employee Management</h2>

      {/* Search and Add Employee */}
      <div className="d-flex align-items-center justify-content-center gap-3 mb-2 text-center">
        <span style={{ fontWeight: "bold", marginRight: "10px" }}>Search:</span>
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by name..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <button
          className=""
          onClick={() =>
            new bootstrap.Modal(
              document.getElementById("addEmployeeModal")
            ).show()
          }
        >
          Add Employee
        </button>
      </div>

      {/* Employee List */}
      <div className="card">
        <div className="card-body">
          <span style={{ fontWeight: "bold", fontSize: "20px" }}>
            Employees List
          </span>
          <table
            className="table table-striped table-bordered"
            style={{ tableLayout: "fixed", width: "100%" }}
          >
            <thead>
              <tr>
                <th style={{ width: "20%" }}>Name</th>
                <th style={{ width: "15%" }}>Email</th>
                <th style={{ width: "10%" }}>Phone</th>
                <th style={{ width: "15%" }}>Position</th>
                <th style={{ width: "10%" }}>Salary</th>
                <th style={{ width: "20%" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentEmployees.length > 0 ? (
                currentEmployees.map((employee) => (
                  <tr key={employee._id}>
                    <td>{employee.name}</td>
                    <td>{employee.email}</td>
                    <td>{employee.phone}</td>
                    <td>{employee.position}</td>
                    <td>${employee.salary}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn-select selected me-2"
                          onClick={() => {
                            handleEdit(employee);
                            new bootstrap.Modal(
                              document.getElementById("editEmployeeModal")
                            ).show();
                          }}
                        >
                          <i class="fa fa-edit"></i>
                        </button>
                        <button
                          className="btn-select"
                          onClick={() => handleDelete(employee._id)}
                        >
                          <i class="fa fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No employees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {filteredEmployees.length > 0 && (
            <div className="d-flex justify-content-center align-items-center mt-3 gap-3">
              <button
                className=""
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                className=""
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Employee Modal */}
      <div className="modal fade" id="addEmployeeModal" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Employee</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={newEmployee.name}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, name: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={newEmployee.email}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, email: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  className="form-control"
                  value={newEmployee.phone}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, phone: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Position</label>
                <input
                  type="text"
                  className="form-control"
                  value={newEmployee.position}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, position: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Salary</label>
                <input
                  type="number"
                  className="form-control"
                  value={newEmployee.salary}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, salary: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="" data-bs-dismiss="modal">
                Cancel
              </button>
              <button
                className=""
                onClick={() => {
                  handleAddEmployee();
                  bootstrap.Modal.getInstance(
                    document.getElementById("addEmployeeModal")
                  )?.hide();
                }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Employee Modal */}
      <div className="modal fade" id="editEmployeeModal" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            {editEmployee && (
              <>
                <div className="modal-header">
                  <h5 className="modal-title">Edit Employee</h5>
                  <button
                    className="btn-close"
                    data-bs-dismiss="modal"
                    onClick={() => setEditEmployee(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editEmployee.name}
                      onChange={(e) =>
                        setEditEmployee({
                          ...editEmployee,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={editEmployee.email}
                      onChange={(e) =>
                        setEditEmployee({
                          ...editEmployee,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editEmployee.phone}
                      onChange={(e) =>
                        setEditEmployee({
                          ...editEmployee,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Position</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editEmployee.position}
                      onChange={(e) =>
                        setEditEmployee({
                          ...editEmployee,
                          position: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Salary</label>
                    <input
                      type="number"
                      className="form-control"
                      value={editEmployee.salary}
                      onChange={(e) =>
                        setEditEmployee({
                          ...editEmployee,
                          salary: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className=""
                    data-bs-dismiss="modal"
                    onClick={() => setEditEmployee(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className=""
                    onClick={() => {
                      handleSave();
                      bootstrap.Modal.getInstance(
                        document.getElementById("editEmployeeModal")
                      )?.hide();
                    }}
                  >
                    Save
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminEmployees;