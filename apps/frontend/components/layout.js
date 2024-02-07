import Head from "next/head";
import Script from "next/script";
import Navbar from "./navbar.js";
import Footer from "./footer.js";
import styles from "./layout.module.css";
import { ToastContainer } from "react-toastify";

export default function Layout({ children, hide, titleClickHandler }) {
  return (
    <div className={styles.container}>
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />
      <Script strategy="lazyOnload" id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
         `}
      </Script>

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
