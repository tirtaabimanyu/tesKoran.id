import Head from "next/head";
import cn from "classnames";
import { useState, useEffect, useReducer, useRef } from "react";
import router from "next/router";
import styles from "../styles/Home.module.css";

const allowedKeys = new Set([
  8, 13, 27, 38, 40, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99,
  100, 101, 102, 103, 104, 105,
]);

const PHASE = {
  PRESTART: "prestart",
  START: "start",
  RUNNING: "running",
  OVER: "over",
};

const MODE = {
  PRACTICE: "practice",
  RANKED: "ranked",
};

const ACTIONS = {
  GENERATE_NEXT_NUMBERS: "generate-next-numbers",
  PUSH_ANSWER: "push-answer",
  INCREMENT: "increment",
  DECREMENT: "decrement",
  INIT_GAME: "init-game",
  SET_PHASE: "set-phase",
  SET_TIME: "set-time",
  DECREASE_TIME: "decrease-time",
  SET_MODE: "set-mode",
};

function reducer(state, action) {
  switch (action.type) {
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
    case ACTIONS.INIT_GAME:
      const numbers = Array.from({ length: 100 }, () =>
        Math.floor(Math.random() * 10)
      );

      return {
        ...state,
        numbers,
        answers: Array(numbers.length).fill(null),
        gamePhase: PHASE.START,
        secondsRemaining: state.gameDuration,
        active: 0,
        maxActive: 0,
      };
    case ACTIONS.SET_PHASE:
      return {
        ...state,
        gamePhase: action.payload,
      };
    case ACTIONS.SET_TIME:
      return {
        ...state,
        gameDuration: action.payload,
        secondsRemaining: action.payload,
      };
    case ACTIONS.DECREASE_TIME:
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
      };
    case ACTIONS.SET_MODE:
      return {
        ...state,
        gameMode: action.payload,
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
    gameMode: MODE.PRACTICE,
    gameDuration: 60,
    secondsRemaining: 60,
  });

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useInterval(
    () => {
      if (state.secondsRemaining > 0) {
        dispatch({ type: ACTIONS.DECREASE_TIME });
      } else {
        dispatch({ type: ACTIONS.SET_PHASE, payload: PHASE.OVER });
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
    if (stateRef.current.gamePhase == PHASE.START)
      dispatch({ type: ACTIONS.SET_PHASE, payload: PHASE.RUNNING });
    if (stateRef.current.gamePhase == PHASE.OVER) return;

    if (e.keyCode == 27) {
      if (
        stateRef.current.gamePhase == PHASE.RUNNING &&
        !confirm("Are you sure you want to exit the game?")
      )
        return;

      return dispatch({ type: ACTIONS.SET_PHASE, payload: PHASE.PRESTART });
    }

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
    inputRef.current?.scrollIntoView({ block: "center" });
  }

  useEffect(() => {
    window.addEventListener("resize", scrollHandler);

    return () => {
      window.removeEventListener("resize", scrollHandler);
    };
  }, []);

  const gameIsRunning = state.gamePhase == PHASE.RUNNING;
  useEffect(() => {
    const warningText = "Are you sure you want to exit the game?";
    const handleWindowClose = (e) => {
      if (!gameIsRunning) return;
      e.preventDefault();
      return (e.returnValue = warningText);
    };
    const handleBrowseAway = () => {
      if (!gameIsRunning) return;
      if (window.confirm(warningText)) return;
      router.events.emit("routeChangeError");
      throw "routeChange aborted.";
    };
    window.addEventListener("beforeunload", handleWindowClose);
    router.events.on("routeChangeStart", handleBrowseAway);
    return () => {
      window.removeEventListener("beforeunload", handleWindowClose);
      router.events.off("routeChangeStart", handleBrowseAway);
    };
  }, [gameIsRunning]);

  const renderStartScreen = () => (
    <div className={styles.container}>
      <Head>
        <title>Numberplus+</title>
        <meta name="description" content="Add them numbers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div style={{ width: "300px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>Mode:</div>
            <div
              className={styles.menuChoice}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <div
                className={cn([styles.clickable], {
                  [styles.activeChoice]: state.gameMode == MODE.PRACTICE,
                })}
                onClick={() =>
                  dispatch({ type: ACTIONS.SET_MODE, payload: MODE.PRACTICE })
                }
              >
                Practice
              </div>
              <div
                className={cn([styles.clickable], {
                  [styles.activeChoice]: state.gameMode == MODE.RANKED,
                })}
                onClick={() => {
                  dispatch({ type: ACTIONS.SET_MODE, payload: MODE.RANKED });
                  if (
                    state.gameDuration != 60 &&
                    state.gameDuration != 180 &&
                    state.gameDuration != 3600
                  )
                    dispatch({ type: ACTIONS.SET_TIME, payload: 60 });
                }}
              >
                Ranked
              </div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>Duration:</div>
            <div
              className={styles.menuChoice}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <div
                className={cn([styles.clickable], {
                  [styles.activeChoice]: state.gameDuration == 60,
                })}
                onClick={() =>
                  dispatch({ type: ACTIONS.SET_TIME, payload: 60 })
                }
              >
                1m
              </div>
              <div
                className={cn([styles.clickable], {
                  [styles.activeChoice]: state.gameDuration == 180,
                })}
                onClick={() =>
                  dispatch({ type: ACTIONS.SET_TIME, payload: 180 })
                }
              >
                3m
              </div>
              <div
                className={cn([styles.clickable], {
                  [styles.activeChoice]: state.gameDuration == 3600,
                })}
                onClick={() =>
                  dispatch({ type: ACTIONS.SET_TIME, payload: 3600 })
                }
              >
                60m
              </div>
              <div
                className={cn({
                  [styles.clickable]: state.gameMode == MODE.PRACTICE,
                  [styles.strikethrough]: state.gameMode == MODE.RANKED,
                  [styles.activeChoice]:
                    state.gameDuration != 60 &&
                    state.gameDuration != 180 &&
                    state.gameDuration != 3600,
                })}
                onClick={(e) => {
                  if (state.gameMode == MODE.RANKED) return;

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
          <hr></hr>
          <div
            className={styles.clickable}
            style={{ display: "flex", justifyContent: "center" }}
            onClick={() => dispatch({ type: ACTIONS.INIT_GAME })}
          >
            Start
          </div>
        </div>
      </main>
    </div>
  );

  const renderGameBoard = () => (
    <div className={styles.container}>
      <Head>
        <title>Numberplus+</title>
        <meta name="description" content="Add them numbers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.mask}>
          <div
            className={cn([styles.timer], {
              [styles.hide]: state.gameMode == MODE.RANKED,
            })}
          >
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
                        state.gameMode == MODE.PRACTICE &&
                        element !==
                          (renderedNumbers[idx] + renderedNumbers[idx + 1]) %
                            10,
                    })}
                    key={"answer-" + idx}
                  >
                    {element}
                  </div>
                ) : (
                  <div
                    key={"answer-" + idx}
                    className={cn([styles.activeAnswerContainer], {
                      [styles.blink]: state.gamePhase == PHASE.START,
                    })}
                  >
                    <input
                      autoFocus
                      type="number"
                      className={cn([styles.activeAnswer], {
                        [styles.wrong]:
                          state.gameMode == MODE.PRACTICE &&
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

  const renderResultScreen = () => {
    const correctAnswers = state.answers.filter(
      (e, idx) => e == (state.numbers[idx] + state.numbers[idx + 1]) % 10
    ).length;
    const wrongAnswers = state.maxActive - correctAnswers;
    const rawAPM = (state.maxActive / state.gameDuration) * 60;
    const APM = (correctAnswers / state.gameDuration) * 60;

    return (
      <div className={styles.container}>
        <Head>
          <title>Numberplus+</title>
          <meta name="description" content="Add them numbers" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <div style={{ width: "300px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>APM:</div>
              <div>{APM}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Raw APM:</div>
              <div>{rawAPM}</div>
            </div>
            <hr></hr>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Total:</div>
              <div>{state.maxActive}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Correct:</div>
              <div>{correctAnswers}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Wrong:</div>
              <div>{wrongAnswers}</div>
            </div>
            <br></br>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div
                onClick={() =>
                  dispatch({ type: ACTIONS.SET_PHASE, payload: PHASE.PRESTART })
                }
                style={{ cursor: "pointer" }}
              >
                Restart
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  };

  switch (state.gamePhase) {
    case PHASE.PRESTART:
      return renderStartScreen();
    case PHASE.START:
    case PHASE.RUNNING:
      return renderGameBoard();
    case PHASE.OVER:
      return renderResultScreen();
  }
}
