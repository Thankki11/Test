import React from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/images/login-bg.jpg";

import logo from "../assets/images/logo-black.png";

function PaymentSuccess() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/"); // Điều hướng về trang chủ
  };

  const handleViewOrders = () => {
    navigate("/my-orders"); // Điều hướng đến trang danh sách đơn hàng
  };

  return (
    <div
      className="container-fluid d-flex flex-column align-items-center"
      style={{
        minHeight: "100vh",
        textAlign: "center",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <img
        src={logo}
        alt="logo"
        className="rounded-circle"
        style={{
          width: "auto",
          height: "100px",
          objectFit: "cover",
          marginTop: "10vh",
        }}
      />
      <div
        className="card shadow p-5"
        style={{
          maxWidth: "600px",
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
        }}
      >
        <h1 className="text-success mb-4">Payment Successful!</h1>
        <p className="mb-4">
          Thank you for your purchase. Your payment has been successfully
          processed.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <button onClick={handleGoHome}>Go to Home</button>
          <button onClick={handleViewOrders}>View My Orders</button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
