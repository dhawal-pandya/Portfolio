import React, { useEffect, useRef } from "react";
import useCanvasLoop from "../../lib/useCanvasLoop";

// A long dragon of grid-snapped cells, always aloft behind the hero. The
// head wanders a slow sum-of-sines path that keeps it on stage; every body
// segment simply follows the one ahead of it, which is where the serpentine
// ripple comes from. Same cells as the Life board and the snake. No sprites.

const GRID = 6; // px per body cell
const SEGS = 72; // body length, in segments
const SPACING = 7; // px between segments
const ALPHA = 0.4; // body ink
const HEAD_ALPHA = 0.5; // the head reads darkest
// The wander: three slow sines per axis. Periods are minutes, not seconds.
const FX = [0.036, 0.015, 0.007];
const FY = [0.031, 0.02, 0.009];

function simColor() {
  return getComputedStyle(document.documentElement).getPropertyValue("--sim").trim();
}

const Dragon = () => {
  const canvasRef = useRef(null);
  const st = useRef({ segs: null, color: "", ph: null, globe: null, globeAt: 0, under: true });

  useEffect(() => {
    const s = st.current;
    s.color = simColor();
    s.ph = Array.from({ length: 6 }, () => Math.random() * Math.PI * 2);
    const onTheme = () => (s.color = simColor());
    window.addEventListener("kc-theme", onTheme);
    return () => window.removeEventListener("kc-theme", onTheme);
  }, []);

  useCanvasLoop(canvasRef, (ctx, { w, h }, dt, t) => {
    const s = st.current;
    if (!s.ph) return;

    // Where the head wants to be: a slow wandering loop over the hero.
    const hx =
      w *
      (0.5 +
        0.36 * Math.sin(t * FX[0] * 2 * Math.PI + s.ph[0]) +
        0.1 * Math.sin(t * FX[1] * 2 * Math.PI + s.ph[1]) +
        0.04 * Math.sin(t * FX[2] * 2 * Math.PI + s.ph[2]));
    const hy =
      h *
      (0.5 +
        0.3 * Math.sin(t * FY[0] * 2 * Math.PI + s.ph[3]) +
        0.12 * Math.sin(t * FY[1] * 2 * Math.PI + s.ph[4]) +
        0.05 * Math.sin(t * FY[2] * 2 * Math.PI + s.ph[5]));

    if (!s.segs) {
      s.segs = Array.from({ length: SEGS }, (_, i) => ({ x: hx - i * SPACING, y: hy }));
    }

    // Where the planet stands, in this canvas's coordinates. Checked once a
    // second; the two canvases scroll together so the offset barely moves.
    if (!s.globe || t - s.globeAt > 1) {
      s.globeAt = t;
      const g = document.querySelector("canvas[data-globe]");
      if (g) {
        const gr = g.getBoundingClientRect();
        const or = ctx.canvas.getBoundingClientRect();
        s.globe = {
          x: gr.left + gr.width / 2 - or.left,
          y: gr.top + gr.height / 2 - or.top,
          r: Math.min(gr.width, gr.height) / 2 - 8,
        };
      }
    }

    // Far from the planet, the dragon occasionally changes its mind about
    // which side of it the next pass will take.
    if (s.globe) {
      const dHead = Math.hypot(hx - s.globe.x, hy - s.globe.y);
      if (dHead > s.globe.r + 240 && Math.random() < dt * 0.2) {
        s.under = !s.under;
      }
    }

    // The head goes; the body has no choice.
    s.segs[0].x = hx;
    s.segs[0].y = hy;
    for (let i = 1; i < SEGS; i++) {
      const a = s.segs[i - 1];
      const b = s.segs[i];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.hypot(dx, dy) || 1;
      if (d > SPACING) {
        const pull = (d - SPACING) / d;
        b.x -= dx * pull;
        b.y -= dy * pull;
      }
    }

    ctx.clearRect(0, 0, w, h);

    // Under: everything inside the planet's disc is simply not drawn,
    // which is what "behind" means on a flat screen.
    ctx.save();
    if (s.under && s.globe) {
      ctx.beginPath();
      ctx.rect(0, 0, w, h);
      ctx.arc(s.globe.x, s.globe.y, s.globe.r, 0, Math.PI * 2);
      ctx.clip("evenodd");
    }
    ctx.fillStyle = s.color || simColor();

    const cell = (x, y, size = GRID - 1) => {
      const gx = Math.round(x / GRID) * GRID;
      const gy = Math.round(y / GRID) * GRID;
      ctx.fillRect(gx - size / 2, gy - size / 2, size, size);
    };

    // Body, tapering to a whip of a tail.
    for (let i = SEGS - 1; i >= 1; i--) {
      const taper = i > SEGS - 14 ? GRID - 3 : i < 10 ? GRID : GRID - 1;
      ctx.globalAlpha = ALPHA * (i > SEGS - 14 ? 0.8 : 1);
      cell(s.segs[i].x, s.segs[i].y, taper);
    }

    // One pair of wings at the shoulders: limbs of cells reaching out
    // perpendicular from the spine, beating slowly.
    const legAt = (i, phase) => {
      const a = s.segs[i - 2];
      const b = s.segs[i + 2];
      let tx = a.x - b.x;
      let ty = a.y - b.y;
      const tl = Math.hypot(tx, ty) || 1;
      tx /= tl;
      ty /= tl;
      const nx = -ty;
      const ny = tx;
      const seg = s.segs[i];
      const paddle = Math.sin(t * 1.4 + phase) * 0.5;
      for (const side of [1, -1]) {
        const sw = 1 + side * paddle * 0.4;
        ctx.globalAlpha = ALPHA;
        cell(seg.x + nx * side * GRID * sw, seg.y + ny * side * GRID * sw, GRID - 1);
        cell(
          seg.x + (nx * side * 1.9 * sw - tx * 0.6) * GRID,
          seg.y + (ny * side * 1.9 * sw - ty * 0.6) * GRID,
          GRID - 2
        );
        // the wingtip
        ctx.globalAlpha = ALPHA * 0.85;
        cell(
          seg.x + (nx * side * 2.6 * sw - tx * 1.1) * GRID,
          seg.y + (ny * side * 2.6 * sw - ty * 1.1) * GRID,
          GRID - 4
        );
      }
    };
    legAt(8, 0); // the wings

    // The head: a small cluster, horns, and trailing whiskers.
    const head = s.segs[0];
    const neck = s.segs[1];
    let ux = head.x - neck.x;
    let uy = head.y - neck.y;
    const ul = Math.hypot(ux, uy) || 1;
    ux /= ul;
    uy /= ul;
    const px = -uy; // perpendicular
    const py = ux;

    ctx.globalAlpha = HEAD_ALPHA;
    cell(head.x, head.y, GRID + 3);
    cell(head.x + px * GRID * 0.8, head.y + py * GRID * 0.8, GRID); // jowl
    cell(head.x - px * GRID * 0.8, head.y - py * GRID * 0.8, GRID); // jowl
    cell(head.x + ux * GRID, head.y + uy * GRID, GRID); // snout
    cell(head.x + (ux * 1.8 + px * 0.3) * GRID, head.y + (uy * 1.8 + py * 0.3) * GRID, GRID - 3); // nose
    cell(head.x + px * GRID - ux * GRID, head.y + py * GRID - uy * GRID, GRID - 1); // horn
    cell(head.x - px * GRID - ux * GRID, head.y - py * GRID - uy * GRID, GRID - 1); // horn
    ctx.globalAlpha = ALPHA;
    for (let k = 1; k <= 3; k++) {
      // whiskers, trailing and drifting apart
      const wob = Math.sin(t * 2 + k) * 0.6;
      cell(
        head.x + (px * (1 + wob) - ux * (k + 1)) * GRID,
        head.y + (py * (1 + wob) - uy * (k + 1)) * GRID,
        GRID - 4
      );
      cell(
        head.x + (-px * (1 + wob) - ux * (k + 1)) * GRID,
        head.y + (-py * (1 + wob) - uy * (k + 1)) * GRID,
        GRID - 4
      );
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  });

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-[2] h-full w-full"
      aria-hidden="true"
    />
  );
};

export default Dragon;
