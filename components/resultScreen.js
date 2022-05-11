import cn from "classnames";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { FaRedo } from "react-icons/fa";
import styles from "./resultScreen.module.css";
import { ACTIONS } from "../utils/constants.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function parseDuration(second) {
  const hour = Math.floor(second / 3600);
  second = second % 3600;
  const minute = Math.floor(second / 60);
  second = second % 60;

  let str = "";
  if (hour) str += hour + "h";
  if (minute) str += minute + "m";
  if (second) str += second + "s";

  return str;
}

function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
}

function formatNumber(num) {
  if (Number.isInteger(num)) return num;
  return num.toFixed(2);
}

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
    const inputSecond = Math.floor(e.time[e.time.length - 1] / divisor);

    if (inputSecond >= correctChartData.length) return;

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
  const cumulativeCorrect = 0;
  correctChartData.forEach((e, idx) => {
    cumulativeCorrect += e;
    apmChartData[idx] = (cumulativeCorrect / (idx + 1)) * 60;
  });

  const cumulativeIncorrect = 0;
  incorrectChartData.forEach((e) => {
    cumulativeIncorrect += e;
  });

  const cumulativeModified = 0;
  modifiedChartData.forEach((e) => {
    cumulativeModified += e;
  });

  const apm = (cumulativeCorrect / gameDuration) * 60;
  const accuracy = (cumulativeCorrect / answers.length) * 100;

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
        max: maxScale ? maxScale * 2 : 10,
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

  return (
    <div className={styles.resultContainer}>
      <Line options={options} data={data} />
      <div className={styles.statsContainer}>
        <div className={styles.statsItem}>
          <div>APM</div>
          <div className={styles.statsValue}>{formatNumber(apm)}</div>
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
            {formatNumber(accuracy) + "%"}
          </div>
        </div>
        <div className={styles.statsItem}>
          <div>Test Type</div>
          <div className={styles.statsValueText}>
            <div>
              {capitalize(gameType) + ", " + capitalize(gameMode) + ", "}
            </div>
            <div>{parseDuration(gameDuration)}</div>
          </div>
        </div>
        <div
          className={styles.statsItem}
          onClick={() => dispatch({ type: ACTIONS.RESET_GAME })}
        >
          <div className={styles.restartButton}>
            <FaRedo size={48} />
            <div>Restart</div>
          </div>
        </div>
      </div>
    </div>
  );
}
