import cn from "classnames";
import { useState, useEffect, useReducer, useRef } from "react";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import styles from "../styles/Home.module.css";
import { ACTIONS, MODE, PHASE, TYPE } from "../utils/constants.js";
import StartScreen from "../components/startScreen.js";
import GameBoard from "../components/gameBoard.js";
import Keyboard from "../components/keyboard.js";

// const allowedKeys = new Set([
//   8, 13, 27, 38, 40, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99,
//   100, 101, 102, 103, 104, 105,
// ]);

const allowedKeys = new Set([
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "Enter",
  "Backspace",
  "ArrowUp",
  "ArrowDown",
  "Escape",
]);

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.GENERATE_NEXT_NUMBERS:
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
      return { ...state, active: Math.min(state.maxActive, state.active + 1) };

    case ACTIONS.DECREMENT:
      return { ...state, active: Math.max(0, state.active - 1) };

    case ACTIONS.PUSH_ANSWER:
      state.answers[state.active] = action.payload.input;
      const active = Math.min(state.numbers.length - 1, state.active + 1);
      return {
        ...state,
        active,
        maxActive: Math.max(active, state.maxActive),
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

    case ACTIONS.RESET_GAME:
      return { ...state, gamePhase: PHASE.PRESTART };

    case ACTIONS.SET_PHASE:
      console.log("setphase");
      return { ...state, gamePhase: action.payload };

    case ACTIONS.SET_TIME:
      return { ...state, gameDuration: action.payload };

    case ACTIONS.DECREASE_TIME:
      return { ...state, secondsRemaining: state.secondsRemaining - 1 };

    case ACTIONS.SET_MODE:
      return { ...state, gameMode: action.payload };

    case ACTIONS.SET_TYPE:
      return { ...state, gameType: action.payload };
    default:
      return state;
  }
}

function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

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

function useCurrent(state) {
  const ref = useRef(state);
  useEffect(() => {
    ref.current = state;
  }, [state]);
  return ref;
}

export default function Home({ setHideLayout, titleClickHandler }) {
  const [state, dispatch] = useReducer(reducer, {
    active: 0,
    maxActive: 0,
    numbers: [],
    answers: [],
    gamePhase: PHASE.PRESTART,
    gameMode: MODE.PRACTICE,
    gameType: TYPE.PAULI,
    gameDuration: 30,
    secondsRemaining: null,
  });

  const stateRef = useCurrent(state);

  const resetGame = () => {
    if (
      stateRef.current.gamePhase == PHASE.RUNNING &&
      !confirm("Are you sure you want to exit the game?")
    )
      return;
    return dispatch({ type: ACTIONS.RESET_GAME });
  };

  useEffect(() => {
    titleClickHandler.click = resetGame;
  }, [titleClickHandler]);

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
    // alert(e.which);
    // console.log(e);
    if (!allowedKeys.has(e.key)) return;

    if (e.keyCode == 27) return resetGame();

    if (stateRef.current.gamePhase == PHASE.START)
      dispatch({ type: ACTIONS.SET_PHASE, payload: PHASE.RUNNING });

    if (stateRef.current.gamePhase == PHASE.OVER) return;

    if (e.key == "ArrowUp") {
      if (stateRef.current.gameType == TYPE.PAULI)
        return dispatch({ type: ACTIONS.DECREMENT });

      return dispatch({ type: ACTIONS.INCREMENT });
    }

    if (e.key == "ArrowDown") {
      if (stateRef.current.gameType == TYPE.PAULI)
        return dispatch({ type: ACTIONS.INCREMENT });

      return dispatch({ type: ACTIONS.DECREMENT });
    }

    if (e.key == "Backspace") return dispatch({ type: ACTIONS.DECREMENT });

    if (e.key == "Enter") return dispatch({ type: ACTIONS.INCREMENT });

    if (e.repeat || e.ctrlKey) return;

    if (stateRef.current.numbers.length - 10 <= stateRef.current.active)
      dispatch({ type: ACTIONS.GENERATE_NEXT_NUMBERS });

    return dispatch({
      type: ACTIONS.PUSH_ANSWER,
      payload: { input: parseInt(e.key) },
    });
  }

  // const inputRef = useRef(null);
  // function scrollHandler() {
  //   setTimeout(
  //     () =>
  //       inputRef.current?.scrollIntoView({
  //         behavior: "smooth",
  //         block: "center",
  //       }),
  //     50
  //   );
  // }

  // useEffect(() => {
  //   window.addEventListener("resize", scrollHandler);

  //   return () => {
  //     window.removeEventListener("resize", scrollHandler);
  //   };
  // }, []);

  // const gameIsRunning = state.gamePhase == PHASE.RUNNING;
  // useEffect(() => {
  //   const warningText = "Are you sure you want to exit the game?";
  //   const handleWindowClose = (e) => {
  //     if (!gameIsRunning) return;
  //     e.preventDefault();
  //     return (e.returnValue = warningText);
  //   };
  //   const handleBrowseAway = () => {
  //     if (!gameIsRunning) return;
  //     if (window.confirm(warningText)) return;
  //     router.events.emit("routeChangeError");
  //     throw "routeChange aborted.";
  //   };
  //   window.addEventListener("beforeunload", handleWindowClose);
  //   router.events.on("routeChangeStart", handleBrowseAway);
  //   return () => {
  //     window.removeEventListener("beforeunload", handleWindowClose);
  //     router.events.off("routeChangeStart", handleBrowseAway);
  //   };
  // }, [gameIsRunning]);

  const renderStartScreen = () => {
    const startScreenProps = {
      gameMode: state.gameMode,
      gameType: state.gameType,
      gameDuration: state.gameDuration,
      dispatch: dispatch,
    };

    return (
      <div className={styles.startContainer}>
        <StartScreen {...startScreenProps} />
      </div>
    );
  };

  const renderGameBoard = () => {
    const gameBoardProps = {
      gamePhase: state.gamePhase,
      gameMode: state.gameMode,
      gameType: state.gameType,
      seconds: state.secondsRemaining,
      active: state.active,
      renderedNumbers: state.numbers.slice(
        Math.max(0, state.active - 2),
        state.active + 4
      ),
      renderedAnswers: state.answers.slice(
        Math.max(0, state.active - 2),
        state.active + 4
      ),
    };

    return (
      <div className={styles.gameContainer}>
        <GameBoard {...gameBoardProps} />
        <Keyboard />
      </div>
    );
  };

  const renderResultScreen = () => {
    const correctAnswers = state.answers.filter(
      (e, idx) => e == (state.numbers[idx] + state.numbers[idx + 1]) % 10
    ).length;
    const wrongAnswers = state.maxActive - correctAnswers;
    const rawAPM = (state.maxActive / state.gameDuration) * 60;
    const APM = (correctAnswers / state.gameDuration) * 60;

    return (
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
    );
  };

  const hideLayout =
    state.gamePhase == PHASE.START || state.gamePhase == PHASE.RUNNING;
  useEffect(() => {
    setHideLayout(hideLayout);
  }, [hideLayout]);

  const showPage = (gamePhase) => {
    if (gamePhase == PHASE.PRESTART) return "startScreen";
    if (gamePhase == PHASE.START || gamePhase == PHASE.RUNNING)
      return "gameBoard";
    if (gamePhase == PHASE.OVER) return "resultScreen";
  };

  return (
    <SwitchTransition mode="out-in">
      <CSSTransition
        key={showPage(state.gamePhase)}
        classNames="fade"
        timeout={100}
      >
        <>
          {state.gamePhase == PHASE.PRESTART && renderStartScreen()}
          {(state.gamePhase == PHASE.START ||
            state.gamePhase == PHASE.RUNNING) &&
            renderGameBoard()}
          {state.gamePhase == PHASE.OVER && renderResultScreen()}
        </>
      </CSSTransition>
    </SwitchTransition>
  );

  // switch (state.gamePhase) {
  //   case PHASE.PRESTART:
  //     return renderStartScreen();
  //   case PHASE.START:
  //   case PHASE.RUNNING:
  //     return renderGameBoard();
  //   case PHASE.OVER:
  //     return renderResultScreen();
  // }
}
