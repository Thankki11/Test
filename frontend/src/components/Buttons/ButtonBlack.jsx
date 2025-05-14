import styles from "./ButtonBlack.module.css";

function ButtonBlack({ buttontext, onClick, ...rest }) {
  return (
    <button className={styles.buttonBlack} onClick={onClick} {...rest}>
      {buttontext}
    </button>
  );
}

export default ButtonBlack;
