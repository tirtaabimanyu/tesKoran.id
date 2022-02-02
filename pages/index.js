import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import styles from "../styles/Home.module.css";

export async function getServerSideProps() {
  return {
    props: {
      numbers: [
        -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
      ],
    },
  };
}

export default function Home({ numbers }) {
  const [active, _setActive] = useState(4);

  const activeRef = useRef(active);
  function setActive(value) {
    activeRef.current = value;
    _setActive(value);
  }

  useEffect(() => {
    console.log("used");
    window.addEventListener("keydown", (e) => keyDown(e));
    return () => {
      console.log("cleaned");
      window.removeEventListener("keydown", (e) => keyDown(e));
    };
  }, []);

  function keyDown(e) {
    setActive(activeRef.current + 1);
    console.log(e, active, activeRef.current);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.mask}>
          <div className={styles.numbers}>
            {numbers.map((element, idx) => {
              return (
                Math.abs(active - idx) < 5 && (
                  <div style={{ display: "inline-block" }}>
                    <h1 key={idx}>{element < 0 ? "*" : element}</h1>
                  </div>
                )
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
