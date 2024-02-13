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
import ReleaseNotesButton from "./releaseNotesButton";

export default function Footer({ hide }) {
  return (
    <div className={cn([styles.container], { [styles.hide]: hide })}>
      <div className={styles.group}>
        <Link href="/contact">
          <a className={styles.clickable}>
            <FaEnvelope />
            <div>Contact</div>
          </a>
        </Link>
        <Link href="/terms">
          <a className={styles.clickable}>
            <FaFileContract />
            <div>Terms</div>
          </a>
        </Link>
        <Link href="/privacy">
          <a className={styles.clickable}>
            <FaLock />
            <div>Privacy</div>
          </a>
        </Link>
        {/* <Link href="/donate">
          <a className={styles.clickable}>
            <FaDonate />
            <div>Donate</div>
          </a>
        </Link> */}
      </div>

      <div className={styles.group}>
        {/* <div className={styles.disabled}>
          <FaPalette />
          <div>Light Theme</div>
        </div>
        <div className={styles.disabled}>
          <FaGlobeAsia />
          <div>English</div>
        </div> */}
        <ReleaseNotesButton />
      </div>
    </div>
  );
}
