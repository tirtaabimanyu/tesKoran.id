import styles from "../styles/Login.module.css";
import { FaUserPlus, FaSignInAlt, FaGoogle } from "react-icons/fa";

export default function Login() {
  return (
    <div className={styles.container}>
      <form
        className={styles.formContainer}
        onSubmit={(e) => e.preventDefault()}
      >
        <div className={styles.headerText}>Sign Up</div>
        <input placeholder="username"></input>
        <input placeholder="email"></input>
        <input placeholder="verify email"></input>
        <input type="password" placeholder="password"></input>
        <input type="password" placeholder="verify password"></input>
        <button>
          <FaUserPlus size={20} />
          Sign Up
        </button>
      </form>
      <div className={styles.separator} />
      <form
        className={styles.formContainer}
        onSubmit={(e) => e.preventDefault()}
      >
        <div className={styles.loginHeader}>
          <div className={styles.headerText}>Log In</div>
          <div className={styles.subHeaderText}>Forgot password?</div>
        </div>
        <input placeholder="email"></input>
        <input type="password" placeholder="password"></input>
        <label className={styles.checkBox}>
          <input type="checkbox" className={styles.checkBoxCheck} />
          <div className={styles.checkBoxText}>Remember Me</div>
        </label>
        <button>
          <FaSignInAlt size={20} />
          Sign In
        </button>
        <div className={styles.centered}>or</div>
        <button>
          <FaGoogle size={20} />
          Google Sign In
        </button>
      </form>
    </div>
  );
}
