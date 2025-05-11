import React from "react";
import { useNavigate } from "react-router-dom";

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
      className="container d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: "100vh", textAlign: "center" }}
    >
      <div className="card shadow p-5" style={{ maxWidth: "600px", width: "100%" }}>
        <h1 className="text-success mb-4">Payment Successful!</h1>
        <p className="mb-4">
          Thank you for your purchase. Your payment has been successfully processed.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <button className="btn btn-primary" onClick={handleGoHome}>
            Go to Home
          </button>
          <button className="btn btn-secondary" onClick={handleViewOrders}>
            View My Orders
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;