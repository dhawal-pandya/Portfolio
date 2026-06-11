import { useEffect } from "react";
import { getScale } from "./clock";

// One requestAnimationFrame helper for every canvas on the page.
// Pauses off-screen and in hidden tabs. Honors reduced motion by drawing a
// single still frame. Hands the draw function a clock-scaled delta.
//
// draw(ctx, { w, h, dpr }, dt, t) — dt and t in seconds, already scaled.
export default function useCanvasLoop(canvasRef, draw, deps = []) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let running = false;
    let visible = true;
    let last = 0;
    let t = 0;
    const size = { w: 0, h: 0, dpr: 1 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size.w = rect.width;
      size.h = rect.height;
      size.dpr = dpr;
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const frame = (now) => {
      if (!running) return;
      const rawDt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const dt = rawDt * getScale();
      t += dt;
      draw(ctx, size, dt, t);
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    if (reduced) {
      draw(ctx, size, 0, 0);
    }

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) draw(ctx, size, 0, 0);
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !document.hidden) start();
        else stop();
      },
      { rootMargin: "100px" }
    );
    io.observe(canvas);

    const onVis = () => {
      if (document.hidden) stop();
      else if (visible) start();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
