import ReservationBackground from "../assets/images/reservation-background.jpg";
import ContactBox from "../components/Box/ContactBox";
import logo from "../assets/images/logo-white.png";

import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

function Reservation() {
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [navigate]);

  return (
    <div
      className="section"
      style={{
        backgroundImage: `url(${ReservationBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        position: "relative",
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
      <div className="row" style={{ position: "relative", zIndex: 2 }}>
        <div className="col-5 p-2 rounded" style={{ backgroundColor: "white" }}>
          <div className="container">
            <div className="text-center">
              <img
                src={logo}
                alt="CFK Logo"
                style={{ width: "auto", height: "200px" }}
              />
            </div>
            <div style={{ margin: "0px 30px" }}>
              {" "}
              <h2 className="text-center mt-3" style={{ fontSize: "40px" }}>
                CFK-Fast Food Restaurant
              </h2>
              <p
                className="text-center mt-2"
                style={{ fontSize: "16px", fontStyle: "italic" }}
              >
                Your go-to place for delicious and fast food!
              </p>
              <div className="mt-4">
                <h6>About Us</h6>
                <p style={{ fontStyle: "italic" }}>
                  "At CFK, we serve a wide variety of fast food options that are
                  both delicious and affordable. Whether you're craving burgers,
                  fries, pizza, or a quick snack, we have something for
                  everyone.
                </p>
                <p style={{ fontStyle: "italic" }}>
                  Our mission is to provide fast, fresh, and tasty meals that
                  can be enjoyed on the go. All of our ingredients are carefully
                  selected to ensure the best quality for our customers."
                </p>
              </div>
              <div className="mt-4 text-center">
                <p>Come and enjoy the best fast food experience at CFK!</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-1"></div>
        <div className="col-6">
          <h6 style={{ color: "white" }}>Your table, your way</h6>
          <h2 style={{ color: "white" }}>
            Here You Can Book a Table — Or Simply Drop By and Dine With Us
          </h2>

          <p style={{ color: "white" }} className="mb-5">
            Whether you’re planning ahead or just passing by, our doors are
            always open. Enjoy authentic flavors, cozy ambiance, and a dining
            experience to remember—your table is ready when you are.
          </p>
          <div className="row">
            <div className="col-6">
              <ContactBox
                title={"Email"}
                emails={["CFKfastfood@gmail.com", "Thank@gmail.com"]}
                logo="fa fa-envelope"
              />
            </div>
            <div className="col-6">
              <ContactBox
                title={"Phone Numbers"}
                phoneNumbers={["0976412697", "0372817283"]}
                logo="fa fa-phone"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reservation;
