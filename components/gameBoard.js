import { MODE, PHASE, TYPE } from "../utils/constants.js";
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
  gamePhase,
  gameMode,
  gameType,
  seconds,
  active,
  renderedNumbers,
  renderedAnswers,
}) {
  const numbers =
    gameType == TYPE.PAULI
      ? renderedNumbers
      : renderedNumbers.slice().reverse();
  const answers =
    gameType == TYPE.PAULI
      ? renderedAnswers.slice(0, -1)
      : renderedAnswers.slice(0, -1).reverse();
  const activeAnswer =
    gameType == TYPE.PAULI
      ? Math.min(active, 2)
      : Math.max(answers.length - active - 1, 2);

  return (
    <div className={styles.boardContainer}>
      <div className={styles.mask}>
        <div
          className={cn([styles.timer], {
            [styles.hide]: gameMode == MODE.RANKED,
            [styles.timerOver]: seconds == 0,
          })}
        >
          {formatTime(seconds)}
        </div>

        <div className={styles.numbers}>
          {gameType == TYPE.PAULI && createPaddingNumbers(2, active, "start")}
          {numbers.map((element, idx) => {
            return (
              <div className={styles.number} key={"numbers-" + idx}>
                {element}
              </div>
            );
          })}
          {gameType == TYPE.KRAEPELIN &&
            createPaddingNumbers(2, active, "start")}
        </div>

        <div className={styles.numbersInput}>
          {gameType == TYPE.PAULI && createPaddingNumbers(2, active, "input")}
          {answers.map((element, idx) => {
            return (
              <div
                className={cn([styles.number], {
                  [styles.activeAnswer]: idx == activeAnswer,
                  [styles.wrong]:
                    gameMode == MODE.PRACTICE &&
                    element.value !== (numbers[idx] + numbers[idx + 1]) % 10,
                  [styles.blink]: gamePhase == PHASE.START,
                })}
                key={"answer-" + idx}
              >
                {element.value}
              </div>
            );
          })}
          {gameType == TYPE.KRAEPELIN &&
            createPaddingNumbers(2, active, "start")}
        </div>
        <div className={styles.timer} />
      </div>
    </div>
  );
}
