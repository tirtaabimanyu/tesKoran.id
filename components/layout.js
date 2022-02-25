import Head from "next/head";
import styles from "./layout.module.css";

export default function Layout({ children }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Numberplus+</title>
        <meta name="description" content="Add them numbers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div>Navbar</div>
        {children}
        <div>Footer</div>
      </main>
    </div>
  );
}
