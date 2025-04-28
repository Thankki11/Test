import React, { useState } from "react";
import axios from "axios";
import logo from "../assets/images/logo-black.png";
import "@fortawesome/fontawesome-free/css/all.min.css";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/api/auth/user/register",
        formData
      );
      alert(response.data.message);
    } catch (err) {
      console.error(err);
      alert("Registration failed. Please try again.");
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
          Sign Up
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-control form-control-lg"
              id="username"
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control form-control-lg"
              id="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="phone" className="form-label">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-control form-control-lg"
              id="phone"
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="mb-4 position-relative">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control form-control-lg"
              id="password"
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn btn-danger btn-lg w-100 fw-semibold">
            Sign Up
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-decoration-none text-primary fw-semibold">Login now</a>
        </p>
      </div>
    </div>
  );
}

export default Register;