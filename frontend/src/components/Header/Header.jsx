import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo-black.png";
import styles from "./Header.module.css";
import ButtonWhite from "../Buttons/ButtonWhite";

import CartItem from "../CartItem";

import { Offcanvas } from "bootstrap";

import React, { useEffect, useState } from "react";
import axios from "axios";

function Header() {
  const [items, setItems] = useState([]);
  const [combos, setCombos] = useState([]);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // Fetch user information
  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(
        "http://localhost:3001/api/auth/user/info",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(response.data);
      setIsLoggedIn(true);
    } catch (err) {
      console.error("Failed to fetch user info:", err);
      setIsLoggedIn(false);
    }
  };

  // Load user info on mount
  useEffect(() => {
    fetchUserInfo();

    // Listen for the "userLoggedIn" event
    const handleUserLoggedIn = () => {
      fetchUserInfo();
    };
    window.addEventListener("userLoggedIn", handleUserLoggedIn);

    return () => {
      window.removeEventListener("userLoggedIn", handleUserLoggedIn);
    };
  }, []);

  // Start load cart from localStorage
  useEffect(() => {
    const loadCart = () => {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || {
        items: [],
        combos: [], // Đảm bảo combos cũng có sẵn trong giỏ hàng
      };
      // Cập nhật cả `items` và `combos` từ giỏ hàng vào state
      setItems(savedCart.items);
      setCombos(savedCart.combos); // Thêm setCombos để lưu combos vào state
      console.log(">>> check items:", Array.isArray(savedCart.items));
      console.log(">>> check combos:", Array.isArray(savedCart.combos));
    };

    loadCart();

    // Lắng nghe sự kiện "cartUpdated" để cập nhật lại giỏ hàng khi có thay đổi
    window.addEventListener("cartUpdated", loadCart);

    return () => {
      window.removeEventListener("cartUpdated", loadCart);
    };
  }, []); // Chạy 1 lần khi component được mount

  // End load cart from localStorage

  // Start handle scroll to show/hide header
  useEffect(() => {
    const controlHeader = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scroll down
        setHeaderVisible(false);
      } else {
        // Scroll up
        setHeaderVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlHeader, { passive: true });

    return () => {
      window.removeEventListener("scroll", controlHeader);
    };
  }, [lastScrollY]);
  // End handle scroll to show/hide header

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/login");
  };

  return (
    <>
      {/* *****offcanvas sidebar start***** */}
      <div
        className="offcanvas offcanvas-start w-25 d-flex flex-column"
        tabIndex="-1"
        id="cartSideBar"
        aria-labelledby="offcanvasDemoLabel"
      >
        {/* Header */}
        <div className="offcanvas-header shadow" style={{ zIndex: "10" }}>
          <div>
            <h6 style={{ marginBottom: "0px" }}>Review your selected items</h6>
            <h1
              className="offcanvas-title"
              id="offcanvasDemoLabel"
              style={{ fontSize: "35px" }}
            >
              Your cart
            </h1>
          </div>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>

        {/* Body */}
        <div className="offcanvas-body flex-grow-1 overflow-auto">
          <div style={{ minHeight: "100%" }}>
            {Array.isArray(items) &&
              items.map((item) => (
                <CartItem
                  key={item._id}
                  item={item}
                  onIncrease={(id) => {
                    const updatedItems = items.map((item) =>
                      item._id === id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                    );

                    // Lấy dữ liệu giỏ hàng hiện tại từ localStorage
                    const savedCart = JSON.parse(
                      localStorage.getItem("cart")
                    ) || { items: [], combos: [] };
                    savedCart.items = updatedItems;

                    // Cập nhật lại giỏ hàng cả `items` và `combos` vào localStorage
                    localStorage.setItem("cart", JSON.stringify(savedCart));
                    setItems(updatedItems);
                    window.dispatchEvent(new Event("cartUpdated"));
                  }}
                  onDecrease={(id) => {
                    const updatedItems = items.map((item) =>
                      item._id === id && item.quantity > 1
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                    );

                    // Lấy dữ liệu giỏ hàng hiện tại từ localStorage
                    const savedCart = JSON.parse(
                      localStorage.getItem("cart")
                    ) || { items: [], combos: [] };
                    savedCart.items = updatedItems;

                    // Cập nhật lại giỏ hàng cả `items` và `combos` vào localStorage
                    localStorage.setItem("cart", JSON.stringify(savedCart));
                    setItems(updatedItems);
                    window.dispatchEvent(new Event("cartUpdated"));
                  }}
                  onDelete={(id) => {
                    const confirmDelete = window.confirm(
                      "Are you sure you want to delete this item?"
                    );
                    if (confirmDelete) {
                      const updatedItems = items.filter(
                        (item) => item._id !== id
                      );

                      // Lấy dữ liệu giỏ hàng hiện tại từ localStorage
                      const savedCart = JSON.parse(
                        localStorage.getItem("cart")
                      ) || { items: [], combos: [] };
                      savedCart.items = updatedItems;

                      // Cập nhật lại giỏ hàng cả `items` và `combos` vào localStorage
                      localStorage.setItem("cart", JSON.stringify(savedCart));
                      setItems(updatedItems);
                      window.dispatchEvent(new Event("cartUpdated"));
                    }
                  }}
                />
              ))}

            {Array.isArray(combos) &&
              combos.map((combo) => (
                <CartItem
                  key={combo._id}
                  item={combo}
                  onIncrease={(id) => {
                    const updatedCombos = combos.map((combo) =>
                      combo._id === id
                        ? { ...combo, quantity: combo.quantity + 1 }
                        : combo
                    );
                    const savedCart = JSON.parse(
                      localStorage.getItem("cart")
                    ) || { items: [], combos: [] };
                    savedCart.combos = updatedCombos;

                    // Cập nhật lại giỏ hàng cả `items` và `combos` vào `localStorage`
                    localStorage.setItem("cart", JSON.stringify(savedCart));
                    setCombos(updatedCombos);
                    window.dispatchEvent(new Event("cartUpdated"));
                  }}
                  onDecrease={(id) => {
                    const updatedCombos = combos.map((combo) =>
                      combo._id === id && combo.quantity > 1
                        ? { ...combo, quantity: combo.quantity - 1 }
                        : combo
                    );
                    const savedCart = JSON.parse(
                      localStorage.getItem("cart")
                    ) || { items: [], combos: [] };
                    savedCart.combos = updatedCombos;

                    // Cập nhật lại giỏ hàng cả `items` và `combos` vào `localStorage`
                    localStorage.setItem("cart", JSON.stringify(savedCart));
                    setCombos(updatedCombos);
                    window.dispatchEvent(new Event("cartUpdated"));
                  }}
                  onDelete={(id) => {
                    const confirmDelete = window.confirm(
                      "Are you sure you want to delete this combo?"
                    );
                    if (confirmDelete) {
                      const updatedCombos = combos.filter(
                        (combo) => combo._id !== id
                      );
                      const savedCart = JSON.parse(
                        localStorage.getItem("cart")
                      ) || { items: [], combos: [] };
                      savedCart.combos = updatedCombos;

                      // Cập nhật lại giỏ hàng cả `items` và `combos` vào `localStorage`
                      localStorage.setItem("cart", JSON.stringify(savedCart));
                      setCombos(updatedCombos);
                      window.dispatchEvent(new Event("cartUpdated"));
                    }
                  }}
                />
              ))}
          </div>
        </div>

        {/* Footer */}
        <div
          className="offcanvas-footer p-3 border-top shadow"
          style={{ flexShrink: 0, zIndex: 10 }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <p className="mb-0 fw-bold">Total:</p>
            <span className="fs-4 fw-bold">
              $
              {[
                ...items, // Kết hợp mảng items
                ...combos, // Kết hợp mảng combos
              ]
                .reduce((total, item) => total + item.price * item.quantity, 0) // Tính tổng giá trị
                .toLocaleString()}{" "}
              {/* Định dạng giá trị theo chuẩn địa phương */}
            </span>
          </div>
          <Link to={"/check-out"}>
            <ButtonWhite
              buttontext={"Check Out"}
              className="w-100 mt-3 py-2"
              style={{ height: "40px", fontSize: "15px" }}
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            />
          </Link>
        </div>
      </div>
      {/* *****offcanvas sidebar end***** */}
      {/* *****Header start***** */}
      <header
        className={`d-flex align-items-center ${styles.header} ${
          headerVisible ? styles.visible : styles.hidden
        }`}
      >
        <div className="container-fluid">
          <div className="row justify-content-center">
            {/* Header Left */}
            <div
              className={
                "col-5 text-center  d-flex justify-content-between " +
                styles.nav
              }
            >
              <div>
                <ButtonWhite
                  buttontext={`Cart (${items.length + combos.length})`}
                  type="button"
                  onClick={() => {
                    const offCanvas = new Offcanvas(
                      document.getElementById("cartSideBar")
                    );
                    offCanvas.show();
                  }}
                />
              </div>
              <ul className={styles.mainMenus}>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/menus">Menus</Link>
                </li>
              </ul>
            </div>

            {/* Header Center */}
            <div className={"col-2 text-center " + styles.center}>
              <Link to="/">
                <img src={logo} alt="logo-black" />
              </Link>
            </div>

            {/* Header Right */}
            <div
              className={
                "col-5 text-center d-flex justify-content-between " + styles.nav
              }
            >
              <div>
                <ul className={styles.mainMenus}>
                  <li>
                    <Link to="/combos">Combos</Link>
                  </li>
                  <li>
                    <Link to="/about-us">About us</Link>
                  </li>
                </ul>
              </div>

              <div>
                {isLoggedIn ? (
                  <div
                    className="dropdown"
                    onMouseEnter={(e) => {
                      const button = e.currentTarget.querySelector("button");
                      const menu =
                        e.currentTarget.querySelector(".dropdown-menu");
                      button.classList.add("show");
                      menu.classList.add("show");
                    }}
                    onMouseLeave={(e) => {
                      const button = e.currentTarget.querySelector("button");
                      const menu =
                        e.currentTarget.querySelector(".dropdown-menu");
                      button.classList.remove("show");
                      menu.classList.remove("show");
                    }}
                  >
                    <button
                      className="btn dropdown-toggle p-0 border-0 bg-transparent"
                      type="button"
                      id="userDropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={
                          user?.avatar ||
                          "http://localhost:3001/uploads/users/default-avatar.png"
                        }
                        alt="User Avatar"
                        className="rounded-circle"
                        style={{ width: "40px", height: "40px" }}
                      />
                    </button>
                    <ul
                      className="dropdown-menu dropdown-menu-end"
                      aria-labelledby="userDropdown"
                    >
                      <li>
                        <Link className="dropdown-item" to="/user-info">
                          User Info
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/edit-profile">
                          Edit Profile
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/my-orders">
                          My Orders
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item"
                          onClick={handleLogout}
                          style={{ fontFamily: "JosefinSans" }}
                          to="/"
                        >
                          Log out
                        </Link>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <ButtonWhite
                    buttontext="Login"
                    onClick={() => navigate("/login")}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className={styles.contentPadding}></div>
      {/* *****Header end***** */}
    </>
  );
}

export default Header;
