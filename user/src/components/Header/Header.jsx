import { Link } from "react-router-dom";
import logo from "../../assets/images/logo-black.png";
import styles from "./Header.module.css";
import ButtonWhite from "../Buttons/ButtonWhite";

function Header() {
  return (
    <header className="d-flex align-items-center">
      {/* offcanvas sidebar start*/}
      <div
        className="offcanvas offcanvas-start w-25 d-flex flex-column"
        tabIndex="-1"
        id="cartSideBar"
        aria-labelledby="offcanvasDemoLabel"
      >
        {/* Phần header */}
        <div className="offcanvas-header">
          <h1
            className="offcanvas-title"
            id="offcanvasDemoLabel"
            style={{ fontSize: "40px" }}
          >
            Your cart
          </h1>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>

        {/* Phần body có thể cuộn */}
        <div className="offcanvas-body flex-grow-1 overflow-auto">
          {/* Nội dung giỏ hàng có thể cuộn */}
          <div style={{ minHeight: "100%" }}>
            {/* Các items trong giỏ hàng */}
            {[...Array(10)].map((_, i) => (
              <div key={i} className="card mb-3">
                <div className="card-body">
                  <p className="card-title">Sản phẩm {i + 1}</p>
                  <p className="card-text">Mô tả sản phẩm...</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Phần footer cố định */}
        <div
          className="offcanvas-footer p-3 border-top"
          style={{ flexShrink: 0 }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <p className="mb-0">Total:</p>
            <span className="fs-4 fw-bold">$ 999</span>
          </div>
          <ButtonWhite
            buttontext={"Check Out"}
            className="w-100 mt-3 py-2"
            style={{ height: "80px", fontSize: "25px" }}
          />
        </div>
      </div>
      {/* offcanvas sidebar end */}
      <div className="container-fluid">
        <div className="row justify-content-center">
          {/* Header Left */}
          <div
            className={
              "col-5 text-center  d-flex justify-content-between " + styles.nav
            }
          >
            <div>
              <ButtonWhite
                buttontext="Cart (0)"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#cartSideBar"
              />
            </div>
            <ul className={styles.mainMenus}>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/chefs">Chefs</Link>
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
                  <Link to="/shop">Shop</Link>
                </li>
                <li>
                  <div className="dropdown">
                    <div
                      className={
                        styles.dropdownText + " dropdown-toggle text-dark"
                      }
                      data-bs-toggle="dropdown"
                      role="button"
                      style={{ cursor: "pointer" }}
                    >
                      Join with us
                    </div>
                    <ul className="dropdown-menu">
                      <li>
                        <a className="dropdown-item" href="/register-class">
                          Register a cooking class
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="/recuitment">
                          Recruitment
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>
                <li>
                  <Link to="#">Book table</Link>
                </li>
              </ul>
            </div>
            <div>
              <ButtonWhite
                buttontext="Login"
                onClick={() => alert("Button Clicked!")}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
export default Header;
