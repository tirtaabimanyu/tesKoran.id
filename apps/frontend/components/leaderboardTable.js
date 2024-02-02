import React, { useEffect, useRef, useState } from "react";
import { parseSecond, toFixed } from "../utils/formattings";
import styles from "./leaderboardTable.module.css";
import { FaSpinner } from "react-icons/fa";

export default function LeaderboardTable({
  duration,
  data,
  maxDataLength,
  className,
  scrollCallback,
}) {
  const loaderRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (scrollCallback == null) return;

    const observer = new IntersectionObserver(async (entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        if (data.length == maxDataLength) return;

        setIsLoading(true);
        await scrollCallback();
        setIsLoading(false);
      }
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [scrollCallback]);

  return (
    <div className={className}>
      <div className={styles.leaderboardHeader}>
        <h2>{parseSecond(duration)}</h2>
        {isLoading && <FaSpinner className={styles.spinner} />}
      </div>
      <div className={styles.leaderboardContent}>
        <table>
          <tbody>
            {data.length == 0 ? (
              <React.Fragment>
                <tr>
                  <td>
                    <div>
                      <hr />
                    </div>
                  </td>
                </tr>
                <tr style={{ textAlign: "center" }}>
                  <td>No data yet 🙁</td>
                </tr>
              </React.Fragment>
            ) : (
              data.map((e, idx) => (
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
              ))
            )}
            <tr ref={loaderRef}>
              <td
                colSpan="3"
                style={{ display: "flex", justifyContent: "center" }}
              />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
