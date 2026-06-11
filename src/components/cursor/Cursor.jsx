import React, { useEffect, useRef } from "react";

// A small ember dot and a slow ring. Precise pointers only; phones are spared.
const Cursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    document.body.dataset.cursorOn = "true";
    const dot = dotRef.current;
    const ring = ringRef.current;
    let x = -100, y = -100, rx = -100, ry = -100, hot = false;
    let raf = 0;

    const onMove = (e) => {
      x = e.clientX;
      y = e.clientY;
      hot = !!e.target.closest?.("a, button, [role='button'], canvas");
    };
    const frame = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      dot.style.transform = `translate(${x - 3}px, ${y - 3}px)`;
      const sc = hot ? 1.6 : 1;
      ring.style.transform = `translate(${rx - 14}px, ${ry - 14}px) scale(${sc})`;
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
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-[6px] w-[6px] rounded-full bg-accent md:block"
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-[28px] w-[28px] rounded-full border opacity-40 transition-transform duration-75 md:block"
        style={{ borderColor: "var(--ink-soft)" }}
      />
    </>
  );
};

export default Cursor;
