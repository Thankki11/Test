import React, { useState, useEffect } from "react";
import axios from "axios";

function UserInfo() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3001/api/auth/user/info", {
          headers: { Authorization: `Bearer ${token}` },
        });
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

  return (
    <div className="container mt-5">
      <h2>User Information</h2>
      <div className="card p-4">
        <div className="text-center mb-4">
          <img
            src={user.avatar || "http://localhost:3001/uploads/default-avatar.png.jpeg"}
            alt="User Avatar"
            className="rounded-circle"
            style={{ width: "150px", height: "150px", objectFit: "cover" }}
          />
        </div>
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
  );
}

export default UserInfo;