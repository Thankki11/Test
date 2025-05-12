import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import adminPhoto from "../../assets/images/login-photo.jpg";
import loginBackground from "../../assets/images/login-bg.jpg";
import logo from "../../assets/images/logo-black.png";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/api/auth/login",
        {
          username,
          password,
        }
      );

      if (response.data.role === "admin") {
        // Lưu token vào localStorage
        localStorage.setItem("adminToken", response.data.token);
        navigate("/admin"); // Điều hướng đến trang admin dashboard
      } else {
        setError("Access denied. Admins only.");
      }
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center py-5"
      style={{
        backgroundImage: `url(${loginBackground})`, // dùng ảnh nền admin
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        position: "relative",
        margin: 0,
      }}
    >
      {/* Overlay mờ */}
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
        }}
      />

      {/* Card chứa nội dung */}
      <div
        className="card shadow p-5"
        style={{
          maxWidth: "1000px",
          width: "100%",
          borderRadius: "1rem",
          backgroundColor: "#fff",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div className="row d-flex align-items-center">
          {/* Bên trái: form đăng nhập */}
          <div className="col-md-6">
            <div className="text-center mb-4">
              <img
                src={logo}
                alt="admin-logo"
                className="rounded-circle"
                style={{ width: "auto", height: "50px", objectFit: "cover" }}
              />
            </div>

            <h2 className="text-center mb-4 text-uppercase fw-semibold">
              Admin
            </h2>

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control form-control-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <p className="text-danger">{error}</p>}

              <button type="submit" className="btn-lg w-100 fw-semibold">
                Login
              </button>
            </form>
          </div>

          {/* Bên phải: hình ảnh minh họa hoặc trang trí */}
          <div className="col-md-6 d-none d-md-block">
            <img
              src={adminPhoto} // ảnh minh họa trang admin
              alt="admin-illustration"
              className="img-fluid w-100"
              style={{
                height: "65vh",
                objectFit: "cover",
                borderRadius: "0.5rem",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
