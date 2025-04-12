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
            <div>{/* Bên trái */}</div>
            <ul>
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
              <ul>
                <li>
                  <Link to="/shop">Shop</Link>
                </li>
                <li>
                  <Link to="/menus">Join with us</Link>
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
