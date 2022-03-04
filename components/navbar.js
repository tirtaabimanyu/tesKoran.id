import styles from "./navbar.module.css";
import cn from "classnames";
import Link from "next/link";

export default function Navbar({ hide }) {
  return (
    <div className={cn([styles.container], { [styles.hide]: hide })}>
      <div className={styles.group}>
        <Link href="/">
          <h1 className={styles.title}>+tesKoran.id</h1>
        </Link>

        <div>
          <h4 className={styles.title}>Leaderboard</h4>
        </div>
        <div>
          <h4 className={styles.title}>About</h4>
        </div>
      </div>

      <div className={styles.grouop}>
        <div>
          <h4 className={styles.title}>Log In</h4>
        </div>
      </div>
    </div>
  );
}
