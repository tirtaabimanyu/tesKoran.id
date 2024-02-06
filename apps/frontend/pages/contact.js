import styles from "../styles/Contact.module.css";

export default function Contact() {
  return (
    <div className={styles.container}>
      <h2>
        <strong>Contact Us</strong>
      </h2>
      <p>
        Whether you have a question, need support, or just want to say hello,
        you can get in touch with us at
      </p>
      <p className={styles.titleContainer}>
        <strong className={styles.title}>
          <a href="mailto:hello@teskoran.id">hello@teskoran.id</a>
        </strong>
      </p>
      <p>we&apos;d love to hear from you!</p>
    </div>
  );
}
