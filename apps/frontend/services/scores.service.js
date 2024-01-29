import api from "./api";

const getTopLeaderboard = (duration, limit = 10, offset = 0) => {
  return api.get(
    `scores/leaderboard/${duration}/?limit=${limit}&offset=${offset}`
  );
};

const submitScore = (data) => {
  return api.post(`scores/`, {
    is_ranked: data.is_ranked,
    addition_per_minute: data.addition_per_minute,
    accuracy: data.accuracy,
    correct_answer: data.correct_answer,
    modified_answer: data.modified_answer,
    incorrect_answer: data.incorrect_answer,
    test_type: data.test_type,
    duration: data.duration,
  });
};

const ScoresService = {
  getTopLeaderboard,
  submitScore,
};

export default ScoresService;
