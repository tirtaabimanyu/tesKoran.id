import React, { useState } from "react";
import cn from "classnames";
import styles from "../styles/Leaderboard.module.css";
import { FaCrown, FaUserAlt } from "react-icons/fa";
import { RANKMODE } from "../utils/constants.js";
import { toFixed, parseSecond } from "../utils/formattings.js";
import { useWindowWideMin } from "../utils/customHooks.js";

function generateNames() {
  return (
    Math.random().toString(36).substring(2, 10) +
    Math.random().toString(36).substring(2, 10)
  );
}

function generateRandoms() {
  return Array.from({ length: 30 }, () => ({
    name: generateNames(),
    date: new Date().toDateString(),
    apm: toFixed(50 + Math.random() * 50),
    accuracy: toFixed(90 + Math.random() * 10),
  })).sort((a, b) => b.apm - a.apm);
}

const durations = [30, 180, 1200, 3600];

const data = {
  30: {
    [RANKMODE.TOP]: generateRandoms(),
    [RANKMODE.PERSONAL]: generateRandoms(),
  },
  180: {
    [RANKMODE.TOP]: generateRandoms(),
    [RANKMODE.PERSONAL]: generateRandoms(),
  },
  1200: {
    [RANKMODE.TOP]: generateRandoms(),
    [RANKMODE.PERSONAL]: generateRandoms(),
  },
  3600: {
    [RANKMODE.TOP]: generateRandoms(),
    [RANKMODE.PERSONAL]: generateRandoms(),
  },
};

export default function Leaderboard() {
  const isMobile = useWindowWideMin(600);
  const [activeTable, setActiveTable] = useState(30);
  const [rankMode, setRankMode] = useState(
    durations.reduce((acc, val) => {
      return { ...acc, [val]: RANKMODE.TOP };
    }, {})
  );

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
                        {e.name}
                        <br />
                        <span className={styles.dateText}>{e.date}</span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {e.apm} apm
                        <br />
                        {e.accuracy}%
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
