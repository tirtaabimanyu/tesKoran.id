import Head from "next/head";
import cn from "classnames";
import { useState, useEffect, useReducer, useRef } from "react";
import styles from "../styles/Home.module.css";

const allowedKeys = new Set([
  8, 13, 38, 40, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100,
  101, 102, 103, 104, 105,
]);

const PHASE = {
  PRESTART: "prestart",
  RUNNING: "running",
  OVER: "over",
};

const ACTIONS = {
  INIT_NUMBERS: "init-numbers",
  GENERATE_NEXT_NUMBERS: "generate-next-numbers",
  PUSH_ANSWER: "push-answer",
  INCREMENT: "increment",
  DECREMENT: "decrement",
  START_GAME: "start-game",
  STOP_GAME: "stop-game",
  DECREASE_TIME: "decrease-time",
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.INIT_NUMBERS:
      const numbers = Array.from({ length: 100 }, () =>
        Math.floor(Math.random() * 10)
      );
      return {
        ...state,
        numbers,
        answers: Array(numbers.length).fill(null),
      };
    case ACTIONS.GENERATE_NEXT_NUMBERS:
      console.log("hehe");
      const newNumbers = Array.from({ length: 100 }, () =>
        Math.floor(Math.random() * 10)
      );
      const newAnswers = Array(state.numbers.length + newNumbers.length).fill(
        null
      );
      return {
        ...state,
        numbers: state.numbers.concat(newNumbers),
        answers: state.answers.concat(newAnswers),
      };

    case ACTIONS.INCREMENT:
      return {
        ...state,
        active: Math.min(state.maxActive, state.active + 1),
      };
    case ACTIONS.DECREMENT:
      return { ...state, active: Math.max(0, state.active - 1) };
    case ACTIONS.PUSH_ANSWER:
      state.answers[state.active] = action.payload.input;
      const active = Math.min(state.numbers.length - 1, state.active + 1);
      return {
        ...state,
        active,
        maxActive: active,
      };
    case ACTIONS.START_GAME:
      console.log("triggered");
      return {
        ...state,
        gamePhase: PHASE.RUNNING,
      };
    case ACTIONS.STOP_GAME:
      return {
        ...state,
        gamePhase: PHASE.OVER,
      };
    case ACTIONS.DECREASE_TIME:
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
      };
    default:
      return state;
  }
}

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
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

export default function Home() {
  const [state, dispatch] = useReducer(reducer, {
    active: 0,
    maxActive: 0,
    numbers: [],
    answers: [],
    gamePhase: PHASE.PRESTART,
    secondsRemaining: 10,
  });

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    dispatch({ type: ACTIONS.INIT_NUMBERS });
  }, []);

  useInterval(
    () => {
      if (state.secondsRemaining > 0) {
        dispatch({ type: ACTIONS.DECREASE_TIME });
      } else {
        dispatch({ type: ACTIONS.STOP_GAME });
      }
    },
    state.gamePhase == PHASE.RUNNING ? 1000 : null
  );

  useEffect(() => {
    console.log("init");
    window.addEventListener("keydown", (e) => keyDown(e));
    return () => {
      console.log("clean");
      window.removeEventListener("keydown", (e) => keyDown(e));
    };
  }, []);

  function keyDown(e) {
    if (!allowedKeys.has(e.keyCode)) return;
    if (stateRef.current.gamePhase == PHASE.PRESTART)
      dispatch({ type: ACTIONS.START_GAME });
    if (stateRef.current.gamePhase == PHASE.OVER) return;

    if (e.keyCode == 8 || e.keyCode == 38)
      return dispatch({ type: ACTIONS.DECREMENT });

    if (e.keyCode == 13 || e.keyCode == 40)
      return dispatch({ type: ACTIONS.INCREMENT });

    if (e.repeat || e.ctrlKey) return;

    if (e.keyCode >= 48 && e.keyCode <= 57) {
      if (stateRef.current.numbers.length - 10 <= stateRef.current.active)
        dispatch({ type: ACTIONS.GENERATE_NEXT_NUMBERS });
      return dispatch({
        type: ACTIONS.PUSH_ANSWER,
        payload: { input: e.keyCode - 48 },
      });
    }

    if (e.keyCode >= 96 && e.keyCode <= 105) {
      if (stateRef.current.numbers.length - 10 <= stateRef.current.active)
        dispatch({ type: ACTIONS.GENERATE_NEXT_NUMBERS });
      return dispatch({
        type: ACTIONS.PUSH_ANSWER,
        payload: { input: e.keyCode - 96 },
      });
    }
  }

  function createPaddingNumbers(paddingLength, active, keyPrefix) {
    const n = paddingLength - active;
    if (n < 0) return null;

    return [...Array(n)].map((e, idx) => (
      <div className={styles.paddingNumber} key={`${keyPrefix}-${idx}`} />
    ));
  }

  const renderedNumbers = state.numbers.slice(
    Math.max(0, state.active - 2),
    state.active + 4
  );

  const inputRef = useRef(null);
  function scrollHandler() {
    inputRef.current.scrollIntoView({ block: "center" });
  }

  useEffect(() => {
    window.addEventListener("resize", scrollHandler);

    return () => {
      window.removeEventListener("resize", scrollHandler);
    };
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Numberplus+</title>
        <meta name="description" content="Add them numbers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.mask}>
          <div className={styles.timer}>
            {formatTime(state.secondsRemaining)}
          </div>
          <div className={styles.numbers}>
            {createPaddingNumbers(2, state.active, "start")}
            {renderedNumbers.map((element, idx) => {
              return (
                <div className={styles.number} key={"numbers-" + idx}>
                  {element}
                </div>
              );
            })}
            {createPaddingNumbers(
              3,
              state.numbers.length - state.active - 1,
              "end"
            )}
          </div>

          <div className={styles.numbersInput}>
            {createPaddingNumbers(2, state.active, "input")}
            {state.answers
              .slice(Math.max(0, state.active - 2), state.active + 4)
              .map((element, idx) => {
                return idx !== Math.min(state.active, 2) ? (
                  <div
                    className={cn([styles.number], {
                      [styles.paddingNumber]: element === null,
                      [styles.wrong]:
                        element !==
                        (renderedNumbers[idx] + renderedNumbers[idx + 1]) % 10,
                    })}
                    key={"answer-" + idx}
                  >
                    {element}
                  </div>
                ) : (
                  <div
                    key={"answer-" + idx}
                    className={cn([styles.activeAnswerContainer], {
                      [styles.blink]: state.gamePhase == PHASE.PRESTART,
                    })}
                  >
                    <input
                      autoFocus
                      type="number"
                      className={cn([styles.activeAnswer], {
                        [styles.wrong]:
                          element !==
                          (renderedNumbers[idx] + renderedNumbers[idx + 1]) %
                            10,
                      })}
                      ref={inputRef}
                      onChange={(e) => e.preventDefault()}
                      value={element === null ? "" : element}
                    />
                  </div>
                );
              })}
            {createPaddingNumbers(
              3,
              state.numbers.length - state.active - 1,
              "end"
            )}
          </div>
          <div className={styles.timer} style={{ opacity: 0 }}>
            {formatTime(state.secondsRemaining)}
          </div>
        </div>
      </main>
    </div>
  );
}
