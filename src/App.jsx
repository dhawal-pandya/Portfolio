import React, { useEffect, useState } from "react";
import Nav from "./components/nav/Nav";
import Hero from "./components/hero/Hero";
import About from "./components/about/About";
import Work from "./components/work/Work";
import Projects from "./components/projects/Projects";
import Verses from "./components/verses/Verses";
import Contact from "./components/contact/Contact";
import Footer from "./components/contact/Footer";
import Cursor from "./components/cursor/Cursor";
import Toast from "./components/shared/Toast";
import Terminal from "./components/secrets/Terminal";
import Kanban from "./components/secrets/Kanban";
import Ash from "./components/secrets/Ash";
import { startSunWatch } from "./lib/theme";
import { windUp, stillness } from "./lib/clock";
import { foundSecret, toast } from "./lib/secrets";
import { quip } from "./lib/quips";

function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const on = () => setHash(window.location.hash);
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return hash;
}

const App = () => {
  const route = useHashRoute();
  const [kanban, setKanban] = useState(false);
  const [still, setStill] = useState(false);

  useEffect(() => startSunWatch(), []);

  // For the ones who open the hood.
  useEffect(() => {
    console.log(
      "%cnamaste.\n%cyou read consoles. of course you do.\nthe key is ` and the word is tathastu.",
      "font-size:14px;font-weight:bold;",
      "font-size:12px;color:#c2540a;"
    );
  }, []);

  // The old cheat, and the typed word.
  useEffect(() => {
    let buf = "";
    const onKey = (e) => {
      const el = document.activeElement;
      const typing = el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA");

      if (!typing && /^[a-z]$/i.test(e.key)) {
        buf = (buf + e.key.toLowerCase()).slice(-7);
        if (buf.endsWith("hesoyam")) {
          buf = "";
          windUp(10, 10000);
          window.dispatchEvent(new CustomEvent("kc-globe-spin"));
          foundSecret("hesoyam");
          toast("the wheel turns faster for no one. not even CJ.");
        }
        if (buf.endsWith("sakshi")) {
          buf = "";
          foundSecret("stillness");
          stillness(5000);
          setStill(true);
          setTimeout(() => setStill(false), 5000);
        }
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        quip("save");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // The page notices the out-of-ordinary.
  useEffect(() => {
    const onCopy = () => {
      const sel = window.getSelection?.()?.toString() || "";
      if (sel.length > 200) quip("copy");
    };
    let resizes = [];
    const onResize = () => {
      const now = Date.now();
      resizes = [...resizes.filter((t) => now - t < 3000), now];
      if (resizes.length > 8) {
        resizes = [];
        quip("resize");
      }
    };
    let hiddenAt = 0;
    const onVis = () => {
      if (document.hidden) hiddenAt = Date.now();
      else if (hiddenAt && Date.now() - hiddenAt > 5 * 60 * 1000) quip("return");
    };
    let lastMove = Date.now();
    const onActive = () => {
      const now = Date.now();
      if (now - lastMove > 5 * 60 * 1000 && !document.hidden) quip("idle");
      lastMove = now;
    };
    let clicks = [];
    const onClick = (e) => {
      if (e.target.closest?.("a, button, canvas, input, textarea, [role='button']")) return;
      const now = Date.now();
      clicks = [...clicks.filter((t) => now - t < 2000), now];
      if (clicks.length >= 5) {
        clicks = [];
        quip("click");
      }
    };
    const onPrint = () => quip("print");

    document.addEventListener("copy", onCopy);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pointermove", onActive);
    window.addEventListener("click", onClick);
    window.addEventListener("beforeprint", onPrint);
    return () => {
      document.removeEventListener("copy", onCopy);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onActive);
      window.removeEventListener("click", onClick);
      window.removeEventListener("beforeprint", onPrint);
    };
  }, []);

  if (route === "#/ash") return <Ash />;

  return (
    <>
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <About />
        <Work />
        <Projects />
        <Verses />
        <Contact />
      </main>
      <Footer />
      <Terminal onKanban={() => setKanban(true)} />
      <Kanban open={kanban} onClose={() => setKanban(false)} />
      <Toast />
      <div
        aria-hidden={!still}
        className={`pointer-events-none fixed inset-0 z-[95] grid place-items-center transition-opacity duration-700 ${
          still ? "opacity-100" : "opacity-0"
        }`}
        style={{ background: "color-mix(in srgb, var(--bg) 55%, transparent)" }}
      >
        <p className="px-6 text-center font-display text-xl italic text-ink md:text-2xl">
          the one who sees, sees this too.
        </p>
      </div>
    </>
  );
};

export default App;
