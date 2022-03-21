import Head from "next/head";
import Navbar from "./navbar.js";
import Footer from "./footer.js";
import styles from "./layout.module.css";

export default function Layout({ children, hide, titleClickHandler }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Tes Koran Online</title>
        <meta name="description" content="Add them numbers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Navbar {...{ hide, titleClickHandler }} />
        {children}
        <Footer {...{ hide }} />
      </main>
    </div>
  );
}
