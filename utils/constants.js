export const PHASE = {
  PRESTART: "prestart",
  START: "start",
  RUNNING: "running",
  OVER: "over",
};

export const MODE = {
  PRACTICE: "practice",
  RANKED: "ranked",
};

export const TYPE = {
  PAULI: "pauli",
  KRAEPELIN: "kraepelin",
};

export const ACTIONS = {
  GENERATE_NEXT_NUMBERS: "generate-next-numbers",
  PUSH_ANSWER: "push-answer",
  INCREMENT: "increment",
  DECREMENT: "decrement",
  INIT_GAME: "init-game",
  START_GAME: "start-game",
  RESET_GAME: "reset-game",
  SET_PHASE: "set-phase",
  SET_TIME: "set-time",
  DECREASE_TIME: "decrease-time",
  SET_MODE: "set-mode",
  SET_TYPE: "set-type",
};

export const allowedKeys = new Set([
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
