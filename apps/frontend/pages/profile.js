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
import {
  FaCheckCircle,
  FaCog,
  FaEnvelope,
  FaTimesCircle,
} from "react-icons/fa";
import Modal from "../components/modal.js";

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

  const onSubmitUsername = (data) => {
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
        <p>
          You can <strong>NOT</strong> change it later
        </p>
        <form
          className={styles.formContainer}
          onSubmit={handleSubmit(onSubmitUsername)}
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
    (v, k) =>
      new Date(historyData[k].created_at).toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "numeric",
      })
  );

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

  const [settingsModal, setSettingsModal] = useState(false);
  const toggleSettingsModal = () => setSettingsModal((prev) => !prev);

  const {
    register: registerChangePassword,
    handleSubmit: handleSubmitChangePassword,
    formState: {
      errors: errorsChangePassword,
      isValid: isValidChangePassowrd,
      dirtyFields: dirtyFieldsChangePassword,
    },
    trigger: triggerChangePassword,
    getValues: getValuesChangePassword,
    reset: resetChangePassword,
  } = useForm();

  const renderProfile = () => {
    return (
      <div className={styles.container}>
        <Modal visible={settingsModal} onDismiss={toggleSettingsModal}>
          <div className={styles.settingsModal}>
            <div>
              {data.user.is_active ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  Email has been verified <FaCheckCircle />
                </div>
              ) : (
                <div className={styles.formContainer}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    Email has not been verified{" "}
                    <FaTimesCircle size={16} color="dimgray" />
                  </div>
                  <button
                    onClick={() =>
                      AuthService.resendActivation(data.user.email)
                        .then(() =>
                          toast.success("Activation email has been sent!", {
                            theme: "colored",
                          })
                        )
                        .catch(() =>
                          toast.error(
                            "Can't send the activation email. Please try again later",
                            { theme: "colored" }
                          )
                        )
                    }
                  >
                    Resend activation email{" "}
                    <FaEnvelope size={16} color="dimgray" />
                  </button>
                </div>
              )}
            </div>
            <hr style={{ backgroundColor: "gray", width: "100%" }} />
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <div>Change Password</div>
              <form
                className={styles.formContainer}
                onSubmit={handleSubmitChangePassword((data) =>
                  AuthService.changePassword(
                    data.current_password,
                    data.new_password,
                    data.re_new_password
                  )
                    .then(() => {
                      resetChangePassword();
                      toast.success("Password has been updated successfully", {
                        theme: "colored",
                      });
                    })
                    .catch((error) => {
                      Object.entries(error.response.data).forEach((items) => {
                        toast.error(`${items[0]}: ${items[1]}`, {
                          theme: "colored",
                        });
                      });
                    })
                )}
              >
                <InputWithStatus
                  className={styles.inputContainer}
                  type="password"
                  placeholder="current password"
                  fieldName="current_password"
                  debounceWait={0}
                  trigger={triggerChangePassword}
                  register={registerChangePassword}
                  errors={errorsChangePassword["current_password"]}
                  isDirty={dirtyFieldsChangePassword["current_password"]}
                  options={{
                    required: "Please enter your current password",
                  }}
                />
                <InputWithStatus
                  type="password"
                  placeholder="new password"
                  fieldName="new_password"
                  debounceWait={0}
                  trigger={triggerChangePassword}
                  register={registerChangePassword}
                  errors={errorsChangePassword["new_password"]}
                  isDirty={dirtyFieldsChangePassword["new_password"]}
                  options={{
                    required: "New Password is required",
                    onChange: () => triggerChangePassword("re_new_password"),
                    validate: (value) =>
                      value.length >= 8 ||
                      "Password must be at least 8 character",
                  }}
                />
                <InputWithStatus
                  type="password"
                  placeholder="verify new password"
                  fieldName="re_new_password"
                  debounceWait={0}
                  trigger={triggerChangePassword}
                  register={registerChangePassword}
                  errors={errorsChangePassword["re_new_password"]}
                  isDirty={dirtyFieldsChangePassword["re_new_password"]}
                  options={{
                    required: "Please retype your new password",
                    validate: (value) =>
                      value == getValuesChangePassword("new_password") ||
                      "Password does not match",
                  }}
                />
                <button type="input" disabled={!isValidChangePassowrd}>
                  Submit
                </button>
              </form>
            </div>
          </div>
        </Modal>
        <div className={styles.profile}>
          <div className={styles.username}>
            <div
              style={{ display: "flex", alignItems: "baseline", gap: "4px" }}
            >
              <h1>{data.user.username}</h1>
              <FaCog
                className={styles.iconButton}
                size={20}
                onClick={toggleSettingsModal}
              />
            </div>
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
            <h1>{toFixed(data.average_apm)}</h1>
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
                readOnly
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
                readOnly
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
  if (data.user.can_change_username) return renderChangeUsername();
  else return renderProfile();
}
