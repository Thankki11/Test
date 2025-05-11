import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";

function EditProfile() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
  });
  const [avatar, setAvatar] = useState(null); // State for avatar file
  const [previewAvatar, setPreviewAvatar] = useState(""); // State for avatar preview

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:3001/api/auth/user/info",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const user = response.data;
        setFormData({
          username: user.username || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
        });
        setPreviewAvatar(
          user.avatar ||
            "http://localhost:3001/uploads/users/default-avatar.png"
        );
      } catch (err) {
        console.error("Failed to fetch user info:", err);
        alert("Failed to load user information. Please try again.");
      }
    };

    fetchUserInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    setPreviewAvatar(URL.createObjectURL(file)); // Show a preview of the uploaded avatar
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      // Update profile information
      await axios.put("http://localhost:3001/api/auth/user/update", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update avatar if a new file is selected
      if (avatar) {
        const formData = new FormData();
        formData.append("avatar", avatar);

        await axios.post(
          "http://localhost:3001/api/auth/user/update-avatar",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      alert("Profile updated successfully!");
      window.location.reload(); // Reload the page to reflect changes
    } catch (err) {
      console.error(err);
      alert("Failed to update profile. Please try again.");
    }
  };

  // Style dùng inline
  const linkStyle = {
    padding: "8px 12px",
    borderRadius: "4px",
    display: "block",
    textDecoration: "none",
    color: "#333",
  };

  const activeLinkStyle = {
    ...linkStyle,
    backgroundColor: "#ede7d8",
    color: "#b8860b",
    fontWeight: "bold",
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row">
        {/* Sidebar */}
        <div className="col-3">
          <div className="card p-3 shadow-sm">
            <ul className="nav flex-column">
              <li className="nav-item mb-2" style={{ fontSize: "16px" }}>
                <NavLink
                  to="/user-info"
                  style={({ isActive }) =>
                    isActive ? activeLinkStyle : linkStyle
                  }
                >
                  Account Information
                </NavLink>
              </li>
              <li className="nav-item mb-2" style={{ fontSize: "16px" }}>
                <NavLink
                  to="/edit-profile"
                  style={({ isActive }) =>
                    isActive ? activeLinkStyle : linkStyle
                  }
                >
                  Edit Profile
                </NavLink>
              </li>
              <li className="nav-item" style={{ fontSize: "16px" }}>
                <NavLink
                  to="/my-orders"
                  style={({ isActive }) =>
                    isActive ? activeLinkStyle : linkStyle
                  }
                >
                  My Orders
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-9">
          <h2 className="mb-4" style={{ fontSize: "40px" }}>
            Edit Profile
          </h2>
          <div className="card p-4 shadow-sm">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-8">
                  <div className="mb-3">
                    <label className="form-label">Change Avatar</label>
                    <input
                      type="file"
                      name="avatar"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="form-control"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-4">
                  <div className="text-center mb-4">
                    <img
                      src={previewAvatar}
                      alt="Avatar Preview"
                      className="rounded-circle"
                      style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div className="text-center mt-1">
                    <p>Current Avatar</p>
                  </div>
                  <div className="text-center mt-3">
                    <button type="submit">Save Changes</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
