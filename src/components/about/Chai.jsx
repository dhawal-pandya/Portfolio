import React, { useEffect, useRef } from "react";
import useCanvasLoop from "../../lib/useCanvasLoop";

// A small cup of chai on a saucer, bottom-right of the about chapter, with
// wisps of steam rising and dissolving. The cup never moves. The steam
// never stops. Same pixel cells as everything else alive on this page.

const G = 5; // px per cell
const ALPHA = 0.7;

// Cup, saucer, handle — as [col, row] cells, row 0 at the rim.
const CUP = [
  // rim
  [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0],
  // body
  [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1],
  [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2],
  [2, 3], [3, 3], [4, 3], [5, 3],
  // handle
  [8, 1], [9, 1], [9, 2], [8, 3],
  // saucer
  [-1, 4], [0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4], [8, 4],
  [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5],
];

function cssColor(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

const Chai = () => {
  const canvasRef = useRef(null);
  const st = useRef({ wisps: [], acc: 0, colors: null });

  useEffect(() => {
    const load = () => {
      st.current.colors = {
        sim: cssColor("--ink-soft"),
        soft: cssColor("--ink-soft"),
      };
    };
    load();
    window.addEventListener("kc-theme", load);
    return () => window.removeEventListener("kc-theme", load);
  }, []);

  useCanvasLoop(canvasRef, (ctx, { w, h }, dt, t) => {
    const s = st.current;
    if (!s.colors) return;

    // Desktop: low and to the left. Mobile (single column): bottom-right.
    const mobile = w < 768;
    const baseX = mobile ? w - 110 : 70;
    const baseY = h - 64;

    // Steam: born just above the tea, rising, swaying, thinning to nothing.
    s.acc += dt;
    while (s.acc >= 0.5) {
      s.acc -= 0.5;
      s.wisps.push({
        x: baseX + (1 + Math.random() * 5) * G,
        y: baseY - G,
        ph: Math.random() * Math.PI * 2,
        life: 0,
        span: 3.5 + Math.random() * 2,
      });
    }
    s.wisps = s.wisps.filter((p) => {
      p.life += dt;
      p.y -= (14 + 4 * Math.sin(p.ph)) * dt;
      return p.life < p.span;
    });

    ctx.clearRect(0, 0, w, h);

    // the cup
    ctx.fillStyle = s.colors.sim;
    ctx.globalAlpha = ALPHA;
    for (const [c, r] of CUP) ctx.fillRect(baseX + c * G, baseY + r * G, G - 1, G - 1);
    ctx.globalAlpha = 1;

    // the steam
    ctx.fillStyle = s.colors.soft;
    for (const p of s.wisps) {
      const k = p.life / p.span; // 0 young, 1 gone
      const sway = Math.sin(t * 1.2 + p.ph + p.life * 1.5) * G * (1 + k * 2);
      const gx = Math.round((p.x + sway) / G) * G;
      const gy = Math.round(p.y / G) * G;
      ctx.globalAlpha = 0.35 * (1 - k);
      const size = k < 0.5 ? G - 2 : G - 3;
      ctx.fillRect(gx, gy, size, size);
    }
    ctx.globalAlpha = 1;
  });

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full md:hidden"
      aria-hidden="true"
    />
  );
};

export default Chai;
