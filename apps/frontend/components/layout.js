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

const noindexPages = ["/leaderboard"];

export default function Layout({ children, hide, titleClickHandler }) {
  const router = useRouter();
  const title =
    router.pathname in pages
      ? pages[router.pathname]
      : "Page not Found - tesKoran.id";
  const noindex = noindexPages.includes(router.pathname);

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
        {noindex && <meta name="robots" content="noindex" />}

        {/* PWA metadata */}
        <meta name="application-name" content="tesKoran.id" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="tesKoran.id" />
        <meta
          name="description"
          content="Tempat kamu latihan tes koran gratis. Daftar dan simpan hasil tes kamu!"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#2B5797" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" href="/favicon.ico" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://teskoran.id" />
        <meta name="twitter:title" content="tesKoran.id" />
        <meta
          name="description"
          content="Tempat kamu latihan tes koran gratis. Daftar dan simpan hasil tes kamu!"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="tesKoran.id" />
        <meta
          name="description"
          content="Tempat kamu latihan tes koran gratis. Daftar dan simpan hasil tes kamu!"
        />
        <meta property="og:site_name" content="tesKoran.id" />
        <meta property="og:url" content="https://teskoran.id" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
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
