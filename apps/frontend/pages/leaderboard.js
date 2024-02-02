import React, { useEffect, useState } from "react";
import cn from "classnames";
import styles from "../styles/Leaderboard.module.css";
import { TEST_DURATIONS } from "../utils/constants.js";
import { toFixed, parseSecond } from "../utils/formattings.js";
import { useWindowWideMin } from "../utils/customHooks.js";
import ScoresService from "../services/scores.service.js";
import LeaderboardTable from "../components/leaderboardTable.js";

export default function Leaderboard() {
  const isMobile = useWindowWideMin(600);
  const [activeTable, setActiveTable] = useState(30);
  const [data, setData] = useState({
    30: [],
    180: [],
    1200: [],
    3600: [],
  });
  const [maxDataLength, setMaxDataLength] = useState({
    30: 0,
    180: 0,
    1200: 0,
    3600: 0,
  });

  const fetchTopLeaderboard = (duration, limit, offset) => {
    return ScoresService.getTopLeaderboard(duration, limit, offset).then(
      (response) => {
        setData((prevData) => ({
          ...prevData,
          [duration]: [...prevData[duration], ...response.data.results],
        }));
        setMaxDataLength((prevData) => ({
          ...prevData,
          [duration]: response.data.count,
        }));
      }
    );
  };

  useEffect(() => {
    fetchTopLeaderboard(30, 10, 0);
    fetchTopLeaderboard(180, 10, 0);
    fetchTopLeaderboard(1200, 10, 0);
    fetchTopLeaderboard(3600, 10, 0);
  }, []);

  return (
    <div className={styles.container}>
      <p style={{ margin: 0, marginBottom: "8px" }}>
        Only <b>ranked</b> test result is shown
      </p>
      <div className={styles.title}>
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
      </div>
      <div className={styles.content}>
        {Object.entries(data).map(([duration, leaderboardData]) => (
          <LeaderboardTable
            key={`leaderboard-${duration}`}
            className={cn([styles.leaderboardContainer], {
              [styles.hide]: isMobile && activeTable != duration,
            })}
            duration={duration}
            data={leaderboardData}
            maxDataLength={maxDataLength[duration]}
            scrollCallback={() =>
              fetchTopLeaderboard(duration, 10, leaderboardData.length)
            }
          />
        ))}
      </div>
    </div>
  );
}
