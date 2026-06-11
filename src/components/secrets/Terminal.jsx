import React, { useEffect, useRef, useState } from "react";
import T from "../../data/terminal.json";
import POEMS from "../../data/poems.json";
import PROFILE from "../../data/profile.json";
import { foundSecret, secretCount } from "../../lib/secrets";
import { setOverride, followSun } from "../../lib/theme";
import resumeUrl from "../../assets/Dhawal_Pandya_Resume.pdf";

// Press ` anywhere. The page has a back door, and the back door has manners.

let unknownIdx = 0;

const Terminal = ({ onKanban }) => {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const histPos = useRef(-1);
  const inputRef = useRef(null);
  const endRef = useRef(null);

  const print = (text, kind = "out") =>
    setLines((ls) => [...ls, ...String(text).split("\n").map((t) => ({ t, kind }))]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "`" || e.metaKey || e.ctrlKey) return;
      const el = document.activeElement;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA") && el !== inputRef.current) return;
      e.preventDefault();
      setOpen((o) => {
        if (!o) {
          if (foundSecret("terminal")) {
            // first time: greet
          }
          return true;
        }
        return false;
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      if (!lines.length) print(T.greeting, "sys");
      setTimeout(() => inputRef.current?.focus(), 30);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [lines]);

  const run = (raw) => {
    const cmd = raw.trim();
    if (!cmd) return;
    print(`❯ ${cmd}`, "in");
    const [head, ...rest] = cmd.toLowerCase().split(/\s+/);
    const arg = rest.join(" ");

    switch (head) {
      case "help":
        T.help.forEach((l) => print(l));
        break;
      case "whoami":
        print(T.whoami);
        break;
      case "ls":
        print(arg === ".secrets" || arg === "secrets" ? T.lsSecrets : T.ls);
        break;
      case "cat":
        if (arg === "resume") {
          window.open(resumeUrl, "_blank");
          print("opening the PDF.");
        } else if (arg === "about") {
          PROFILE.about.paragraphs.forEach((p) => print(p));
        } else if (arg === ".secrets" || arg === "secrets") {
          print(T.lsSecrets);
        } else {
          print(`no such file: ${arg || "(nothing)"}`);
        }
        break;
      case "blog":
        window.open(PROFILE.blog, "_blank");
        print("opening the longer words.");
        break;
      case "poems":
        if (!arg) {
          POEMS.forEach((p) => print(`${p.slug}  (${p.nature})`));
        } else {
          const hit = POEMS.find((p) => p.slug === arg);
          if (hit) {
            window.dispatchEvent(new CustomEvent("kc-poem", { detail: { slug: hit.slug } }));
            print(T.poemJump);
            setOpen(false);
          } else {
            print(`no verse by that name: ${arg}`);
          }
        }
        break;
      case "globe": {
        const i = Math.floor(Math.random() * T.globeLines.length);
        window.dispatchEvent(new CustomEvent("kc-globe-spin", { detail: { index: i } }));
        print(T.globeLines[i]);
        break;
      }
      case "theme":
        if (arg === "day" || arg === "night") {
          setOverride(arg);
          print(T.themeSet[arg]);
        } else if (arg === "sun") {
          followSun();
          print(T.themeSet.sun);
        } else {
          print("theme day | night | sun");
        }
        break;
      case "snake":
        window.dispatchEvent(new CustomEvent("kc-snake-play"));
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
        print(T.snakeStart);
        setOpen(false);
        break;
      case "life":
        window.dispatchEvent(new CustomEvent("kc-life-reseed"));
        print(T.lifeReseeded);
        break;
      case "kanban":
        onKanban?.();
        print("opening the board.");
        setOpen(false);
        break;
      case "tathastu":
        foundSecret("tathastu");
        print(T.tathastu);
        break;
      case "secrets": {
        const { found, total } = secretCount();
        print(`${found} of ${total}.`);
        if (found >= total) print(T.secretsAllFound);
        break;
      }
      case "clear":
        setLines([]);
        break;
      case "exit":
        setOpen(false);
        break;
      default:
        print(T.unknown[unknownIdx++ % T.unknown.length]);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) setHistory((h) => [...h, input]);
    histPos.current = -1;
    run(input);
    setInput("");
  };

  const onInputKey = (e) => {
    if (e.key === "Escape") setOpen(false);
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const h = history;
      if (!h.length) return;
      histPos.current = histPos.current < 0 ? h.length - 1 : Math.max(0, histPos.current - 1);
      setInput(h[histPos.current]);
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histPos.current < 0) return;
      histPos.current = Math.min(history.length - 1, histPos.current + 1);
      setInput(history[histPos.current] || "");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[80] h-[46vh] border-t hairline bg-bg-soft font-mono text-[13px] shadow-2xl">
      <div className="mx-auto flex h-full max-w-site flex-col px-5 py-4 md:px-8">
        <div className="flex-1 overflow-y-auto pr-2 leading-relaxed">
          {lines.map((l, i) => (
            <p
              key={i}
              className={
                l.kind === "in" ? "text-accent" : l.kind === "sys" ? "text-ink-soft" : "text-ink"
              }
            >
              {l.t}
            </p>
          ))}
          <div ref={endRef} />
        </div>
        <form onSubmit={onSubmit} className="mt-2 flex items-center gap-2 border-t hairline pt-3">
          <span className="text-accent">❯</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onInputKey}
            className="flex-1 bg-transparent text-ink outline-none placeholder:text-ink-soft"
            placeholder="help"
            spellCheck="false"
            autoComplete="off"
            aria-label="terminal input"
          />
        </form>
      </div>
    </div>
  );
};

export default Terminal;
