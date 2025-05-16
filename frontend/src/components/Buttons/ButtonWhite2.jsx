import { Link } from "react-router-dom";
import styles from "./ButtonWhite.module.css";

function ButtonWhite2({ buttontext, link, onClick, className = "", fontSize }){
  return (
    <Link to={link}>
      <button
        className={`${styles.buttonWhite2} ${className}`}
        onClick={onClick}
        style={{ fontSize: { fontSize } }}
      >
        {buttontext}
      </button>
    </Link>
  );
}

export default ButtonWhite2;
