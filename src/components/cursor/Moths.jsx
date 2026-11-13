import React, { useEffect, useRef } from "react";
import useCanvasLoop from "../../lib/useCanvasLoop";
import { phase } from "../../lib/sun";
import { hasCompany } from "../../lib/company";

// The ember draws company, depending on the hour of the visitor's sky.
// At dusk and dawn, fireflies: round, lazy, wandering near it, flaring
// between ember and grey. At night, moths: square, dark, erratic, circling
// it close. In the day, nothing; the ember is just an ember. Leave the
// pointer still and they lose interest. Move it, and they come back.
// Most visits none of this happens at all (lib/company.js): they are rare,
// and the dp wheel in the nav calls them or sends them away.

const MOTHS = 3;
const FLIES = 6;
const G = 4; // px per moth cell, a finer grain than the birds
const BORED = 6; // seconds of a still pointer before they drift off
const STEP = 1 / 60; // integrate in small steps, so a wound-up clock stays sane

function cssColor(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

const rand = (a, b) => a + Math.random() * (b - a);

function spawn(kind, w, h, px, py) {
  const home = px == null ? [rand(0.2, 0.8) * w, rand(0.2, 0.8) * h] : [px, py];
  const n = kind === "moth" ? MOTHS : FLIES;
  return Array.from({ length: n }, () => {
    // arrive from somewhere off to the side, not out of thin air
    const a = rand(0, Math.PI * 2);
    const d = kind === "moth" ? rand(250, 450) : rand(150, 300);
    return {
      x: home[0] + Math.cos(a) * d,
      y: home[1] + Math.sin(a) * d,
      vx: 0,
      vy: 0,
      a: rand(0, Math.PI * 2), // orbit angle around the ember
      w: (Math.random() < 0.5 ? -1 : 1) * (kind === "moth" ? rand(2.5, 4.5) : rand(0.2, 0.5)),
      r: kind === "moth" ? rand(14, 32) : rand(45, 140), // orbit radius
      ph: rand(0, Math.PI * 2),
      period: rand(2.5, 5), // fireflies: seconds between flares
      wx: 0, // a wandering point for when they are bored
      wy: 0,
      wt: 0,
    };
  });
}

const Moths = () => {
  const canvasRef = useRef(null);
  const st = useRef({
    kind: null,
    checkedAt: 0,
    flock: [],
    px: null,
    py: null,
    movedAt: 0,
    colors: null,
  });

  useEffect(() => {
    const s = st.current;
    const onMove = (e) => {
      s.px = e.clientX;
      s.py = e.clientY;
      s.movedAt = performance.now();
    };
    const load = () => {
      s.colors = { moth: cssColor("--moth"), ember: cssColor("--accent") };
    };
    load();
    window.addEventListener("pointermove", onMove);
    window.addEventListener("kc-theme", load);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("kc-theme", load);
    };
  }, []);

  useCanvasLoop(canvasRef, (ctx, { w, h }, dt, t) => {
    const s = st.current;

    // Ask the sky every half minute who should be out, and at once when
    // the wheel calls them or sends them off.
    const nowMs = performance.now();
    if (!s.kind || nowMs - s.checkedAt > 30000 || s.company !== hasCompany()) {
      s.checkedAt = nowMs;
      s.company = hasCompany();
      const p = phase();
      const kind = !s.company
        ? "none"
        : p === "night"
          ? "moth"
          : p === "dawn" || p === "dusk"
            ? "fly"
            : "none";
      if (kind !== s.kind) {
        s.kind = kind;
        s.flock = kind === "none" ? [] : spawn(kind, w, h, s.px, s.py);
      }
    }

    ctx.clearRect(0, 0, w, h);
    if (!s.flock.length || !s.colors) return;

    const moth = s.kind === "moth";
    const keen = s.px != null && (nowMs - s.movedAt) / 1000 < BORED;

    for (let left = dt; left > 1e-6; left -= STEP) {
      const d = Math.min(STEP, left);
      for (const b of s.flock) {
        let tx, ty;
        if (keen) {
          // circle the ember
          if (moth && Math.random() < d * 0.5) b.w = -b.w; // moths change their minds
          b.a += b.w * d;
          const r = b.r + (moth ? 8 : 25) * Math.sin(t * (moth ? 1.7 : 0.4) + b.ph);
          tx = s.px + Math.cos(b.a) * r;
          ty = s.py + Math.sin(b.a) * r * (moth ? 1 : 0.7);
        } else {
          // bored: drift between wandering points near where the ember was
          b.wt -= d;
          if (b.wt <= 0) {
            const cx = s.px ?? w / 2;
            const cy = s.py ?? h / 2;
            const spread = moth ? 260 : 200;
            b.wx = Math.min(w - 20, Math.max(20, cx + rand(-spread, spread)));
            b.wy = Math.min(h - 20, Math.max(20, cy + rand(-spread, spread)));
            b.wt = rand(2, 5);
          }
          tx = b.wx;
          ty = b.wy;
        }
        // a spring toward the target, some drag, and a moth's flutter
        const k = moth ? 30 : 2.5;
        const drag = moth ? 6 : 1.8;
        let ax = (tx - b.x) * k - b.vx * drag;
        let ay = (ty - b.y) * k - b.vy * drag;
        if (moth) {
          ax += rand(-900, 900);
          ay += rand(-900, 900);
        } else {
          ax += Math.sin(t * 1.3 + b.ph) * 12;
          ay += Math.cos(t * 0.9 + b.ph) * 12;
        }
        b.vx += ax * d;
        b.vy += ay * d;
        const v = Math.hypot(b.vx, b.vy);
        const vmax = moth ? 420 : 90;
        if (v > vmax) {
          b.vx *= vmax / v;
          b.vy *= vmax / v;
        }
        b.x += b.vx * d;
        b.y += b.vy * d;
      }
    }

    if (moth) {
      // square ink, two-frame wings beating fast, like all honest pixel moths.
      // Cells are placed in the moth's own frame (forward, side) and each
      // snapped to the grid, the same way the dragon is drawn.
      ctx.fillStyle = s.colors.moth;
      ctx.globalAlpha = 0.9;
      const cell = (x, y, size) => {
        const gx = Math.round(x / 2) * 2;
        const gy = Math.round(y / 2) * 2;
        ctx.fillRect(gx - size / 2, gy - size / 2, size, size);
      };
      for (const b of s.flock) {
        // a heading that turns smoothly, though the flight itself does not
        const v = Math.hypot(b.vx, b.vy) || 1;
        b.hx = (b.hx ?? b.vx / v) + (b.vx / v - (b.hx ?? 0)) * 0.15;
        b.hy = (b.hy ?? b.vy / v) + (b.vy / v - (b.hy ?? 0)) * 0.15;
        const hl = Math.hypot(b.hx, b.hy) || 1;
        const fx = b.hx / hl;
        const fy = b.hy / hl;
        const at = (f, sd) => [b.x + (fx * f - fy * sd) * G, b.y + (fy * f + fx * sd) * G];
        const open = Math.sin(t * 34 + b.ph) > 0;
        cell(...at(0, 0), G); // thorax
        cell(...at(-1, 0), G - 1); // abdomen
        for (const sd of [1, -1]) {
          if (open) {
            cell(...at(-0.1, sd), G); // forewing, swept back
            cell(...at(-0.7, sd * 1.9), G - 1);
            cell(...at(-1.5, sd * 1.4), G - 1); // hindwing
          } else {
            cell(...at(-0.6, sd * 0.8), G - 1);
          }
        }
      }
    } else {
      // round: each one a small grey body that flares to ember now and then
      for (const b of s.flock) {
        const glow = Math.pow(Math.max(0, Math.sin((2 * Math.PI * t) / b.period + b.ph)), 3);
        ctx.globalAlpha = 0.75;
        ctx.fillStyle = s.colors.moth;
        ctx.beginPath();
        ctx.arc(b.x, b.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
        if (glow > 0.01) {
          ctx.fillStyle = s.colors.ember;
          ctx.globalAlpha = 0.18 * glow;
          ctx.beginPath();
          ctx.arc(b.x, b.y, 2 + 6 * glow, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = glow;
          ctx.beginPath();
          ctx.arc(b.x, b.y, 2.1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.globalAlpha = 1;
  });

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[99] h-full w-full"
      aria-hidden="true"
    />
  );
};

export default Moths;
