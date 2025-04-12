import styles from "./ButtonWhite.module.css";

function ButtonWhite({ buttontext, onClick }) {
  return (
    <button className={styles.buttonWhite} onClick={onClick}>
      {buttontext}
    </button>
  );
}

export default ButtonWhite;
