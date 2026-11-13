import React, { useEffect, useRef } from "react";

// A small ember dot and a slow ring. The ring is a first impression: it
// lingers a moment, then thins away until only the ember is left. Over
// anything you can press, it comes back. Precise pointers only.
const RING = 0.4; // the ring's full presence
const LINGER = 3; // seconds the ring stays before it starts to go
const RISE = 10; // how quickly it returns over a clickable thing
const FADE = 0.5; // how slowly it leaves; ~6s to all but vanish

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
    let alpha = RING;
    let last = performance.now();
    let lastHot = last; // arriving counts as a reason to show the ring

    const onMove = (e) => {
      x = e.clientX;
      y = e.clientY;
      hot = !!e.target.closest?.("a, button, [role='button'], canvas");
    };
    const frame = (now) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      if (hot) lastHot = now;
      const target = hot || now - lastHot < LINGER * 1000 ? RING : 0;
      const rate = target > alpha ? RISE : FADE;
      alpha += (target - alpha) * (1 - Math.exp(-rate * dt));

      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      dot.style.transform = `translate(${x - 3}px, ${y - 3}px)`;
      const sc = hot ? 1.6 : 1;
      ring.style.transform = `translate(${rx - 14}px, ${ry - 14}px) scale(${sc})`;
      ring.style.opacity = alpha.toFixed(3);
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
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-[28px] w-[28px] rounded-full border transition-transform duration-75 md:block"
        style={{ borderColor: "var(--ink-soft)", opacity: RING }}
      />
    </>
  );
};

export default Cursor;
