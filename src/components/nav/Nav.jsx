import React, { useEffect, useRef, useState } from "react";
import { setOverride, followSun, getOverride } from "../../lib/theme";
import { quip } from "../../lib/quips";

const LINKS = [
  { id: "about", label: "about" },
  { id: "work", label: "work" },
  { id: "projects", label: "projects" },
  { id: "verses", label: "verses" },
  { id: "contact", label: "contact" },
];

const SunIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <circle cx="12" cy="12" r="4.5" />
    <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M19.4 4.6l-1.8 1.8M6.4 17.6l-1.8 1.8" />
  </svg>
);

const MoonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z" />
  </svg>
);

// The sun at the horizon: the third state, where the page follows the real sky.
const HorizonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M3 18h18" />
    <path d="M7.5 18a4.5 4.5 0 0 1 9 0" />
    <path d="M12 8V5.5M5.6 10.6l1.8 1.8M18.4 10.6l-1.8 1.8" />
  </svg>
);

const Nav = () => {
  const [active, setActive] = useState("");
  const [mode, setMode] = useState(() => getOverride() || "sun");
  const [spin, setSpin] = useState(0);
  const [open, setOpen] = useState(false);
  const toggles = useRef([]);

  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Three states, in a circle: pinned day, pinned night, then back to the
  // actual sky.
  const onToggle = () => {
    if (mode === "sun") {
      setOverride("day");
      setMode("day");
    } else if (mode === "day") {
      setOverride("night");
      setMode("night");
    } else {
      followSun();
      setMode("sun");
    }
    const now = Date.now();
    toggles.current = [...toggles.current.filter((t) => now - t < 4000), now];
    if (toggles.current.length >= 4) {
      toggles.current = [];
      quip("toggle");
    }
  };

  const next = mode === "sun" ? "day" : mode === "day" ? "night" : "the actual sky";

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b hairline backdrop-blur-sm"
      style={{ background: "color-mix(in srgb, var(--bg) 82%, transparent)" }}
    >
      <nav className="mx-auto flex max-w-site items-center justify-between px-5 py-2.5 md:px-8">
        <a
          href="#top"
          onClick={(e) => {
            setSpin((d) => d + 1080);
            // on a phone there is no backtick; the wheel is the door
            if (window.matchMedia("(pointer: coarse)").matches) {
              e.preventDefault();
              window.dispatchEvent(new CustomEvent("kc-terminal"));
            }
          }}
          className="grid h-9 w-9 place-items-center font-display text-base leading-none text-ink hover:text-accent"
          style={{
            transform: `rotate(${spin}deg)`,
            transition: "transform 1600ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          aria-label="back to the top"
        >
          dp
        </a>
        <div className="flex items-center gap-5 md:gap-7">
          <div className="hidden items-center gap-7 md:flex">
            {LINKS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className={`relative text-xs tracking-wide ${
                  active === l.id ? "text-ink" : "text-ink-soft hover:text-ink"
                }`}
              >
                {l.label}
                <span
                  className={`absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent transition-opacity ${
                    active === l.id ? "opacity-100" : "opacity-0"
                  }`}
                />
              </a>
            ))}
          </div>
          <button
            onClick={onToggle}
            className="text-ink-soft transition-colors hover:text-accent"
            aria-label={`switch to ${next}`}
            title={next}
          >
            {mode === "sun" ? <SunIcon /> : mode === "day" ? <MoonIcon /> : <HorizonIcon />}
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            className="text-ink-soft transition-colors hover:text-accent md:hidden"
            aria-label={open ? "close menu" : "open menu"}
            aria-expanded={open}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 9h16M4 15h16" />}
            </svg>
          </button>
        </div>
      </nav>
      {open && (
        <div
          className="border-t hairline md:hidden"
          style={{ background: "color-mix(in srgb, var(--bg) 94%, transparent)" }}
        >
          <div className="mx-auto flex max-w-site flex-col px-5 py-2">
            {LINKS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={() => setOpen(false)}
                className={`py-2.5 text-xs tracking-wide ${
                  active === l.id ? "text-ink" : "text-ink-soft"
                }`}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Nav;
