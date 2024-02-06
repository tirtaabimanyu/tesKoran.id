import cn from "classnames";
import { FaRedo } from "react-icons/fa";
import styles from "./resultScreen.module.css";
import { ACTIONS, MODE } from "../utils/constants.js";
import { toFixed, parseSecond, capitalize } from "../utils/formattings.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  LineController,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { useEffect } from "react";
import TokenService from "../services/token.service.js";
import ScoresService from "../services/scores.service.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  LineController
);

export default function ResultScreen({
  numbers,
  answers,
  gameDuration,
  gameType,
  gameMode,
  dispatch,
}) {
  let correctChartData = [];
  let incorrectChartData = [];
  let modifiedChartData = [];
  let divisor = 1;

  if (gameDuration == 1200) {
    correctChartData = Array(40).fill(0);
    incorrectChartData = Array(40).fill(0);
    modifiedChartData = Array(40).fill(0);
    divisor = 30;
  } else if (gameDuration == 3600) {
    correctChartData = Array(20).fill(0);
    incorrectChartData = Array(20).fill(0);
    modifiedChartData = Array(20).fill(0);
    divisor = 180;
  } else if (gameDuration == 180) {
    correctChartData = Array(30).fill(0);
    incorrectChartData = Array(30).fill(0);
    modifiedChartData = Array(30).fill(0);
    divisor = 6;
  } else {
    correctChartData = Array(gameDuration).fill(0);
    incorrectChartData = Array(gameDuration).fill(0);
    modifiedChartData = Array(gameDuration).fill(0);
    divisor = 1;
  }

  let maxScale = 0;
  answers.forEach((e, idx) => {
    const isCorrectAnswer = e.value == (numbers[idx] + numbers[idx + 1]) % 10;
    let inputSecond = Math.floor(e.time[e.time.length - 1] / divisor);

    if (inputSecond > correctChartData.length) return;
    if (inputSecond == correctChartData.length) inputSecond -= 1;

    if (isCorrectAnswer) {
      correctChartData[inputSecond] += 1;
    } else {
      incorrectChartData[inputSecond] += 1;
    }

    modifiedChartData[inputSecond] += e.time.length - 1;

    const total =
      correctChartData[inputSecond] +
      incorrectChartData[inputSecond] +
      modifiedChartData[inputSecond];
    maxScale = Math.max(maxScale, total);
  });

  const apmChartData = Array(correctChartData.length).fill(0);
  let cumulativeCorrect = 0;
  correctChartData.forEach((e, idx) => {
    cumulativeCorrect += e;
    apmChartData[idx] = (cumulativeCorrect / (idx + 1) / divisor) * 60;
  });

  let cumulativeIncorrect = 0;
  incorrectChartData.forEach((e) => {
    cumulativeIncorrect += e;
  });

  let cumulativeModified = 0;
  modifiedChartData.forEach((e) => {
    cumulativeModified += e;
  });

  const apm = (cumulativeCorrect / gameDuration) * 60;
  const accuracy = cumulativeCorrect / answers.length;

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        intersect: false,
        mode: "index",
        position: "nearest",
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Addition Per Minute",
        },
      },
      y1: {
        beginAtZero: true,
        max: Math.max(Math.floor(maxScale * 1.5), 3),
        stacked: true,
        ticks: {
          stepSize: 1,
        },
        position: "right",
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: "Addition",
        },
      },
    },
  };

  const labels = Array.from(
    { length: gameDuration / divisor },
    (v, k) => (k + 1) * divisor
  );
  const data = {
    labels,
    datasets: [
      {
        type: "line",
        label: "apm",
        data: labels.map((v, idx) => apmChartData[idx]),
        yAxisID: "y",
        borderColor: "#0070f3",
        backgroundColor: "#0070f3",
      },
      {
        type: "bar",
        label: "correct",
        data: labels.map((v, idx) => correctChartData[idx]),
        yAxisID: "y1",
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgb(53, 162, 235)",
      },
      {
        type: "bar",
        label: "modified",
        data: labels.map((v, idx) => modifiedChartData[idx]),
        borderColor: "darkorange",
        backgroundColor: "darkorange",
        yAxisID: "y1",
      },
      {
        type: "bar",
        label: "incorrect",
        data: labels.map((v, idx) => incorrectChartData[idx]),
        borderColor: "red",
        backgroundColor: "red",
        yAxisID: "y1",
      },
    ],
  };

  useEffect(() => {
    const { user } = TokenService.getUser();
    if (user == null) {
      toast.warning("Can not submit score because you are not logged in 👤", {
        theme: "colored",
      });
      return;
    }

    if (![30, 180, 1200, 3600].includes(gameDuration)) {
      toast.warning(
        "Can not submit score because the test duration is custom ⏱️",
        {
          theme: "colored",
        }
      );
      return;
    }

    if (accuracy < 0.5) {
      toast.warning(
        "Can not submit score because accuracy is less than 50% 🥲",
        {
          theme: "colored",
        }
      );
      return;
    }

    ScoresService.submitScore({
      is_ranked: gameMode == MODE.RANKED,
      addition_per_minute: apm,
      accuracy: accuracy,
      correct_answer: cumulativeCorrect,
      modified_answer: cumulativeModified,
      incorrect_answer: cumulativeIncorrect,
      test_type: gameType,
      duration: gameDuration,
    })
      .then(() => {
        toast.success("Score has been submitted successfully 😀", {
          theme: "colored",
        });
      })
      .catch(() => {
        toast.error("Error while submitting score ❌", { theme: "colored" });
      });
  }, []);

  return (
    <div className={styles.resultContainer}>
      <Chart type={"line"} options={options} data={data} />
      <div className={styles.statsContainer}>
        <div className={styles.statsItem}>
          <div>APM</div>
          <div className={styles.statsValue}>{toFixed(apm)}</div>
        </div>
        <div className={styles.statsItem}>
          <div>Statistics</div>
          <div className={cn([styles.statsValue, styles.tooltipContainer])}>
            <span className={styles.tooltip}>Correct/Modified/Incorrect</span>
            {cumulativeCorrect +
              "/" +
              cumulativeModified +
              "/" +
              cumulativeIncorrect}
          </div>
        </div>
        <div className={styles.statsItem}>
          <div>Accuracy</div>
          <div className={styles.statsValue}>
            {toFixed(accuracy * 100) + "%"}
          </div>
        </div>
        <div className={styles.statsItem}>
          <div>Test Type</div>
          <div className={styles.statsValueText}>
            <div>
              {capitalize(gameType) + ", " + capitalize(gameMode) + ", "}
            </div>
            <div>{parseSecond(gameDuration)}</div>
          </div>
        </div>
        <div
          className={styles.statsItem}
          onClick={() => dispatch({ type: ACTIONS.RESET_GAME })}
        >
          <div className={styles.restartButton}>
            <FaRedo className={styles.restartIcon} />
            <div>Restart</div>
          </div>
        </div>
      </div>
    </div>
  );
}
