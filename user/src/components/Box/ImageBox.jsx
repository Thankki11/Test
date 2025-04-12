import styles from "./ImageBox.module.css";

function ImageBox({ src, height = "300px" }) {
  return (
    <div className={styles.imageWrapper} style={{ height }}>
      <img className={styles.image} src={src} alt="Custom" />
    </div>
  );
}

export default ImageBox;
