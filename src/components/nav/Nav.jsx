import React, { useEffect, useRef, useState } from "react";
import { toggleTheme, currentTheme } from "../../lib/theme";
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

const Nav = () => {
  const [active, setActive] = useState("");
  const [theme, setTheme] = useState(currentTheme());
  const toggles = useRef([]);

  useEffect(() => {
    const onTheme = (e) => setTheme(e.detail);
    window.addEventListener("kc-theme", onTheme);
    return () => window.removeEventListener("kc-theme", onTheme);
  }, []);

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

  const onToggle = () => {
    toggleTheme();
    const now = Date.now();
    toggles.current = [...toggles.current.filter((t) => now - t < 4000), now];
    if (toggles.current.length >= 4) {
      toggles.current = [];
      quip("toggle");
    }
  };

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b hairline backdrop-blur-sm"
      style={{ background: "color-mix(in srgb, var(--bg) 82%, transparent)" }}
    >
      <nav className="mx-auto flex max-w-site items-center justify-between px-5 py-3 md:px-8">
        <a
          href="#top"
          className="font-display text-base text-ink hover:text-accent"
          aria-label="back to the top"
        >
          dp<span className="text-accent">.</span>
        </a>
        <div className="flex items-center gap-4 md:gap-7">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={`relative font-mono text-[11px] tracking-wide md:text-xs ${
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
          <button
            onClick={onToggle}
            className="text-ink-soft transition-colors hover:text-accent"
            aria-label={theme === "day" ? "switch to night" : "switch to day"}
            title={theme === "day" ? "night" : "day"}
          >
            {theme === "day" ? <MoonIcon /> : <SunIcon />}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Nav;
