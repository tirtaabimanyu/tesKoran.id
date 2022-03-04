import { useState } from "react";
import "../styles/globals.css";
import Layout from "../components/layout.js";

function MyApp({ Component, pageProps }) {
  const [hideLayout, setHideLayout] = useState(false);
  const titleClickHandler = { click: () => {} };

  return (
    <Layout {...{ hide: hideLayout, titleClickHandler }}>
      <Component
        {...pageProps}
        setHideLayout={setHideLayout}
        titleClickHandler={titleClickHandler}
      />
    </Layout>
  );
}

export default MyApp;
