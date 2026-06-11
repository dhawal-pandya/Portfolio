import React, { useEffect, useRef } from "react";
import useCanvasLoop from "../../lib/useCanvasLoop";

// Conway's Game of Life, faint, behind the projects. Four rules, no players.
// Moving the pointer over the section births cells. None of this is explained.

const CELL = 18;
const TICK = 0.15;

const GUN = [
  [5, 1], [5, 2], [6, 1], [6, 2], [5, 11], [6, 11], [7, 11], [4, 12], [8, 12],
  [3, 13], [9, 13], [3, 14], [9, 14], [6, 15], [4, 16], [8, 16], [5, 17],
  [6, 17], [7, 17], [6, 18], [3, 21], [4, 21], [5, 21], [3, 22], [4, 22],
  [5, 22], [2, 23], [6, 23], [1, 25], [2, 25], [6, 25], [7, 25], [3, 35],
  [4, 35], [3, 36], [4, 36],
];

function simColor() {
  return getComputedStyle(document.documentElement).getPropertyValue("--sim").trim();
}

const GameOfLife = () => {
  const canvasRef = useRef(null);
  const st = useRef({ grid: null, cols: 0, rows: 0, acc: 0, color: "" });

  const seed = (cols, rows) => {
    const g = new Uint8Array(cols * rows);
    for (let i = 0; i < g.length; i++) g[i] = Math.random() < 0.1 ? 1 : 0;
    for (const [r, c] of GUN) {
      if (r + 2 < rows && c + 2 < cols) g[(r + 2) * cols + (c + 2)] = 1;
    }
    return g;
  };

  useEffect(() => {
    const s = st.current;
    s.color = simColor();
    const onTheme = () => (s.color = simColor());
    const onReseed = () => {
      if (s.cols) s.grid = seed(s.cols, s.rows);
    };
    window.addEventListener("kc-theme", onTheme);
    window.addEventListener("kc-life-reseed", onReseed);

    // Births under the pointer, listening on the section behind us.
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const onMove = (e) => {
      if (!s.grid) return;
      const rect = canvas.getBoundingClientRect();
      const c = Math.floor((e.clientX - rect.left) / CELL);
      const r = Math.floor((e.clientY - rect.top) / CELL);
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          if (Math.random() < 0.4) continue;
          const rr = r + dr;
          const cc = c + dc;
          if (rr >= 0 && rr < s.rows && cc >= 0 && cc < s.cols)
            s.grid[rr * s.cols + cc] = 1;
        }
    };
    host?.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("kc-theme", onTheme);
      window.removeEventListener("kc-life-reseed", onReseed);
      host?.removeEventListener("pointermove", onMove);
    };
  }, []);

  useCanvasLoop(canvasRef, (ctx, { w, h }, dt) => {
    const s = st.current;
    const cols = Math.ceil(w / CELL);
    const rows = Math.ceil(h / CELL);
    if (cols !== s.cols || rows !== s.rows || !s.grid) {
      s.cols = cols;
      s.rows = rows;
      s.grid = seed(cols, rows);
    }

    s.acc += dt;
    while (s.acc >= TICK) {
      s.acc -= TICK;
      const g = s.grid;
      const next = new Uint8Array(g.length);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let n = 0;
          for (let dr = -1; dr <= 1; dr++)
            for (let dc = -1; dc <= 1; dc++) {
              if (!dr && !dc) continue;
              const rr = (r + dr + rows) % rows;
              const cc = (c + dc + cols) % cols;
              n += g[rr * cols + cc];
            }
          const i = r * cols + c;
          next[i] = g[i] ? (n === 2 || n === 3 ? 1 : 0) : n === 3 ? 1 : 0;
        }
      }
      s.grid = next;
    }

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = s.color || simColor();
    const g = s.grid;
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        if (g[r * cols + c]) ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2);
  });

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
};

export default GameOfLife;
