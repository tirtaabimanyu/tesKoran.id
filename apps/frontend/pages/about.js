import Link from "next/link";
import styles from "../styles/About.module.css";

export default function About() {
  return (
    <div className={styles.container}>
      <h2>About</h2>
      <p>
        <Link href="/">tesKoran.id</Link> is an online Pauli and Kraepelin test.
        We feature a minimalist design to make you focus on just taking the
        test. We also try to simulate the real-life environment of doing the
        test on paper with our vertical design. You can use the practice mode
        first to train your addition skill before taking the ranked test and
        compare your result to other users!
      </p>

      <h3>Test types</h3>
      <ul>
        <li>
          Pauli - You are asked to add 2 numbers from top to bottom and only
          write the last digit of the answer.
        </li>
        <li>
          Kraepelin - You are asked to add 2 numbers from bottom to top and only
          write the last digit of the answer.
        </li>
      </ul>

      <h3>Modes</h3>
      <ul>
        <li>
          Practice - You can see the test timer and incorrect answers are marked{" "}
          <span style={{ color: "red" }}>red</span>. Test results will{" "}
          <b>not</b> be submitted to the{" "}
          <Link href="/leaderboard">public leaderboard</Link> but you can still
          see yours on your <Link href="profile">Profile page</Link>.
        </li>
        <li>
          Ranked - You can&apos;t see the test timer. Both correct and incorrect
          answers are the same <span style={{ color: "#0070f3" }}>color</span>.
          Test results will be submitted to the{" "}
          <Link href="/leaderboard">public leaderboard</Link>.
        </li>
      </ul>

      <h3>Stats</h3>
      <ul>
        <li>apm - total number of correct additions per minute.</li>

        <li>accuracy - percentage of correct additions.</li>

        <li>correct - number of correct answers.</li>

        <li>incorrect - number of incorrect answers.</li>

        <li>
          modified - number of modified answers. This stat only tracks how many
          times you modify an answer and not the result of those modifications.
        </li>
      </ul>

      <h3>Keybinds</h3>
      <p>
        You can use the number keys or numpad to type your answer. Press{" "}
        <span className={styles.codeText}>Backspace</span>/
        <span className={styles.codeText}>ArrowUp</span> to navigate backward
        and <span className={styles.codeText}>Enter</span>/
        <span className={styles.codeText}>ArrowDown</span> to navigate forward
        depending on your test type. Just try it out in practice mode!
      </p>

      <h3>Results Screen</h3>
      <p>
        After completing a test you will be able to see your apm, accuracy, and
        the number of correct, incorrect, and modified answers. You can also see
        a graph of your apm and accuracy throughout the test.
      </p>
    </div>
  );
}
