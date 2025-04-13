import { Link } from "react-router-dom";
import logo from "../../assets/images/logo-black.png";
import styles from "./Header.module.css";
import ButtonWhite from "../Buttons/ButtonWhite";

function Header() {
  return (
    <header className="d-flex align-items-center">
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
                buttontext="Login"
                onClick={() => alert("Button Clicked!")}
              />
            </div>
            <ul className={styles.mainMenus}>
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
