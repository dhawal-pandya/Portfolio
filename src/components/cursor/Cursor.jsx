import React, { useEffect, useRef, useState } from "react";
import Moths from "./Moths";

// A small ember, and nothing else. Over anything you can press it swells a
// little. At dusk and dawn fireflies keep it company, at night the moths
// find it. Precise pointers only; phones are spared.
const SWELL = 1.8; // the ember's size over a clickable thing

const Cursor = () => {
  const dotRef = useRef(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    setOn(true);
    document.body.dataset.cursorOn = "true";
    const dot = dotRef.current;
    let x = -100, y = -100, hot = false, sc = 1;
    let raf = 0;

    const onMove = (e) => {
      x = e.clientX;
      y = e.clientY;
      hot = !!e.target.closest?.("a, button, [role='button'], canvas");
    };
    const frame = () => {
      sc += ((hot ? SWELL : 1) - sc) * 0.2;
      dot.style.transform = `translate(${x - 3}px, ${y - 3}px) scale(${sc.toFixed(3)})`;
      raf = requestAnimationFrame(frame);
    };
    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(frame);
    return () => {
      delete document.body.dataset.cursorOn;
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {on && <Moths />}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-[6px] w-[6px] rounded-full bg-accent md:block"
      />
    </>
  );
};

export default Cursor;
