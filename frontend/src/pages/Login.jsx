import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo-black.png";
import "@fortawesome/fontawesome-free/css/all.min.css";
import loginPhoto from "../assets/images/login-photo.jpg";
import loginBackground from "../assets/images/login-bg.jpg";
import ReCAPTCHA from "react-google-recaptcha";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy token từ URL nếu có (dành cho Google/Facebook)
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // Lưu token vào localStorage
      localStorage.setItem("token", token);

      // Lấy thông tin người dùng từ token
      fetchUserInfo(token);

      // Xóa token khỏi URL
      window.history.replaceState({}, document.title, "/");

      // Chuyển hướng đến trang chủ
      navigate("/");
    }
  }, [navigate]);

  const fetchUserInfo = async (token) => {
    try {
      const response = await fetch("http://localhost:3001/api/auth/user/info", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await response.json();

      // Lưu thông tin người dùng vào localStorage
      localStorage.setItem("user", JSON.stringify(user));
    } catch (err) {
      console.error("Failed to fetch user info:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!captchaToken) {
      alert("Please verify that you are not a robot.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/api/auth/user/login",
        { ...formData, captchaToken }
      );
      const { token } = response.data;

      // Save token and user info to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Emit an event to notify other components
      window.dispatchEvent(new Event("userLoggedIn"));

      // Redirect to the previous page or home page
      const redirectUrl = localStorage.getItem("redirectUrl") || "/";
      localStorage.removeItem("redirectUrl"); // Clear the stored URL after redirecting
      navigate(redirectUrl);
    } catch (err) {
      console.error("Login failed:", err);
      alert("Invalid email, password, or captcha.");
    }
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center py-5"
      style={{
        backgroundImage: `url(${loginBackground})`,
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
              Login
            </h2>

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="form-label"
                  style={{ fontSize: "16px" }}
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  style={{ fontSize: "14px" }}
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control form-control-lg"
                  id="email"
                  placeholder="youremail@example.com"
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
                <div className="d-flex align-items-center justify-content-center">
                  <input
                    style={{ fontSize: "14px" }}
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
                    className={`fa ${
                      showPassword ? "fa-eye" : "fa-eye-slash"
                    } position-absolute`}
                    style={{
                      right: "15px",
                      cursor: "pointer",
                      color: "#888",
                    }}
                    onClick={() => setShowPassword(!showPassword)}
                  ></i>
                </div>
              </div>

              <div className="mb-4">
                <ReCAPTCHA
                  sitekey="6Ldv5TUrAAAAALi0n0nZ37XS5w8Jtwj1DhpbE6Az"
                  onChange={handleCaptchaChange}
                />
              </div>

              <button type="submit" className=" btn-lg w-100 fw-semibold">
                Login
              </button>
            </form>

            <button
              className="btn btn-danger w-100 mb-3"
              onClick={() =>
                (window.location.href =
                  "http://localhost:3001/api/auth/user/google")
              }
            >
              <i className="fab fa-google"></i> Login with Google
            </button>

            <button
              className="btn btn-primary w-100"
              onClick={() =>
                (window.location.href =
                  "http://localhost:3001/api/auth/user/facebook")
              }
            >
              <i className="fab fa-facebook"></i> Login with Facebook
            </button>

            <p className="text-center mt-4" style={{ fontSize: "16px" }}>
              Don't have an account?{" "}
              <a
                href="/register"
                className="text-decoration-none fw-semibold"
                style={{ color: "#b8860b" }}
              >
                Sign up now
              </a>
            </p>
          </div>
          <div className="col-7">
            <img
              src={loginPhoto}
              alt="description"
              className="img-fluid w-100 object-cover"
              style={{ height: "65vh", objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
