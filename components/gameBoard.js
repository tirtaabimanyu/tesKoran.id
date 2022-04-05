import { MODE, PHASE } from "../utils/constants.js";
import styles from "./gameBoard.module.css";
import cn from "classnames";

function createPaddingNumbers(paddingLength, active, keyPrefix) {
  const n = paddingLength - active;
  if (n < 0) return null;

  return [...Array(n)].map((e, idx) => (
    <div className={styles.paddingNumber} key={`${keyPrefix}-${idx}`} />
  ));
}

function formatTime(time) {
  const seconds = (time % 60).toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  const minute = Math.floor(time / 60).toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  return minute + ":" + seconds;
}

export default function GameBoard({
  gameMode,
  gamePhase,
  seconds,
  active,
  renderedNumbers,
  renderedAnswers,
}) {
  return (
    <div className={styles.boardContainer}>
      <div className={styles.mask}>
        <div
          className={cn([styles.timer], {
            [styles.hide]: gameMode == MODE.RANKED,
          })}
        >
          {formatTime(seconds)}
        </div>

        <div className={styles.numbers}>
          {createPaddingNumbers(2, active, "start")}
          {renderedNumbers.map((element, idx) => {
            return (
              <div className={styles.number} key={"numbers-" + idx}>
                {element}
              </div>
            );
          })}
        </div>

        <div className={styles.numbersInput}>
          {createPaddingNumbers(2, active, "input")}
          {renderedAnswers.map((element, idx) => {
            return (
              <div
                className={cn([styles.number], {
                  [styles.activeAnswer]: idx == Math.min(active, 2),
                  [styles.paddingNumber]: element === null,
                  [styles.wrong]:
                    gameMode == MODE.PRACTICE &&
                    element !==
                      (renderedNumbers[idx] + renderedNumbers[idx + 1]) % 10,
                  [styles.blink]: gamePhase == PHASE.START,
                })}
                key={"answer-" + idx}
              >
                {element}
              </div>
            );
          })}
        </div>
        <div className={styles.timer} style={{ opacity: 0 }}>
          {formatTime(seconds)}
        </div>
      </div>
    </div>
  );
}
