import { useState, useEffect, useRef } from "react";
import "../styles/globals.css";
import Layout from "../components/layout.js";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import useFoucFix from "../utils/useFoucFix";

function Numberplus({ Component, pageProps, router }) {
  const [hideLayout, setHideLayout] = useState(false);
  const titleClickHandler = { click: () => {} };

  useFoucFix();

  const nodeRef = useRef(null);

  return (
    <Layout {...{ hide: hideLayout, titleClickHandler }}>
      <SwitchTransition mode="out-in">
        <CSSTransition
          nodeRef={nodeRef}
          key={router.pathname}
          classNames="fade"
          timeout={100}
        >
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

export default Numberplus;
