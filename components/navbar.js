import styles from "./navbar.module.css";
import cn from "classnames";
import Link from "next/link";
import {
  FaRegPlusSquare,
  FaTrophy,
  FaInfoCircle,
  FaSignInAlt,
} from "react-icons/fa";

export default function Navbar({ hide }) {
  return (
    <div className={cn([styles.container])}>
      <div className={styles.group}>
        <Link href="/">
          <div className={styles.titleContainer}>
            <h1 className={styles.title}>
              <FaRegPlusSquare size="32px" />
              tesKoran.id
            </h1>
          </div>
        </Link>

        <Link href="/leaderboard">
          <div className={cn([styles.expandable], { [styles.hide]: hide })}>
            <FaTrophy className={styles.icon} size="24px" />
            <h4 className={cn([styles.text])}>Leaderboard</h4>
          </div>
        </Link>

        <Link href="/about">
          <div className={cn([styles.expandable], { [styles.hide]: hide })}>
            <FaInfoCircle className={styles.icon} size="24px" />
            <h4 className={cn([styles.text])}>About</h4>
          </div>
        </Link>
      </div>

      <div className={styles.group}>
        <Link href="/login">
          <div className={cn([styles.loginButton], { [styles.hide]: hide })}>
            <h4 className={cn([styles.text])}>Log In</h4>
            <FaSignInAlt className={styles.icon} size="24px" />
          </div>
        </Link>
      </div>
    </div>
  );
}