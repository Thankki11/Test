import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";

function UserInfo() {
  const [user, setUser] = useState(null);

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
        setUser(response.data);
      } catch (err) {
        console.error("Failed to fetch user info:", err);
        alert("Failed to load user information. Please try again.");
      }
    };

    fetchUserInfo();
  }, []);

  if (!user) {
    return <p>Loading user information...</p>;
  }

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
            Account Information
          </h2>
          <div className="card p-4 shadow-sm">
            <div className="d-flex align-items-center row">
              <div className="col-4">
                <div className="me-4">
                  <img
                    src={
                      user.avatar ||
                      "http://localhost:3001/uploads/users/default-avatar.png"
                    }
                    alt="User Avatar"
                    className="rounded-circle"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>

              <div className="col-8">
                <p>
                  <strong>Full Name:</strong> {user.username || "N/A"}
                </p>
                <p>
                  <strong>Email Address:</strong> {user.email || "N/A"}
                </p>
                <p>
                  <strong>Phone Number:</strong> {user.phone || "N/A"}
                </p>
                <p>
                  <strong>Address:</strong> {user.address || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserInfo;
