import React, { useEffect, useRef } from "react";
import useCanvasLoop from "../../lib/useCanvasLoop";

// A small flock behind the work chapter. Three rules per bird: keep apart,
// fly with the others, stay near them. The cloud they make is not designed,
// it emerges, same as the dragon's ripple. They follow a slow wandering
// waypoint so the whole flock drifts about the section like one mind.

const COUNT = 15;
const GRID = 6; // px per cell, same dialect as everything else
const ALPHA = 0.5;
const NEIGHBOR = 90; // how far a bird looks
const APART = 26; // personal space
const VMIN = 28;
const VMAX = 72;

function simColor() {
  return getComputedStyle(document.documentElement).getPropertyValue("--ink-soft").trim();
}

const Birds = () => {
  const canvasRef = useRef(null);
  const st = useRef({ birds: null, color: "", ph: null });

  useEffect(() => {
    const s = st.current;
    s.color = simColor();
    s.ph = Array.from({ length: 4 }, () => Math.random() * Math.PI * 2);
    const onTheme = () => (s.color = simColor());
    window.addEventListener("kc-theme", onTheme);
    return () => window.removeEventListener("kc-theme", onTheme);
  }, []);

  useCanvasLoop(canvasRef, (ctx, { w, h }, dt, t) => {
    const s = st.current;
    if (!s.ph) return;

    if (!s.birds) {
      s.birds = Array.from({ length: COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 60,
        vy: (Math.random() - 0.5) * 60,
        ph: Math.random() * Math.PI * 2,
      }));
    }

    // The flock's slow shared intention.
    const tx = w * (0.5 + 0.34 * Math.sin(t * 0.05 * 2 * Math.PI + s.ph[0]) + 0.1 * Math.sin(t * 0.021 * 2 * Math.PI + s.ph[1]));
    const ty = h * (0.45 + 0.28 * Math.sin(t * 0.043 * 2 * Math.PI + s.ph[2]) + 0.1 * Math.sin(t * 0.017 * 2 * Math.PI + s.ph[3]));

    for (const b of s.birds) {
      let cx = 0, cy = 0, ax = 0, ay = 0, sx = 0, sy = 0, n = 0;
      for (const o of s.birds) {
        if (o === b) continue;
        const dx = o.x - b.x;
        const dy = o.y - b.y;
        const d = Math.hypot(dx, dy);
        if (d > NEIGHBOR) continue;
        n++;
        cx += o.x;
        cy += o.y;
        ax += o.vx;
        ay += o.vy;
        if (d < APART && d > 0) {
          sx -= dx / d;
          sy -= dy / d;
        }
      }
      if (n) {
        b.vx += ((cx / n - b.x) * 0.6 + (ax / n - b.vx) * 1.4 + sx * 60) * dt;
        b.vy += ((cy / n - b.y) * 0.6 + (ay / n - b.vy) * 1.4 + sy * 60) * dt;
      }
      // the wandering waypoint, gently
      b.vx += (tx - b.x) * 0.12 * dt;
      b.vy += (ty - b.y) * 0.12 * dt;

      const v = Math.hypot(b.vx, b.vy) || 1;
      const clamped = Math.max(VMIN, Math.min(VMAX, v));
      b.vx = (b.vx / v) * clamped;
      b.vy = (b.vy / v) * clamped;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      // soft walls: turn back rather than wrap, flocks do not teleport
      if (b.x < 20) b.vx += 40 * dt * 60 * dt;
      if (b.x > w - 20) b.vx -= 40 * dt * 60 * dt;
      if (b.y < 20) b.vy += 40 * dt * 60 * dt;
      if (b.y > h - 20) b.vy -= 40 * dt * 60 * dt;
    }

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = s.color || simColor();
    ctx.globalAlpha = ALPHA;
    for (const b of s.birds) {
      const gx = Math.round(b.x / GRID) * GRID;
      const gy = Math.round(b.y / GRID) * GRID;
      const v = Math.hypot(b.vx, b.vy) || 1;
      const px = -b.vy / v; // perpendicular to flight
      const py = b.vx / v;
      const flap = Math.sin(t * 7 + b.ph) > 0 ? 1 : 0; // two frames, like all honest pixel birds
      ctx.fillRect(gx - 2, gy - 2, GRID - 2, GRID - 2); // body
      const wx = Math.round(px * GRID);
      const wy = Math.round(py * GRID) - flap * 2;
      ctx.fillRect(gx + wx - 2, gy + wy - 2, GRID - 3, GRID - 3);
      ctx.fillRect(gx - wx - 2, gy - wy - 2, GRID - 3, GRID - 3);
    }
    ctx.globalAlpha = 1;
  });

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
};

export default Birds;
