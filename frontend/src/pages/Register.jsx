import React, { useState } from "react";
import axios from "axios";
import logo from "../assets/images/logo-black.png";
import "@fortawesome/fontawesome-free/css/all.min.css";
import registerBackground from "../assets/images/login-bg.jpg";
import registerPhoto from "../assets/images/register-photo.jpg";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

function Register() {
  const navigate = useNavigate();
  const [captchaToken, setCaptchaToken] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      alert("Please verify that you are not a robot.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/api/auth/user/register",
        { ...formData, captchaToken }
      );
      alert(response.data.message);
      navigate("/login");
    } catch (err) {
      console.error("Registration failed:", err);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center py-5"
      style={{
        backgroundImage: `url(${registerBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        position: "relative",
        margin: "0px 0px",
      }}
    >
      {/* Lớp overlay đen mờ */}
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
      <div
        className="card shadow p-5"
        style={{
          maxWidth: "1000px",
          width: "100%",
          borderRadius: "1rem",
          fontSize: "1.2rem",
          backgroundColor: "#fff",
          padding: "0px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div className="row d-flex align-items-center">
          <div className="col-5">
            <div className="text-center mb-4">
              <img
                src={logo}
                alt="logo"
                className="rounded-circle"
                style={{ width: "auto", height: "50px", objectFit: "cover" }}
              />
            </div>

            <h2
              className="text-center mb-4 text-uppercase fw-semibold"
              style={{ letterSpacing: "20px" }}
            >
              Sign Up
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="form-label"
                  style={{ fontSize: "16px" }}
                >
                  Full Name
                </label>
                <input
                  style={{ fontSize: "14px" }}
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
                <label
                  htmlFor="email"
                  className="form-label"
                  style={{ fontSize: "16px" }}
                >
                  Email
                </label>
                <input
                  style={{ fontSize: "14px" }}
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
                <label
                  htmlFor="phone"
                  className="form-label"
                  style={{ fontSize: "16px" }}
                >
                  Phone
                </label>
                <input
                  style={{ fontSize: "14px" }}
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
                <label
                  htmlFor="password"
                  className="form-label"
                  style={{ fontSize: "16px" }}
                >
                  Password
                </label>
                <input
                  style={{ fontSize: "14px" }}
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

              <div className="mb-4 position-relative">
                <label
                  htmlFor="confirmPassword"
                  className="form-label"
                  style={{ fontSize: "16px" }}
                >
                  Confirm Password
                </label>
                <input
                  style={{ fontSize: "14px" }}
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-control form-control-lg"
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  required
                />
              </div>

              <div className="mb-4">
                <ReCAPTCHA
                  sitekey="6Ldv5TUrAAAAALi0n0nZ37XS5w8Jtwj1DhpbE6Az"
                  onChange={handleCaptchaChange}
                />
              </div>

              <button type="submit" className="btn-lg w-100 fw-semibold">
                Sign Up
              </button>
            </form>

            <p className="text-center mt-4" style={{ fontSize: "16px" }}>
              Already have an account?{" "}
              <a
                href="/login"
                className="text-decoration-none fw-semibold"
                style={{ color: "#b8860b" }}
              >
                Login now
              </a>
            </p>
          </div>
          <div className="col-7">
            <img
              src={registerPhoto}
              alt="description"
              className="img-fluid w-100 object-cover"
              style={{ height: "80vh", objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
