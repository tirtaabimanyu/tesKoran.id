import styles from "./spinner.module.css";
import { FaSpinner } from "react-icons/fa";
import cn from "classnames";

export default function Spinner({ loading }) {
  return (
    <div className={cn([styles.container], { [styles.hide]: !loading })}>
      <FaSpinner className={styles.spinner} size={48} />
    </div>
  );
}
