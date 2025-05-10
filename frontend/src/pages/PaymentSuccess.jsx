import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paymentStatus = queryParams.get("paymentStatus");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      {paymentStatus === "success" ? (
        <>
          <h1 style={{ color: "green", marginBottom: "20px" }}>Payment Successful!</h1>
          <p style={{ fontSize: "18px", marginBottom: "30px" }}>
            Thank you for your purchase. Your order has been successfully processed.
          </p>
        </>
      ) : (
        <>
          <h1 style={{ color: "red", marginBottom: "20px" }}>Payment Failed!</h1>
          <p style={{ fontSize: "18px", marginBottom: "30px" }}>
            Unfortunately, your payment could not be processed. Please try again.
          </p>
        </>
      )}
      <button
        onClick={() => navigate("/")}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Back to Home
      </button>
    </div>
  );
}

export default PaymentSuccess;