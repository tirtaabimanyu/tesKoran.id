import styles from "./navbar.module.css";
import cn from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  FaRegPlusSquare,
  FaTrophy,
  FaInfoCircle,
  FaUserAlt,
} from "react-icons/fa";
import TokenService from "../services/token.service";
import NavbarLoginButton from "./navbarLoginButton";

export default function Navbar({ hide, titleClickHandler }) {
  const router = useRouter();

  return (
    <div className={cn([styles.container])}>
      <div
        className={cn([styles.titleContainer], { [styles.greyed]: hide })}
        onClick={() => {
          if (router.pathname == "/") titleClickHandler.click();
          else router.push("/");
        }}
      >
        <h1 className={styles.title}>
          <FaRegPlusSquare size="32px" />
          tesKoran.id
        </h1>
      </div>
      <div className={styles.links}>
        <div className={styles.group}>
          <Link href="/leaderboard">
            <a className={cn([styles.expandable], { [styles.hide]: hide })}>
              <FaTrophy className={styles.icon} size="24px" />
              <h4 className={cn([styles.text])}>Leaderboard</h4>
            </a>
          </Link>

          <Link href="/about">
            <a className={cn([styles.expandable], { [styles.hide]: hide })}>
              <FaInfoCircle className={styles.icon} size="24px" />
              <h4 className={cn([styles.text])}>About</h4>
            </a>
          </Link>
        </div>

        <div className={styles.group}>
          <NavbarLoginButton hide={hide} pathname={router.pathname} />
        </div>
      </div>
    </div>
  );
}
