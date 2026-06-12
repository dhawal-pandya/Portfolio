import React, { useEffect, useState } from "react";
import Globe from "./Globe";
import Dragon from "./Dragon";
import ScrambledText from "./ScrambledText";
import PROFILE from "../../data/profile.json";
import { quip } from "../../lib/quips";
import { foundSecret } from "../../lib/secrets";
import resumeUrl from "../../assets/Dhawal_Pandya_Resume.pdf";

const Hero = () => {
  const [line, setLine] = useState(PROFILE.heroLine);

  // After midnight and before four, the page admits what it wants.
  useEffect(() => {
    const h = new Date().getHours();
    if (h >= 0 && h < 4) {
      setLine(PROFILE.heroLineNight);
      foundSecret("nightowl");
    }
  }, []);

  const onNameDoubleClick = () => quip("name");

  return (
    <section id="top" className="relative flex min-h-screen items-center overflow-hidden">
      <Dragon />
      <div className="mx-auto grid w-full max-w-site grid-cols-1 items-center gap-8 px-5 pt-20 md:grid-cols-[1.1fr_1fr] md:px-8">
        <div className="relative z-10 order-2 md:order-1">
          <p className="mb-3 text-xs text-ink-soft">{PROFILE.heroKicker}</p>
          <h1
            onDoubleClick={onNameDoubleClick}
            className="select-none font-display text-5xl leading-tight text-ink md:text-7xl"
          >
            {PROFILE.name}
          </h1>
          <p className="mt-4 h-6 text-sm text-accent">
            <ScrambledText words={PROFILE.roles} />
          </p>
          {line && <p className="mt-6 max-w-md text-base leading-relaxed text-ink-soft">{line}</p>}
          <div className="mt-10 flex gap-6 text-xs">
            <a href="#work" className="link-quiet underline-offset-4 hover:underline">
              the work ↓
            </a>
            <a href="#verses" className="link-quiet underline-offset-4 hover:underline">
              the verses ↓
            </a>
            <a href={resumeUrl} target="_blank" rel="noreferrer" className="link-quiet underline-offset-4 hover:underline">
              the resume ↓
            </a>
          </div>
        </div>
        <div className="relative z-[1] order-1 mx-auto aspect-square w-[78vw] max-w-[300px] opacity-60 md:order-2 md:w-full md:max-w-[480px] md:opacity-100">
          <Globe />
        </div>
      </div>
      <a
        href="#about"
        aria-label="scroll down"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-ink-soft transition-colors hover:text-accent"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M4 9l8 8 8-8" />
        </svg>
      </a>
    </section>
  );
};

export default Hero;
