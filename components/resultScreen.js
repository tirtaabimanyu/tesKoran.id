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
import { Line, Chart } from "react-chartjs-2";
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

export default function ResultScreen({
  numbers,
  answers,
  gameDuration,
  dispatch,
}) {
  console.log("num", numbers);
  console.log("ans", answers);
  // const correctAnswers = answers.filter(
  //   (e, idx) => e.value == (numbers[idx] + numbers[idx + 1]) % 10
  // ).length;
  // const wrongAnswers = maxActive - correctAnswers;
  // const rawAPM = (maxActive / gameDuration) * 60;
  // const APM = (correctAnswers / gameDuration) * 60;

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
    console.log(idx, inputSecond, total, maxScale);
  });

  const apmChartData = Array(correctChartData.length).fill(0);
  const cumulativeCorrect = 0;
  correctChartData.forEach((e, idx) => {
    cumulativeCorrect += e;
    apmChartData[idx] = (cumulativeCorrect / (idx + 1)) * 60;
  });

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
      },
    },
  };

  const labels = Array.from({ length: apmChartData.length }, (v, k) => k + 1);
  const data = {
    labels,
    datasets: [
      {
        type: "line",
        label: "apm",
        data: labels.map((v, idx) => apmChartData[idx]),
        yAxisID: "y",
      },
      {
        type: "bar",
        label: "correct",
        data: labels.map((v, idx) => correctChartData[idx]),
        borderColor: "#0070f3",
        backgroundColor: "#0070f3",
        yAxisID: "y1",
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

  return <Line options={options} data={data} />;

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
        <div>{maxActive}</div>
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
          onClick={() => dispatch({ type: ACTIONS.RESET_GAME })}
          style={{ cursor: "pointer" }}
        >
          Restart
        </div>
      </div>
    </div>
  );
}
