import styles from "./inputWithStatus.module.css";
import cn from "classnames";
import { FaTimes, FaCheck } from "react-icons/fa";
import { registerFieldWithDebounceValidation } from "../utils/registerFieldWithDebounceValidation.ts";
import { useRef, useEffect } from "react";

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
  const tooltipRef = useRef(null);
  const arrowRef = useRef(null);
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
          <div
            className={styles.tooltipContainer}
            onMouseEnter={(e) => {
              tooltipRef.current.style.marginLeft = "0px";
              const { x, width } = tooltipRef.current.getBoundingClientRect();
              const { innerWidth } = window;
              const offset = innerWidth - (x + width) - 8;
              if (x + width + 8 > innerWidth) {
                tooltipRef.current.style.marginLeft = offset + "px";
                arrowRef.current.style.left = -offset - 5 + "px";
              } else {
                tooltipRef.current.style.marginLeft = `-100px`;
                arrowRef.current.style.left = `95px`;
              }
            }}
          >
            <span ref={tooltipRef} className={styles.tooltip}>
              {errors.message}
              <span ref={arrowRef} className={styles.arrow} />
            </span>
            <FaTimes color={"red"} />
          </div>
        ) : (
          isDirty && <FaCheck color={"green"} />
        )}
      </div>
    </div>
  );
}
