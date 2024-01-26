import React from "react";
import styles from "./keyboard.module.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const keyboardKeys = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

export default function Keyboard() {
  const keydown = (key) => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key }));
  };

  return (
    <div className={styles.keyboard}>
      {keyboardKeys.map((row, idx) => (
        <React.Fragment key={"rowfragment" + idx}>
          <div className={styles.keyboardRow} key={"row" + idx}>
            {row.map((e, idx) => (
              <React.Fragment key={"keyfragment" + e}>
                <div
                  className={styles.keyboardKey}
                  key={"keys" + e}
                  onClick={() => keydown(e.toString())}
                >
                  {e}
                </div>
                {idx == 2 ? null : (
                  <div
                    className={styles.verticalKeySeparator}
                    key={"vsep" + e}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className={styles.horizontalKeySeparator} key={"hsep" + idx} />
        </React.Fragment>
      ))}
      <div className={styles.keyboardRow} key="row3">
        <div
          className={styles.keyboardKey}
          key="keysDecrement"
          onClick={() => keydown("Backspace")}
        >
          <FaChevronLeft />
        </div>
        <div className={styles.verticalKeySeparator} />
        <div className={styles.keyboardKey} onClick={() => keydown("0")}>
          0
        </div>
        <div className={styles.verticalKeySeparator} />
        <div
          className={styles.keyboardKey}
          key="keysIncrement"
          onClick={() => keydown("Enter")}
        >
          <FaChevronRight />
        </div>
      </div>
    </div>
  );
}
