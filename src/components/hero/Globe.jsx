import React, { useEffect, useRef } from "react";
import useCanvasLoop from "../../lib/useCanvasLoop";
import { sunVector } from "../../lib/sun";
import { quip } from "../../lib/quips";
import LAND from "../../data/globe-points.json";

// A dotted earth on a 2D canvas. The dots are land. The shading is the actual
// sun: night-side dots go dim, the terminator carries one warm ring of ember.
// Drag spins it. It spins anyway.

const MARKERS = [
  { lat: 20.61, lon: 72.93 }, // Valsad — here, right now
];

const D2R = Math.PI / 180;

function toVec(lat, lon) {
  const p = lat * D2R;
  const l = lon * D2R;
  return [Math.cos(p) * Math.cos(l), Math.sin(p), Math.cos(p) * Math.sin(l)];
}

const POINTS = LAND.map(([lat, lon]) => toVec(lat, lon));
const MARKER_VECS = MARKERS.map((m) => toVec(m.lat, m.lon));

function cssColor(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

const Globe = ({ className = "" }) => {
  const canvasRef = useRef(null);
  const st = useRef({
    theta: -0.26, // wake up facing home
    vel: 0,
    dragging: false,
    lastX: 0,
    lastT: 0,
    target: null,
    sun: sunVector(),
    sunAt: Date.now(),
    colors: null,
  });

  // Re-read theme colors when the sky changes.
  useEffect(() => {
    const load = () => {
      st.current.colors = {
        ink: cssColor("--ink"),
        soft: cssColor("--ink-soft"),
        accent: cssColor("--accent"),
        line: cssColor("--line"),
        bg: cssColor("--bg"),
      };
    };
    load();
    window.addEventListener("kc-theme", load);
    return () => window.removeEventListener("kc-theme", load);
  }, []);

  // The terminal asks the globe to face somewhere that mattered.
  useEffect(() => {
    const onSpin = (e) => {
      const i = e.detail?.index ?? Math.floor(Math.random() * MARKERS.length);
      // Front-center is where lon - theta = 90deg in view space.
      st.current.target = MARKERS[i].lon * D2R - Math.PI / 2;
    };
    window.addEventListener("kc-globe-spin", onSpin);
    return () => window.removeEventListener("kc-globe-spin", onSpin);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const s = st.current;
    const down = (e) => {
      s.dragging = true;
      s.lastX = e.clientX;
      s.lastT = performance.now();
      s.target = null;
      canvas.setPointerCapture?.(e.pointerId);
    };
    let fastSpins = [];
    const move = (e) => {
      if (!s.dragging) return;
      const dx = e.clientX - s.lastX;
      const dt = Math.max(performance.now() - s.lastT, 1);
      s.lastX = e.clientX;
      s.lastT = performance.now();
      s.theta -= dx * 0.006;
      s.vel = -(dx / dt) * 6;
      // one violent spin is enthusiasm. several in a row earns a word.
      if (Math.abs(s.vel) > 4) {
        const now = Date.now();
        if (!fastSpins.length || now - fastSpins[fastSpins.length - 1] > 800) {
          fastSpins = [...fastSpins.filter((t) => now - t < 8000), now];
          if (fastSpins.length >= 3) {
            fastSpins = [];
            quip("globe");
          }
        }
      }
    };
    const up = () => {
      s.dragging = false;
    };
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    return () => {
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
    };
  }, []);

  useCanvasLoop(canvasRef, (ctx, { w, h }, dt, t) => {
    const s = st.current;
    if (!s.colors) return;
    ctx.clearRect(0, 0, w, h);

    // Refresh the sun about once a minute.
    if (Date.now() - s.sunAt > 60000) {
      s.sun = sunVector();
      s.sunAt = Date.now();
    }

    // Motion: gentle constant turn + drag inertia + optional easing to target.
    if (s.target != null) {
      let diff = s.target - s.theta;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      s.theta += diff * Math.min(1, dt * 3);
      if (Math.abs(diff) < 0.01) s.target = null;
    } else if (!s.dragging) {
      // west to east, the way the ground actually moves
      s.theta += s.vel * dt - dt * 0.1;
      s.vel *= Math.pow(0.4, dt);
    }

    const R = Math.min(w, h) / 2 - 8;
    const cx = w / 2;
    const cy = h / 2;
    // Side view: equatorial belt runs straight across. Earth's 23.5° axial tilt
    // is applied as a 2D in-plane rotation so the pole tilts right on screen.
    const AX = 23.5 * D2R;
    const cosT = Math.cos(s.theta);
    const sinT = Math.sin(s.theta);
    const cosA = Math.cos(AX);
    const sinA = Math.sin(AX);
    const [sx, sy, sz] = s.sun;

    // The planet is solid: an opaque disc in the page's own color, invisible
    // against the page but a true wall to whatever flies behind it.
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = s.colors.bg;
    ctx.fill();
    ctx.strokeStyle = s.colors.line;
    ctx.lineWidth = 1;
    ctx.stroke();

    const dotR = Math.max(R * 0.0085, 0.8);
    for (let i = 0; i < POINTS.length; i++) {
      const [x, y, z] = POINTS[i];
      const x1 = x * cosT + z * sinT;
      const z1 = -x * sinT + z * cosT;
      // tilt = 0: equatorial side view. Cull back hemisphere on z1.
      if (z1 <= 0.02) continue;
      // In-plane axial tilt: clockwise 23.5° so north pole tips right.
      const xa = x1 * cosA + y * sinA;
      const ya = -x1 * sinA + y * cosA;
      const lit = x * sx + y * sy + z * sz; // earth-fixed daylight
      const px = cx - xa * R;
      const py = cy - ya * R;
      const depth = 0.45 + 0.55 * z1;
      if (Math.abs(lit) < 0.06) {
        // the terminator itself, one warm thread
        ctx.globalAlpha = 0.85 * depth;
        ctx.fillStyle = s.colors.accent;
      } else if (lit > 0) {
        ctx.globalAlpha = 0.75 * depth;
        ctx.fillStyle = s.colors.ink;
      } else {
        ctx.globalAlpha = 0.22 * depth;
        ctx.fillStyle = s.colors.soft;
      }
      ctx.beginPath();
      ctx.arc(px, py, dotR * (0.7 + 0.5 * z1), 0, Math.PI * 2);
      ctx.fill();
    }

    // Markers: where things happened.
    for (let i = 0; i < MARKER_VECS.length; i++) {
      const [x, y, z] = MARKER_VECS[i];
      const x1 = x * cosT + z * sinT;
      const z1 = -x * sinT + z * cosT;
      if (z1 <= 0) continue;
      const xa = x1 * cosA + y * sinA;
      const ya = -x1 * sinA + y * cosA;
      const px = cx - xa * R;
      const py = cy - ya * R;
      ctx.globalAlpha = 0.95;
      ctx.fillStyle = s.colors.accent;
      ctx.beginPath();
      ctx.arc(px, py, dotR * 2, 0, Math.PI * 2);
      ctx.fill();
      const pulse = ((t * 0.7 + i * 0.4) % 1.6) / 1.6;
      ctx.globalAlpha = (1 - pulse) * 0.5;
      ctx.strokeStyle = s.colors.accent;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(px, py, dotR * 2 + pulse * dotR * 7, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  });

  return (
    <canvas
      ref={canvasRef}
      data-globe="1"
      className={`block h-full w-full touch-none ${className}`}
      style={{ cursor: "grab" }}
      aria-label="a dotted globe, lit by the actual sun, draggable"
      role="img"
    />
  );
};

export default Globe;
