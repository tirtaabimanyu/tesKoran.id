import Head from "next/head";
import Script from "next/script";
import Navbar from "./navbar.js";
import Footer from "./footer.js";
import styles from "./layout.module.css";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/router.js";

const pages = {
  "/": "tesKoran.id - Tes Koran Pauli & Kraepelin Online",
  "/leaderboard": "Leaderboard - tesKoran.id",
  "/about": "About - tesKoran.id",
  "/login": "Login - tesKoran.id",
  "/profile": "Profile - tesKoran.id",
  "/contact": "Contact Us - tesKoran.id",
  "/terms": "Terms of Service - tesKoran.id",
  "/privacy": "Privacy Policy - tesKoran.id",
  "/activation": "Email Verification - tesKoran.id",
  "/password-reset": "Reset Password - tesKoran.id",
};

export default function Layout({ children, hide, titleClickHandler }) {
  const router = useRouter();
  const title =
    router.pathname in pages
      ? pages[router.pathname]
      : "Page not Found - tesKoran.id";

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
        <title>{title}</title>
        <meta
          name="description"
          content="Tempat kamu latihan tes koran gratis. Sign up untuk menyimpan hasil tes kamu!"
        />
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
