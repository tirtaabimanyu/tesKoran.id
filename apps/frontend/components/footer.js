import styles from "./footer.module.css";
import cn from "classnames";
import Link from "next/link";
import {
  FaEnvelope,
  FaFileContract,
  FaLock,
  FaPalette,
  FaGlobeAsia,
  FaGitAlt,
  FaDonate,
} from "react-icons/fa";

export default function Footer({ hide }) {
  return (
    <div className={cn([styles.container], { [styles.hide]: hide })}>
      <div className={styles.group}>
        <Link href="/contact">
          <div className={styles.clickable}>
            <FaEnvelope />
            <div>Contact</div>
          </div>
        </Link>
        <Link href="/terms">
          <div className={styles.clickable}>
            <FaFileContract />
            <div>Terms</div>
          </div>
        </Link>
        <Link href="/privacy">
          <div className={styles.clickable}>
            <FaLock />
            <div>Privacy</div>
          </div>
        </Link>
        <Link href="/donate">
          <div className={styles.clickable}>
            <FaDonate />
            <div>Donate</div>
          </div>
        </Link>
      </div>

      <div className={styles.group}>
        <div className={styles.clickable}>
          <FaPalette />
          <div>Light Theme</div>
        </div>
        <div className={styles.clickable}>
          <FaGlobeAsia />
          <div>English</div>
        </div>
        <div className={styles.clickable}>
          <FaGitAlt />
          <div>v1.0.0</div>
        </div>
      </div>
    </div>
  );
}
