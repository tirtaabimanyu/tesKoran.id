import { useEffect, useReducer, useRef } from "react";
import { SwitchTransition, CSSTransition } from "react-transition-group";

import styles from "../styles/Home.module.css";
import { useInterval, useCurrent } from "../utils/customHooks.js";
import { ACTIONS, MODE, PHASE, TYPE, allowedKeys } from "../utils/constants.js";
import StartScreen from "../components/startScreen.js";
import GameBoard from "../components/gameBoard.js";
import ResultScreen from "../components/resultScreen.js";
import Keyboard from "../components/keyboard.js";

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.GENERATE_NEXT_NUMBERS:
      const newNumbers = Array.from({ length: 100 }, () =>
        Math.floor(Math.random() * 10)
      );
      const newAnswers = Array.from(
        { length: state.numbers.length + newNumbers.length },
        () => ({ value: null, time: [] })
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
      const answers = state.answers.slice();

      answers[state.active] = { ...answers[state.active] };
      answers[state.active].value = action.payload.input;
      answers[state.active].time = answers[state.active].time.slice();
      answers[state.active].time.push(
        (action.payload.time - state.startTimestamp) / 1000
      );

      return {
        ...state,
        answers,
        active: state.active + 1,
        maxActive: Math.max(state.active + 1, state.maxActive),
      };

    case ACTIONS.INIT_GAME:
      const numbers = Array.from({ length: 100 }, () =>
        Math.floor(Math.random() * 10)
      );

      return {
        ...state,
        numbers,
        answers: Array.from({ length: numbers.length }, () => ({
          value: null,
          time: [],
        })),
        gamePhase: PHASE.START,
        secondsRemaining: state.gameDuration,
        active: 0,
        maxActive: 0,
      };

    case ACTIONS.START_GAME:
      return { ...state, gamePhase: PHASE.RUNNING, startTimestamp: Date.now() };

    case ACTIONS.RESET_GAME:
      return { ...state, gamePhase: PHASE.PRESTART };

    case ACTIONS.SET_PHASE:
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
    startTimestamp: null,
  });

  const stateRef = useCurrent(state);

  const resetGame = () => {
    // if (
    //   stateRef.current.gamePhase == PHASE.RUNNING &&
    //   !confirm("Are you sure you want to exit the game?")
    // )
    //   return;
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
    const callback = (e) => keyDown(e);

    window.addEventListener("keydown", callback);
    return () => {
      window.removeEventListener("keydown", callback);
    };
  }, []);

  function keyDown(e) {
    if (!allowedKeys.has(e.key)) return;
    if (stateRef.current.secondsRemaining == 0) return;

    if (e.keyCode == 27) return resetGame();

    if (stateRef.current.gamePhase == PHASE.START)
      dispatch({ type: ACTIONS.START_GAME });

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
      payload: { input: parseInt(e.key), time: Date.now() },
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

    return <StartScreen {...startScreenProps} />;
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
    const resultScreenProps = {
      numbers: state.numbers.slice(0, state.maxActive + 1),
      answers: state.answers.slice(0, state.maxActive),
      gameDuration: state.gameDuration,
      gameType: state.gameType,
      gameMode: state.gameMode,
      dispatch: dispatch,
    };

    return <ResultScreen {...resultScreenProps} />;
  };

  const hideLayout =
    state.gamePhase == PHASE.START || state.gamePhase == PHASE.RUNNING;
  useEffect(() => {
    setHideLayout(hideLayout);
  }, [hideLayout]);

  const nodeRef = useRef(null);

  return (
    <SwitchTransition mode="out-in">
      <CSSTransition
        nodeRef={nodeRef}
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
}

const showPage = (gamePhase) => {
  if (gamePhase == PHASE.PRESTART) return "startScreen";
  if (gamePhase == PHASE.START || gamePhase == PHASE.RUNNING)
    return "gameBoard";
  if (gamePhase == PHASE.OVER) return "resultScreen";
};
