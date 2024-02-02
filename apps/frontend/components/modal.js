import styles from "./modal.module.css";

export default function Modal({ children, visible, onDismiss }) {
  return (
    visible && (
      <div className={styles.container}>
        <div className={styles.modal}>{children}</div>
        <div className={styles.overlay} onClick={onDismiss} />
      </div>
    )
  );
}
