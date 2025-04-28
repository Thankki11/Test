import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo-black.png";
import "@fortawesome/fontawesome-free/css/all.min.css";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/api/auth/user/login", formData);
      const { token } = response.data;

      // Save token and user info to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Emit an event to notify other components
      window.dispatchEvent(new Event("userLoggedIn"));

      // Redirect to the home page
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
      alert("Invalid email or password");
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center py-5 bg-light">
      <div
        className="card shadow p-5"
        style={{
          maxWidth: "800px",
          width: "100%",
          borderRadius: "1rem",
          fontSize: "1.2rem",
          backgroundColor: "#fff",
        }}
      >
        <div className="text-center mb-4">
          <img
            src={logo}
            alt="logo"
            className="rounded-circle"
            style={{ width: "270px", height: "100px", objectFit: "cover" }}
          />
        </div>

        <h2 className="text-center mb-4 text-uppercase fw-semibold" style={{ letterSpacing: "2px" }}>
          Login
        </h2>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control form-control-lg"
              id="email"
              placeholder="youremail@example.com"
              required
            />
          </div>

          <div className="mb-4 position-relative">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control form-control-lg"
              id="password"
              placeholder="Password"
              required
            />
            <i
              className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"} position-absolute`}
              style={{ top: "50px", right: "15px", cursor: "pointer", color: "#888" }}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>

          <button type="submit" className="btn btn-danger btn-lg w-100 fw-semibold">
            Login
          </button>
        </form>

        <p className="text-center mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-decoration-none text-primary fw-semibold">Sign up now</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
