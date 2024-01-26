import Head from "next/head";
import Navbar from "./navbar.js";
import Footer from "./footer.js";
import styles from "./layout.module.css";
import { ToastContainer } from "react-toastify";

export default function Layout({ children, hide, titleClickHandler }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>tesKoran.id - Pauli & Kraepelin Test Online</title>
        <meta name="description" content="Add them numbers" />
        <meta name="viewport" content="width=device-width, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ToastContainer />
      <main className={styles.main}>
        <Navbar {...{ hide, titleClickHandler }} />
        {children}
        <Footer {...{ hide }} />
      </main>
    </div>
  );
}