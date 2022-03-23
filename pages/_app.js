import { useState } from "react";
// import { useRouter } from "next/router";
import "../styles/globals.css";
import Layout from "../components/layout.js";
import { SwitchTransition, CSSTransition } from "react-transition-group";

function MyApp({ Component, pageProps, router }) {
  const [hideLayout, setHideLayout] = useState(false);
  const titleClickHandler = { click: () => {} };

  return (
    <Layout {...{ hide: hideLayout, titleClickHandler }}>
      <SwitchTransition mode="out-in">
        <CSSTransition key={router.pathname} classNames="fade" timeout={100}>
          <Component
            {...pageProps}
            setHideLayout={setHideLayout}
            titleClickHandler={titleClickHandler}
          />
        </CSSTransition>
      </SwitchTransition>
    </Layout>
  );
}

export default MyApp;
