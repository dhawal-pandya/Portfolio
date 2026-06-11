import React, { useEffect, useState } from "react";

// The old board, kept out of sight. The terminal knows the way in.

const KEY = "kc-kanban-v2";
const SEED = {
  todo: [
    "Bring Order out of Chaos",
    "Prove p = np",
    "Attempt to solve the Collatz Conjecture",
    "learn Rust properly",
    "write the book",
  ],
  doing: [
    "Realise the Truth with Code",
    "Yoga",
    "DSA practice",
    "reread the Mahabharat, unabridged",
    "ship this site",
  ],
  done: [
    "Learn Japanese",
    "Smile at a cat",
    "Feed the birds",
    "beat Viral at chess (verified, twice)",
  ],
};
const COLS = [
  ["todo", "to do"],
  ["doing", "doing"],
  ["done", "done"],
];

function load() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY));
    if (v && v.todo && v.doing && v.done) return v;
  } catch {}
  return SEED;
}

const Kanban = ({ open, onClose }) => {
  const [board, setBoard] = useState(load);
  const [text, setText] = useState("");
  const [drag, setDrag] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(board));
    } catch {}
  }, [board]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const dropTo = (col) => {
    if (!drag) return;
    setBoard((b) => {
      const from = b[drag.col].filter((_, i) => i !== drag.i);
      const item = b[drag.col][drag.i];
      return { ...b, [drag.col]: from, [col]: [...b[col], item] };
    });
    setDrag(null);
  };

  const add = (e) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    setBoard((b) => ({ ...b, todo: [...b.todo, t] }));
    setText("");
  };

  const remove = (col, i) =>
    setBoard((b) => ({ ...b, [col]: b[col].filter((_, j) => j !== i) }));

  return (
    <div className="fixed inset-0 z-[85] grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-3xl rounded border hairline bg-bg p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-baseline justify-between">
          <h3 className="font-display text-xl text-ink">the board</h3>
          <button onClick={onClose} className="font-mono text-xs text-ink-soft hover:text-accent">
            esc
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {COLS.map(([key, label]) => (
            <div
              key={key}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => dropTo(key)}
              className="min-h-[180px] rounded border hairline bg-bg-soft p-3"
            >
              <h4 className="mb-3 font-mono text-xs text-ink-soft">{label}</h4>
              <ul className="space-y-2">
                {board[key].map((item, i) => (
                  <li
                    key={`${item}-${i}`}
                    draggable
                    onDragStart={() => setDrag({ col: key, i })}
                    className="group flex cursor-grab items-start justify-between gap-2 rounded border hairline bg-bg px-3 py-2 text-sm text-ink"
                  >
                    <span>{item}</span>
                    <button
                      onClick={() => remove(key, i)}
                      aria-label="remove"
                      className="opacity-0 transition-opacity group-hover:opacity-100 text-ink-soft hover:text-accent"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <form onSubmit={add} className="mt-4 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="another thing I will definitely do"
            className="flex-1 rounded border hairline bg-bg-soft px-3 py-2 font-mono text-xs text-ink outline-none placeholder:text-ink-soft"
          />
          <button className="rounded border hairline px-4 font-mono text-xs text-ink-soft hover:text-accent">
            add
          </button>
        </form>
      </div>
    </div>
  );
};

export default Kanban;
