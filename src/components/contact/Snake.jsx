import React, { useEffect, useRef } from "react";
import useCanvasLoop from "../../lib/useCanvasLoop";
import { quip } from "../../lib/quips";

// A snake that plays itself behind the contact chapter, slowly. It dies now
// and then. It comes back. The terminal hands you the keys if you find it.

const CELL = 20;
const STEP = 0.13;

function colors() {
  const cs = getComputedStyle(document.documentElement);
  return {
    body: cs.getPropertyValue("--sim").trim(),
    food: cs.getPropertyValue("--accent").trim(),
  };
}

const Snake = () => {
  const canvasRef = useRef(null);
  const st = useRef({
    cols: 0,
    rows: 0,
    snake: [],
    dir: [1, 0],
    food: null,
    acc: 0,
    dead: 0,
    player: false,
    col: colors(),
  });

  const reset = (cols, rows) => {
    const s = st.current;
    const r = Math.floor(rows / 2);
    s.snake = [[4, r], [3, r], [2, r]];
    s.dir = [1, 0];
    s.food = [Math.floor(cols * 0.7), r];
    s.dead = 0;
  };

  useEffect(() => {
    const s = st.current;
    const onTheme = () => (s.col = colors());
    const onPlay = () => {
      s.player = true;
    };
    const keys = {
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
    };
    const onKey = (e) => {
      if (!s.player) return;
      if (e.key === "Escape") {
        s.player = false;
        return;
      }
      const d = keys[e.key];
      if (!d) return;
      e.preventDefault();
      if (d[0] === -s.dir[0] && d[1] === -s.dir[1]) return;
      s.dir = d;
    };
    const canvas = canvasRef.current;
    const onClick = () => quip("snake");
    window.addEventListener("kc-theme", onTheme);
    window.addEventListener("kc-snake-play", onPlay);
    window.addEventListener("keydown", onKey);
    canvas?.parentElement?.addEventListener("pointerdown", onClick);
    return () => {
      window.removeEventListener("kc-theme", onTheme);
      window.removeEventListener("kc-snake-play", onPlay);
      window.removeEventListener("keydown", onKey);
      canvas?.parentElement?.removeEventListener("pointerdown", onClick);
    };
  }, []);

  useCanvasLoop(canvasRef, (ctx, { w, h }, dt) => {
    const s = st.current;
    const cols = Math.floor(w / CELL);
    const rows = Math.floor(h / CELL);
    if (cols !== s.cols || rows !== s.rows || !s.snake.length) {
      s.cols = cols;
      s.rows = rows;
      if (cols > 6 && rows > 6) reset(cols, rows);
    }

    if (s.dead > 0) {
      s.dead -= dt;
      if (s.dead <= 0) reset(cols, rows);
    } else {
      s.acc += dt;
      while (s.acc >= STEP) {
        s.acc -= STEP;
        step(s, cols, rows);
      }
    }

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = s.col.body;
    for (const [x, y] of s.snake) ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2);
    // a second pass deepens the body so it reads above the page texture
    for (const [x, y] of s.snake) ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2);
    if (s.food) {
      ctx.globalAlpha = 0.45;
      ctx.fillStyle = s.col.food;
      ctx.beginPath();
      ctx.arc(s.food[0] * CELL + CELL / 2, s.food[1] * CELL + CELL / 2, CELL / 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  });

  function step(s, cols, rows) {
    const head = s.snake[0];
    if (!s.player) {
      // Greedy and a little mortal: walk toward food, avoid walls and self,
      // and sometimes there is simply nowhere left to go.
      const options = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ].filter((d) => !(d[0] === -s.dir[0] && d[1] === -s.dir[1]));
      const safe = options.filter((d) => {
        const nx = head[0] + d[0];
        const ny = head[1] + d[1];
        if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) return false;
        return !s.snake.some(([x, y]) => x === nx && y === ny);
      });
      if (!safe.length) {
        s.dead = 2;
        return;
      }
      safe.sort((a, b) => {
        const da = Math.abs(head[0] + a[0] - s.food[0]) + Math.abs(head[1] + a[1] - s.food[1]);
        const db = Math.abs(head[0] + b[0] - s.food[0]) + Math.abs(head[1] + b[1] - s.food[1]);
        return da - db;
      });
      s.dir = Math.random() < 0.92 ? safe[0] : safe[safe.length - 1];
    }

    const nx = head[0] + s.dir[0];
    const ny = head[1] + s.dir[1];
    if (
      nx < 0 ||
      ny < 0 ||
      nx >= cols ||
      ny >= rows ||
      s.snake.some(([x, y]) => x === nx && y === ny)
    ) {
      s.dead = 2;
      s.player = false;
      return;
    }
    s.snake.unshift([nx, ny]);
    if (s.food && nx === s.food[0] && ny === s.food[1]) {
      s.food = [Math.floor(Math.random() * cols), Math.floor(Math.random() * rows)];
    } else {
      s.snake.pop();
    }
  }

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
};

export default Snake;
