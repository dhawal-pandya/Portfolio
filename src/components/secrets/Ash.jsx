import React, { useEffect, useRef, useState } from "react";
import useCanvasLoop from "../../lib/useCanvasLoop";

// No words. Ash falls from a fire you never see. Stillness thickens the
// fall; your hand is only wind. Clicks drop embers that land grey like
// everything else. The pile remembers you across visits, and when it grows
// too tall the page breathes out once and begins again.

const COL = 4; // px per pile column
const PILE_KEY = "kc-ash-pile";
const CYCLE_KEY = "kc-ash-cycles";

function cssColor(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function loadPile(cols, h) {
  try {
    const saved = JSON.parse(localStorage.getItem(PILE_KEY) || "null");
    if (!saved || !Array.isArray(saved.pile) || !saved.pile.length) return new Array(cols).fill(0);
    // resample the remembered dune onto this viewport
    const out = new Array(cols);
    for (let c = 0; c < cols; c++) {
      const src = Math.min(saved.pile.length - 1, Math.round((c / cols) * saved.pile.length));
      out[c] = Math.min(saved.pile[src] || 0, h * 0.66);
    }
    return out;
  } catch {
    return new Array(cols).fill(0);
  }
}

const Ash = () => {
  const canvasRef = useRef(null);
  // The words stay ten seconds. Then only the ash remains.
  const [words, setWords] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setWords(false), 10000);
    return () => clearTimeout(t);
  }, []);
  const st = useRef({
    flakes: [],
    pile: [],
    cols: 0,
    h: 0,
    spawnAcc: 0,
    activity: 0, // recent pointer restlessness, decays
    lastInput: Date.now(),
    px: -1e4,
    py: -1e4,
    pvx: 0,
    pvy: 0,
    colors: null,
  });

  // Theme colors, refreshed if the sky changes.
  useEffect(() => {
    const load = () => {
      st.current.colors = {
        soft: cssColor("--ink-soft"),
        accent: cssColor("--accent"),
      };
    };
    load();
    window.addEventListener("kc-theme", load);
    return () => window.removeEventListener("kc-theme", load);
  }, []);

  // Pointer is wind. Click is an ember. Esc is the way back. Any input
  // counts as not-being-still.
  useEffect(() => {
    const s = st.current;
    let lastX = 0;
    let lastY = 0;
    let lastT = 0;
    const onMove = (e) => {
      const now = performance.now();
      if (lastT) {
        const dt = Math.max(now - lastT, 1) / 1000;
        s.pvx = (e.clientX - lastX) / dt;
        s.pvy = (e.clientY - lastY) / dt;
        s.activity += Math.hypot(e.clientX - lastX, e.clientY - lastY);
      }
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = now;
      s.px = e.clientX;
      s.py = e.clientY;
      s.lastInput = Date.now();
    };
    const onClick = (e) => {
      s.lastInput = Date.now();
      s.flakes.push({
        x: e.clientX,
        y: e.clientY,
        vx: (Math.random() - 0.5) * 30,
        vy: 120 + Math.random() * 60,
        r: 2.2,
        wf: 2 + Math.random() * 2,
        ph: Math.random() * Math.PI * 2,
        heat: 1, // an ember, briefly
        a: 1,
      });
    };
    const onKey = (e) => {
      s.lastInput = Date.now();
      if (e.key === "Escape") window.location.hash = "";
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  // The pile persists. Saved every few seconds and on the way out.
  useEffect(() => {
    const save = () => {
      const s = st.current;
      if (!s.pile.length) return;
      try {
        localStorage.setItem(
          PILE_KEY,
          JSON.stringify({ pile: s.pile.map((v) => Math.round(v * 10) / 10) })
        );
      } catch {}
    };
    const iv = setInterval(save, 5000);
    window.addEventListener("pagehide", save);
    return () => {
      clearInterval(iv);
      window.removeEventListener("pagehide", save);
      save();
    };
  }, []);

  useCanvasLoop(canvasRef, (ctx, { w, h }, dt, t) => {
    const s = st.current;
    if (!s.colors) return;

    const cols = Math.max(1, Math.ceil(w / COL));
    if (cols !== s.cols || h !== s.h) {
      s.pile = s.pile.length ? loadPileFrom(s.pile, cols, h) : loadPile(cols, h);
      s.cols = cols;
      s.h = h;
    }

    // Restlessness decays; the wind dies down when the hand does.
    s.activity *= Math.pow(0.25, dt);
    s.pvx *= Math.pow(0.05, dt);
    s.pvy *= Math.pow(0.05, dt);

    // Calm thickens the fall, and the longer the stillness holds, the
    // heavier it gets, up to a ceiling. Motion knocks it back down.
    const calm = 1 - Math.min(1, s.activity / 800);
    const idle = (Date.now() - s.lastInput) / 1000;
    const ramp = Math.min(1, idle / 120); // two still minutes reach the ceiling
    const rate = 1.5 + calm * (6 + 30 * ramp * ramp);

    s.spawnAcc += rate * dt;
    if (s.flakes.length > 700) s.spawnAcc = 0; // the air holds only so much
    while (s.spawnAcc >= 1) {
      s.spawnAcc -= 1;
      s.flakes.push({
        x: Math.random() * w,
        y: -6,
        vx: 0,
        vy: 16 + Math.random() * 26,
        r: 0.8 + Math.random() * 1.6,
        wf: 0.5 + Math.random() * 1.5,
        ph: Math.random() * Math.PI * 2,
        heat: 0,
        a: 0.5 + Math.random() * 0.4,
      });
    }

    // A fast hand over the dune lifts the settled top back into the air.
    const speed = Math.hypot(s.pvx, s.pvy);
    if (speed > 500) {
      const c0 = Math.max(0, Math.floor((s.px - 90) / COL));
      const c1 = Math.min(cols - 1, Math.ceil((s.px + 90) / COL));
      for (let c = c0; c <= c1; c++) {
        const surf = h - s.pile[c];
        if (s.pile[c] > 1 && Math.abs(s.py - surf) < 60) {
          const take = Math.min(s.pile[c], 1.4);
          s.pile[c] -= take;
          if (Math.random() < 0.5) {
            s.flakes.push({
              x: c * COL + Math.random() * COL,
              y: surf,
              vx: s.pvx * 0.25 + (Math.random() - 0.5) * 60,
              vy: -60 - Math.random() * 120,
              r: 1 + Math.random() * 1.4,
              wf: 1 + Math.random() * 2,
              ph: Math.random() * Math.PI * 2,
              heat: 0,
              a: 0.7,
            });
          }
        }
      }
    }

    // Move the air.
    const next = [];
    for (const f of s.flakes) {
      if (f.fading) {
        f.a -= dt * 0.7;
        f.x += f.vx * dt;
        f.y += f.vy * dt;
        if (f.a > 0) next.push(f);
        continue;
      }
      // wind from the hand
      const dx = f.x - s.px;
      const dy = f.y - s.py;
      const d = Math.hypot(dx, dy);
      if (d < 140) {
        const k = (1 - d / 140) * dt;
        f.vx += s.pvx * k * 1.6;
        f.vy += s.pvy * k * 0.5;
      }
      f.vx *= Math.pow(0.2, dt);
      f.vy = Math.min(f.vy + 30 * dt, f.heat > 0 ? 240 : 60);
      if (f.heat > 0) f.heat = Math.max(0, f.heat - dt * 0.55);
      f.x += (f.vx + Math.sin(t * f.wf + f.ph) * 9) * dt;
      f.y += f.vy * dt;
      if (f.x < -10) f.x = w + 9;
      if (f.x > w + 10) f.x = -9;

      // settle
      const c = Math.max(0, Math.min(cols - 1, Math.floor(f.x / COL)));
      if (f.y >= h - s.pile[c] - f.r) {
        s.pile[c] = Math.min(s.pile[c] + 0.55 + f.r * 0.2, h);
        continue;
      }
      if (f.y < h + 20) next.push(f);
    }
    s.flakes = next;

    // The dune relaxes; ash holds no edges for long.
    for (let pass = 0; pass < 2; pass++) {
      for (let c = 0; c < cols - 1; c++) {
        const diff = s.pile[c] - s.pile[c + 1];
        if (diff > 5) {
          s.pile[c] -= 0.5;
          s.pile[c + 1] += 0.5;
        } else if (diff < -5) {
          s.pile[c] += 0.5;
          s.pile[c + 1] -= 0.5;
        }
      }
    }

    // When the pile reaches too high, the page breathes out once.
    let max = 0;
    for (let c = 0; c < cols; c++) if (s.pile[c] > max) max = s.pile[c];
    if (max > h * 0.66) {
      for (let c = 0; c < cols; c += 2) {
        const n = Math.min(6, Math.floor(s.pile[c] / 24));
        for (let i = 0; i < n; i++) {
          s.flakes.push({
            x: c * COL,
            y: h - Math.random() * s.pile[c],
            vx: (Math.random() - 0.5) * 160,
            vy: -40 - Math.random() * 200,
            r: 1 + Math.random() * 1.6,
            wf: 1,
            ph: Math.random() * Math.PI * 2,
            heat: 0,
            a: 0.8,
            fading: true,
          });
        }
      }
      s.pile.fill(0);
      try {
        const n = parseInt(localStorage.getItem(CYCLE_KEY) || "0", 10) + 1;
        localStorage.setItem(CYCLE_KEY, String(n));
        localStorage.removeItem(PILE_KEY);
      } catch {}
    }

    // Draw.
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = s.colors.soft;
    ctx.globalAlpha = 0.65;
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let c = 0; c < cols; c++) ctx.lineTo(c * COL + COL / 2, h - s.pile[c]);
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();

    for (const f of s.flakes) {
      ctx.globalAlpha = Math.max(0, Math.min(1, f.a)) * (f.heat > 0 ? 0.95 : 1);
      ctx.fillStyle = f.heat > 0.25 ? s.colors.accent : s.colors.soft;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r + (f.heat > 0.25 ? f.heat : 0), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  });

  return (
    <main className="fixed inset-0 bg-bg">
      <canvas ref={canvasRef} className="block h-full w-full" aria-label="ash" role="img" />
      <div
        aria-hidden={!words}
        className={`pointer-events-none absolute inset-0 grid place-items-center transition-opacity duration-[2000ms] ${
          words ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="px-6 text-center">
          <p className="font-display text-2xl italic leading-relaxed text-ink md:text-3xl">
            it is better to be ashes
            <br />
            than merely dust.
          </p>
          <p className="mt-8 text-xs text-ink-soft">stillness is the answer</p>
        </div>
      </div>
    </main>
  );
};

// Resample an in-memory pile onto a new column count and height.
function loadPileFrom(pile, cols, h) {
  const out = new Array(cols);
  for (let c = 0; c < cols; c++) {
    const src = Math.min(pile.length - 1, Math.round((c / cols) * pile.length));
    out[c] = Math.min(pile[src] || 0, h * 0.66);
  }
  return out;
}

export default Ash;
