import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import * as bootstrap from "bootstrap";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
  });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedRole, setSelectedRole] = useState("");
  const usersPerPage = 10;
  useEffect(() => {
    setCurrentPage(1);
  }, [searchKeyword]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get("http://localhost:3001/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const isValidPhoneNumber = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const handleAddUser = async () => {
    if (!isValidPhoneNumber(newUser.phone)) {
      alert("Invalid phone number. Please enter a 10-digit number.");
      return;
    }

    if (!newUser.email || !newUser.password) {
      alert("Email and password are required.");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      await axios.post("http://localhost:3001/api/admin/users", newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("User added successfully");
      setNewUser({ username: "", email: "", phone: "", password: "", role: "user" });
      fetchUsers();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message); // Hiển thị thông báo lỗi từ backend
      } else {
        console.error("Error adding user:", err);
        alert("Failed to add user. Please try again.");
      }
    }
  };

  const handleEdit = (user) => {
    setEditUser({ ...user, password: "" }); // Thêm trường mật khẩu trống
  };

  const handleSave = async () => {
    if (!isValidPhoneNumber(editUser.phone)) {
      alert("Invalid phone number. Please enter a 10-digit number.");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");

      // Chỉ gửi trường `password` nếu admin nhập mật khẩu mới
      const updatedUser = { ...editUser };
      if (!updatedUser.password) {
        delete updatedUser.password;
      }

      await axios.put(
        `http://localhost:3001/api/admin/users/${editUser._id}`,
        updatedUser,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("User updated successfully");
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Failed to update user. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = localStorage.getItem("adminToken");
        await axios.delete(`http://localhost:3001/api/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("User deleted successfully");
        fetchUsers();
      } catch (err) {
        console.error("Error deleting user:", err);
      }
    }
  };
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredUsers = users
  .filter((user) => {
    const keyword = searchKeyword.toLowerCase();
    const matchesSearch =
      user.username.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword) ||
      user.phone.includes(keyword) ||
      user.role.toLowerCase().includes(keyword);

    const matchesRole = selectedRole === "" || user.role === selectedRole;

    return matchesSearch && matchesRole;
  })
  .sort((a, b) => {
    if (!sortField) return 0;

    const valA = a[sortField];
    const valB = b[sortField];

    return sortOrder === "asc"
      ? valA.localeCompare(valB)
      : valB.localeCompare(valA);
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);


  return (
    <div className="container">
      <h2 className="text-center mb-3">User Management</h2>
      

      <div className="d-flex align-items-center justify-content-center gap-3 mb-2 text-center">
        <span style={{ fontWeight: "bold", marginRight: "10px" }}>Search:</span>
          <input
            type="text"
            className="form-control w-50"
            placeholder="Search by username, email, phone, role..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <select
            className="form-select"
            style={{ width: "160px" }}
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value);
              setCurrentPage(1); // reset page
            }}
          >
            <option value="">All roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

        <button
          className=""
          onClick={() => new bootstrap.Modal(document.getElementById("addUserModal")).show()}
        >
          Add User
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <span style={{ fontWeight: "bold", fontSize: "20px" }}>
            Users List
          </span>
        <table className="table table-striped table-bordered" style={{ tableLayout: "fixed", width: "100%" }}>
        <thead>
          <tr>
            <th
              style={{ width: "24%", cursor: "pointer" }}
              onClick={() => handleSort("username")}
            >
              Username {sortField === "username" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th style={{ width: "41.5%" }}>Email</th>
            <th style={{ width: "10%" }}>Phone</th>
            <th style={{ width: "4.5%" }}>Role</th>
            <th
              style={{
                width: "20%",
                position: "sticky",
                right: 0,
                background: "#fff",
                zIndex: 1,
              }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.length > 0 ? (
            currentUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.role}</td>
                <td
                  style={{
                    position: "sticky",
                    right: 0,
                    background: "#fff",
                  }}
                >
                  <button
                    className="btn-select selected me-2"
                    onClick={() => {
                      handleEdit(user);
                      new bootstrap.Modal(document.getElementById("editUserModal")).show();
                    }}
                  >
                    Edit
                  </button>

                  <button 
                    className="btn-select"
                    onClick={() => handleDelete(user._id)}>Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No matching users found</td>
            </tr>
          )}
        </tbody>
      </table>
      {filteredUsers.length > 0 && (
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
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  </div>

      {/* Modal Thêm User */}
      <div className="modal fade" id="addUserModal" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New User</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  className="form-control"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="" data-bs-dismiss="modal">Cancel</button>
              <button
                className=""
                onClick={() => {
                  handleAddUser();
                  bootstrap.Modal.getInstance(document.getElementById("addUserModal"))?.hide();
                }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Edit User */}
    <div className="modal fade" id="editUserModal" tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          {editUser && (
            <>
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button
                  className="btn-close"
                  data-bs-dismiss="modal"
                  onClick={() => setEditUser(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editUser.username}
                    onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={editUser.email}
                    onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editUser.phone}
                    onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="New Password (Optional)"
                    value={editUser.password}
                    onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <select
                    className="form-select"
                    value={editUser.role}
                    onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className=""
                  data-bs-dismiss="modal"
                  onClick={() => setEditUser(null)}
                >
                  Cancel
                </button>
                <button
                  className=""
                  onClick={() => {
                    handleSave();
                    bootstrap.Modal.getInstance(document.getElementById("editUserModal"))?.hide();
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

export default AdminUsers;