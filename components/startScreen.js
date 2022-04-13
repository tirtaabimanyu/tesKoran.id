import styles from "./startScreen.module.css";
import cn from "classnames";
import { ACTIONS, MODE, TYPE } from "../utils/constants.js";

export default function StartScreen({
  gameMode,
  gameDuration,
  gameType,
  dispatch,
}) {
  const isCustom =
    gameDuration != 30 &&
    gameDuration != 180 &&
    gameDuration != 1200 &&
    gameDuration != 3600;

  return (
    <div className={styles.container}>
      <div className={styles.menuRow}>
        <div className={styles.menuHeader}>Mode</div>
        <div className={styles.menuChoice}>
          <div
            className={cn([styles.clickable], {
              [styles.activeChoice]: gameMode == MODE.PRACTICE,
            })}
            onClick={() =>
              dispatch({ type: ACTIONS.SET_MODE, payload: MODE.PRACTICE })
            }
          >
            Practice
          </div>
          <div
            className={cn([styles.clickable], {
              [styles.activeChoice]: gameMode == MODE.RANKED,
            })}
            onClick={() => {
              dispatch({ type: ACTIONS.SET_MODE, payload: MODE.RANKED });
              if (isCustom) dispatch({ type: ACTIONS.SET_TIME, payload: 60 });
            }}
          >
            Ranked
          </div>
        </div>
      </div>
      <div className={styles.menuRow}>
        <div className={styles.menuHeader}>Type</div>
        <div className={styles.menuChoice}>
          <div
            className={cn([styles.clickable], {
              [styles.activeChoice]: gameType == TYPE.PAULI,
            })}
            onClick={() =>
              dispatch({ type: ACTIONS.SET_TYPE, payload: TYPE.PAULI })
            }
          >
            Pauli
          </div>
          <div
            className={cn([styles.clickable], {
              [styles.activeChoice]: gameType == TYPE.KRAEPELIN,
            })}
            onClick={() => {
              dispatch({ type: ACTIONS.SET_TYPE, payload: TYPE.KRAEPELIN });
            }}
          >
            Kraepelin
          </div>
        </div>
      </div>
      <div className={styles.menuRow}>
        <div className={styles.menuHeader}>Duration</div>
        <div className={styles.menuChoice}>
          <div
            className={cn([styles.clickable], {
              [styles.activeChoice]: gameDuration == 30,
            })}
            onClick={() => dispatch({ type: ACTIONS.SET_TIME, payload: 30 })}
          >
            30s
          </div>
          <div
            className={cn([styles.clickable], {
              [styles.activeChoice]: gameDuration == 180,
            })}
            onClick={() => dispatch({ type: ACTIONS.SET_TIME, payload: 180 })}
          >
            3m
          </div>
          <div
            className={cn([styles.clickable], {
              [styles.activeChoice]: gameDuration == 1200,
            })}
            onClick={() => dispatch({ type: ACTIONS.SET_TIME, payload: 1200 })}
          >
            20m
          </div>
          <div
            className={cn([styles.clickable], {
              [styles.activeChoice]: gameDuration == 3600,
            })}
            onClick={() => dispatch({ type: ACTIONS.SET_TIME, payload: 3600 })}
          >
            60m
          </div>
          <div
            className={cn({
              [styles.clickable]: gameMode == MODE.PRACTICE,
              [styles.strikethrough]: gameMode == MODE.RANKED,
              [styles.activeChoice]: isCustom,
            })}
            onClick={(e) => {
              if (gameMode == MODE.RANKED) return;

              const customSecond = parseInt(
                prompt("Enter duration in seconds")
              );
              if (!customSecond) return;
              dispatch({ type: ACTIONS.SET_TIME, payload: customSecond });
            }}
          >
            Custom
          </div>
        </div>
      </div>
      <div className={styles.horizontalSep} />
      <div
        className={cn([styles.clickable], [styles.startButton])}
        onClick={() => dispatch({ type: ACTIONS.INIT_GAME })}
      >
        START
      </div>
    </div>
  );
}
