import React from "react";
import { parseSecond, toFixed } from "../utils/formattings";
import styles from "./leaderboardTable.module.css";

export default function LeaderboardTable({ duration, data, className }) {
  return (
    <div className={className}>
      <div className={styles.leaderboardHeader}>
        <h2>{parseSecond(duration)}</h2>
      </div>
      <div className={styles.leaderboardContent}>
        <table>
          {data.length == 0 ? (
            <tbody style={{ textAlign: "center" }}>
              <tr>
                <td>
                  <div>
                    <hr />
                  </div>
                </td>
              </tr>
              <tr>
                <td>No data yet 🙁</td>
              </tr>
            </tbody>
          ) : (
            data.map((e, idx) => (
              <tbody key={duration + "-" + idx}>
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
              </tbody>
            ))
          )}
        </table>
      </div>
    </div>
  );
}
