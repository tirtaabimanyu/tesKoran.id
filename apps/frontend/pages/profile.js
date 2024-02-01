import cn from "classnames";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { parseSecond, toFixed } from "../utils/formattings.js";
import AuthService from "../services/auth.service";
import TokenService from "../services/token.service";
import UserService from "../services/user.service";
import Spinner from "../components/spinner";
import InputWithStatus from "../components/inputWithStatus";
import styles from "../styles/Profile.module.css";
import { TEST_DURATIONS, TEST_DURATIONS_DICT } from "../utils/constants";
import { useWindowWideMin } from "../utils/customHooks";
import { Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  LineController,
} from "chart.js";
import LeaderboardTable from "../components/leaderboardTable.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  LineController
);

const checkUsername = async (username) => {
  try {
    await UserService.checkUsername(username);
  } catch (_error) {
    const { detail, username } = _error.response.data;
    return detail || username[0];
  }
  return true;
};

const resendActivation = (email) => {
  AuthService.resendActivation(email)
    .then((response) => {
      toast.success("Activation email has been sent", { theme: "colored" });
    })
    .catch((error) => {
      toast.error("Error while sending activation email", { theme: "colored" });
    });
};

export default function Profile() {
  const isMobile = useWindowWideMin(600);
  const [activeTable, setActiveTable] = useState(30);
  const router = useRouter();
  const [data, setData] = useState({
    user: {
      username: null,
    },
    email: null,
    can_change_username: null,
    is_active: null,
    join_date: null,
    total_test: 0,
    total_time: 0,
    average_apm: 0,
    average_accuracy: 0,
    history: {
      ranked: [],
      mixed: [],
    },
    leaderboard: {
      ranked: {
        THIRTY_SECOND: [],
        THREE_MINUTE: [],
        TWENTY_MINUTE: [],
        ONE_HOUR: [],
      },
      mixed: {
        THIRTY_SECOND: [],
        THREE_MINUTE: [],
        TWENTY_MINUTE: [],
        ONE_HOUR: [],
      },
    },
  });
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, dirtyFields },
    trigger,
  } = useForm();

  const fetchProfile = () => {
    setLoading(true);
    return UserService.getUserProfile()
      .then((response) => {
        console.log(response.data);
        setData((prevData) => ({ ...prevData, ...response.data }));
        setLoading(false);
      })
      .catch((error) => {
        toast.error("Can't fetch profile", { theme: "colored" });
        setLoading(false);
      });
  };

  useEffect(() => {
    const { user } = TokenService.getUser();
    if (user == null) router.push("/login");
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const onSubmit = (data) => {
    const { username } = data;
    setLoading(true);
    UserService.setUsername(username)
      .then(() => {
        toast.success("Username has been set successfully", {
          theme: "colored",
        });
        fetchProfile().then(() => {
          TokenService.refreshToken();
        });
      })
      .catch((error) => {
        toast.error(error.response.data[0], { theme: "colored" });
        setLoading(false);
      });
  };

  const renderChangeUsername = () => {
    return (
      <div>
        <h3 style={{ marginTop: 0, marginBottom: 0 }}>
          Please choose a username
        </h3>
        <p>{`You can't change it later`}</p>
        <form
          className={styles.formContainer}
          onSubmit={handleSubmit(onSubmit)}
        >
          <InputWithStatus
            fieldName="username"
            debounceWait={500}
            trigger={trigger}
            register={register}
            errors={errors["username"]}
            isDirty={dirtyFields["username"]}
            options={{
              required: true,
              validate: checkUsername,
              value: data?.username,
            }}
          />
          <button type="input" disabled={!isValid}>
            Submit
          </button>
        </form>
      </div>
    );
  };

  const [rankOnlyHistory, setRankOnlyHistory] = useState(false);
  const historyData = rankOnlyHistory
    ? data.history.ranked
    : data.history.mixed;

  const [rankOnlyLeaderboard, setRankOnlyLeaderboard] = useState(false);
  const leaderboardData = rankOnlyLeaderboard
    ? data.leaderboard.ranked
    : data.leaderboard.mixed;

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
      y: {
        title: {
          display: true,
          text: "Addition Per Minute",
        },
      },
    },
  };

  const labels = Array.from(
    { length: Math.min(10, historyData.length) },
    (v, k) => k + 1 + Math.max(0, data.total_test - 10)
  );
  console.log(labels);

  const chartData = {
    labels,
    datasets: [
      {
        type: "line",
        label: "apm",
        data: Object.entries(historyData).map(([_, e]) => e.apm),
        yAxisID: "y",
        borderColor: "#0070f3",
        backgroundColor: "#0070f3",
      },
      {
        type: "line",
        label: "accuracy",
        data: Object.entries(historyData).map(([_, e]) => e.accuracy * 100),
        yAxisID: "y",
        borderColor: "gray",
        backgroundColor: "gray",
      },
    ],
  };

  const renderProfile = () => {
    return (
      <div className={styles.container}>
        <div className={styles.profile}>
          <div className={styles.username}>
            <h1>{data.user.username}</h1>
            <div className={styles.statsLabel}>{`Joined ${new Date(
              data.user.created_on
            ).toLocaleDateString()}`}</div>
          </div>
          <div className={styles.profileStats}>
            <div className={styles.statsLabel}>test completed</div>
            <h1>{data.total_test}</h1>
          </div>
          <div className={styles.profileStats}>
            <div className={styles.statsLabel}>total time</div>
            <h1>{parseSecond(data.total_time)}</h1>
          </div>
          <div className={styles.profileStats}>
            <div className={styles.statsLabel}>average apm</div>
            <h1>{data.average_apm}</h1>
          </div>
          <div className={styles.profileStats}>
            <div className={styles.statsLabel}>average accuracy</div>
            <h1>{toFixed(data.average_accuracy * 100)}%</h1>
          </div>
        </div>
        <div className={styles.historyContainer}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <h2>Test History</h2>
            <div
              style={{ display: "flex", alignItems: "center" }}
              onClick={() => setRankOnlyHistory((prev) => !prev)}
            >
              <input
                type="checkbox"
                style={{ marginTop: 0, marginBottom: 0 }}
                checked={rankOnlyHistory}
              />
              <div className={styles.statsLabel}>show ranked test only</div>
            </div>
          </div>
          <Chart
            type={"line"}
            options={options}
            data={chartData}
            height={isMobile ? 150 : 75}
          />
        </div>
        <div className={styles.personalLeaderboardContainer}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <h2>Personal Leaderboard</h2>
            <div
              style={{ display: "flex", alignItems: "center" }}
              onClick={() => setRankOnlyLeaderboard((prev) => !prev)}
            >
              <input
                type="checkbox"
                style={{ marginTop: 0, marginBottom: 0 }}
                checked={rankOnlyLeaderboard}
              />
              <div className={styles.statsLabel}>show ranked test only</div>
            </div>
          </div>
          <div className={styles.durationFilter}>
            {TEST_DURATIONS.map((e) => (
              <div
                key={"filter-" + e}
                className={cn({ [styles.active]: activeTable == e })}
                onClick={() => setActiveTable(e)}
              >
                {parseSecond(e)}
              </div>
            ))}
          </div>
          <div className={styles.personalLeaderboardContent}>
            {Object.entries(leaderboardData).map(([duration, entries]) => (
              <LeaderboardTable
                key={`leaderboard-${TEST_DURATIONS_DICT[duration]}`}
                className={cn([styles.leaderboardContainer], {
                  [styles.hide]:
                    isMobile && activeTable != TEST_DURATIONS_DICT[duration],
                })}
                duration={TEST_DURATIONS_DICT[duration]}
                data={entries}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (!data || loading) return <Spinner loading={loading} />;
  if (data.can_change_username) return renderChangeUsername();
  else return renderProfile();
}
