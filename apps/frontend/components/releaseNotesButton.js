import Modal from "./modal.js";
import { FaGitAlt } from "react-icons/fa";
import styles from "./releaseNotesButton.module.css";
import { useState } from "react";

export default function ReleaseNotesButton() {
  const [visible, setVisible] = useState(false);

  return (
    <div className={styles.container}>
      <Modal visible={visible} onDismiss={() => setVisible(false)}>
        <div className={styles.modal}>
          <h2>Release Notes</h2>
          <h3>v1.0.0</h3>
          <ul>
            <li>tesKoran.id is released 🥳</li>
          </ul>
        </div>
      </Modal>
      <div className={styles.button} onClick={() => setVisible(true)}>
        <FaGitAlt />
        <div>v1.0.0</div>
      </div>
    </div>
  );
}
