import React, { useEffect, useState } from "react";
import cn from "classnames";
import styles from "../styles/Leaderboard.module.css";
import { FaCrown, FaUserAlt } from "react-icons/fa";
import { RANKMODE } from "../utils/constants.js";
import { toFixed, parseSecond } from "../utils/formattings.js";
import { useWindowWideMin } from "../utils/customHooks.js";
import ScoresService from "../services/scores.service.js";

const durations = [30, 180, 1200, 3600];

export default function Leaderboard() {
  const isMobile = useWindowWideMin(600);
  const [activeTable, setActiveTable] = useState(30);
  const [rankMode, setRankMode] = useState(
    durations.reduce((acc, val) => {
      return { ...acc, [val]: RANKMODE.TOP };
    }, {})
  );
  const [data, setData] = useState({
    30: {
      [RANKMODE.TOP]: [],
      [RANKMODE.PERSONAL]: [],
    },
    180: {
      [RANKMODE.TOP]: [],
      [RANKMODE.PERSONAL]: [],
    },
    1200: {
      [RANKMODE.TOP]: [],
      [RANKMODE.PERSONAL]: [],
    },
    3600: {
      [RANKMODE.TOP]: [],
      [RANKMODE.PERSONAL]: [],
    },
  });

  const fetchTopLeaderboard = (duration, limit, offset) => {
    return ScoresService.getTopLeaderboard(duration, limit, offset).then(
      (response) => {
        setData((prevData) => ({
          ...prevData,
          [duration]: {
            ...prevData[duration],
            [RANKMODE.TOP]: [
              ...prevData[duration][RANKMODE.TOP],
              ...response.data.results,
            ],
          },
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
      <div className={styles.title}>
        <div>Leaderboards</div>
        <div className={styles.durationFilter}>
          {durations.map((e) => (
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
          <div
            key={"leaderboard" + duration}
            className={cn([styles.leaderboardContainer], {
              [styles.hide]: isMobile && activeTable != duration,
            })}
          >
            <div className={styles.leaderboardHeader}>
              <h2>{parseSecond(duration)}</h2>
              <div className={styles.modeButtonContainer}>
                <FaCrown
                  size={24}
                  className={cn({
                    [styles.activeMode]: rankMode[duration] == RANKMODE.TOP,
                  })}
                  onClick={() =>
                    setRankMode({ ...rankMode, [duration]: RANKMODE.TOP })
                  }
                />
                <FaUserAlt
                  size={20}
                  className={cn({
                    [styles.activeMode]:
                      rankMode[duration] == RANKMODE.PERSONAL,
                  })}
                  onClick={() =>
                    setRankMode({ ...rankMode, [duration]: RANKMODE.PERSONAL })
                  }
                />
              </div>
            </div>
            <div className={styles.leaderboardContent}>
              <table>
                {leaderboardData[rankMode[duration]].map((e, idx) => (
                  <React.Fragment key={duration + "-" + idx}>
                    <tr>
                      <td colSpan="3">
                        <div>
                          <hr />
                        </div>
                      </td>
                    </tr>
                    <tr className={styles.leaderboardEntry}>
                      <td className={styles.centered}>{idx + 1}</td>
                      <td>
                        {e.username}
                        <br />
                        <span className={styles.dateText}>
                          {new Date(e.created_at).toLocaleString()}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {e.addition_per_minute} apm
                        <br />
                        {toFixed(e.accuracy * 100)}%
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
