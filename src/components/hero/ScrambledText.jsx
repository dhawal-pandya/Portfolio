import React, { useEffect, useRef, useState } from "react";

// Settles a string letter by letter. The unsettled part is a shuffle of the
// target's own remaining letters, so the line keeps its width and never
// jumps while assembling. `nonce` re-scrambles.
const ScrambledText = ({ words, nonce = 0, className = "" }) => {
  const list = Array.isArray(words) ? words : [words];
  const [text, setText] = useState(list[0]);
  const idx = useRef(0);
  const raf = useRef(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scramble = (target, fixed) => {
      const rest = target
        .slice(fixed)
        .split("")
        .filter((c) => c !== " ");
      for (let i = rest.length - 1; i > 0; i--) {
        const j = (Math.random() * (i + 1)) | 0;
        [rest[i], rest[j]] = [rest[j], rest[i]];
      }
      let out = target.slice(0, fixed);
      let k = 0;
      for (let i = fixed; i < target.length; i++)
        out += target[i] === " " ? " " : rest[k++];
      return out;
    };

    const settle = (target) => {
      cancelAnimationFrame(raf.current);
      if (reduced) {
        setText(target);
        return;
      }
      const start = performance.now();
      const dur = 600;
      const step = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const fixed = Math.floor(target.length * p);
        setText(scramble(target, fixed));
        if (p < 1) raf.current = requestAnimationFrame(step);
      };
      raf.current = requestAnimationFrame(step);
    };

    settle(list[idx.current % list.length]);
    if (list.length < 2) return () => cancelAnimationFrame(raf.current);
    const id = setInterval(() => {
      idx.current = (idx.current + 1) % list.length;
      settle(list[idx.current]);
    }, 3600);
    return () => {
      clearInterval(id);
      cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nonce, list.join("|")]);

  return <span className={className}>{text}</span>;
};

export default ScrambledText;
