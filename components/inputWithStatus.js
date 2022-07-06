import styles from "./inputWithStatus.module.css";
import cn from "classnames";
import { FaTimes, FaCheck } from "react-icons/fa";
import { registerFieldWithDebounceValidation } from "../utils/registerFieldWithDebounceValidation.ts";

export default function InputWithStatus({
  placeholder = "",
  type = "text",
  fieldName,
  debounceWait,
  trigger,
  register,
  options,
  errors,
  isDirty,
}) {
  return (
    <div className={styles.container}>
      <input
        className={styles.input}
        placeholder={placeholder}
        type={type}
        {...registerFieldWithDebounceValidation(
          fieldName,
          debounceWait,
          trigger,
          register,
          options
        )}
      />

      <div className={cn([styles.status])}>
        {errors ? (
          <div className={styles.tooltipContainer}>
            <span className={styles.tooltip}>{errors.message}</span>
            <FaTimes color={"red"} />
          </div>
        ) : (
          isDirty && <FaCheck color={"green"} />
        )}
      </div>
    </div>
  );
}