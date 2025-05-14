import { Link } from "react-router-dom";
import styles from "./ButtonWhite.module.css";

function ButtonWhite2({ buttontext, link, onClick, className = "" }) {
  return (
    <Link to={link}>
      <button
        className={`${styles.buttonWhite2} ${className}`}
        onClick={onClick}
      >
        {buttontext}
      </button>
    </Link>
  );
}

export default ButtonWhite2;
