import { useState } from "react";
import "../styles/globals.css";
import Layout from "../components/layout.js";

function MyApp({ Component, pageProps }) {
  const [hideLayout, setHideLayout] = useState(false);

  return (
    <Layout hide={hideLayout}>
      <Component {...pageProps} setHideLayout={setHideLayout} />
    </Layout>
  );
}

export default MyApp;
