import styles from "./footer.module.css";
import cn from "classnames";

export default function Footer({ hide }) {
  return (
    <div className={cn([styles.container], { [styles.hide]: hide })}>
      <div className={styles.group}>
        <div>Contact</div>
        <div>Terms</div>
        <div>Donate</div>
      </div>

      <div className={styles.group}>
        <div>Light Theme</div>
        <div>©2022+tesKoran.id</div>
      </div>
    </div>
  );
}
