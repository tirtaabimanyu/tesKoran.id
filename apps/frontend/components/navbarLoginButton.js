import cn from "classnames";
import styles from "./navbarLoginButton.module.css";
import { FaUserAlt, FaSignOutAlt } from "react-icons/fa";
import Link from "next/link";
import TokenService from "../services/token.service";
import { useRouter } from "next/router";

export default function NavbarLoginButton({ user, pathname, hide }) {
  const router = useRouter();

  const logout = () => {
    TokenService.removeUser();
    router.push("/login");
  };

  const renderLoginButton = () => {
    return (
      <Link href="/login">
        <div className={cn([styles.loginButton], { [styles.hide]: hide })}>
          <h4 className={cn([styles.text])}>Log In</h4>
          <FaUserAlt className={styles.icon} size="24px" />
        </div>
      </Link>
    );
  };

  const renderLogoutButton = () => {
    return (
      <div
        onClick={logout}
        className={cn([styles.loginButton], { [styles.hide]: hide })}
      >
        <h4 className={cn([styles.text])}>Log Out</h4>
        <FaSignOutAlt className={styles.icon} size="24px" />
      </div>
    );
  };

  const renderProfileButton = () => {
    return (
      <Link href="/profile">
        <div className={cn([styles.loginButton], { [styles.hide]: hide })}>
          <h4 className={cn([styles.text])}>{user.username}</h4>
          <FaUserAlt className={styles.icon} size="24px" />
        </div>
      </Link>
    );
  };

  if (pathname == "/profile") return renderLogoutButton();
  else if (user) return renderProfileButton();
  else return renderLoginButton();
}
