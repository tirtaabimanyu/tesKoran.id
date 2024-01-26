import styles from "./inputWithStatus.module.css";
import cn from "classnames";
import { FaTimes, FaCheck } from "react-icons/fa";
import { registerFieldWithDebounceValidation } from "../utils/registerFieldWithDebounceValidation.ts";
import { useRef, useEffect } from "react";

const showTooltip = (tooltipRef, arrowRef) => {
  const iconWidth = 16;
  const screenPadding = 8;

  const { width: tooltipWidth } = tooltipRef.current.getBoundingClientRect();
  const { width: arrowWidth } = arrowRef.current.getBoundingClientRect();

  const defaultLeft = -tooltipWidth / 2 + iconWidth / 2;
  const defaultArrow = tooltipWidth / 2 - arrowWidth / 2;
  tooltipRef.current.style.left = `${defaultLeft}px`;
  arrowRef.current.style.left = `${defaultArrow}px`;

  const { x, width } = tooltipRef.current.getBoundingClientRect();
  const { innerWidth } = window;
  const isOverflow = x + width + screenPadding > innerWidth;

  if (isOverflow) {
    const offset = x + width + screenPadding - innerWidth;
    tooltipRef.current.style.left = `${defaultLeft - offset}px`;
    arrowRef.current.style.left = `${defaultArrow + offset}px`;
  }

  tooltipRef.current.style.visibility = "visible";
  tooltipRef.current.style.opacity = "1";
};

const hideTooltip = (tooltipRef) => {
  tooltipRef.current.style.visibility = "hidden";
  tooltipRef.current.style.opacity = "0";
};

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
  const inputRef = useRef(null);
  const debounceRegister = registerFieldWithDebounceValidation(
    fieldName,
    debounceWait,
    trigger,
    register,
    options
  );

  return (
    <div className={styles.container}>
      <input
        {...debounceRegister}
        className={styles.input}
        placeholder={placeholder}
        type={type}
        ref={(e) => {
          debounceRegister.ref(e);
          inputRef.current = e;
        }}
      />

      <div
        className={cn([styles.status])}
        onClick={() => inputRef.current.focus()}
      >
        {errors ? (
          <div
            className={styles.tooltipContainer}
            onClick={() => showTooltip(tooltipRef, arrowRef)}
            onMouseEnter={() => showTooltip(tooltipRef, arrowRef)}
            onMouseLeave={() => hideTooltip(tooltipRef)}
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
