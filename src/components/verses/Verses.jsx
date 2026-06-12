import React, { useEffect, useRef, useState } from "react";
import SectionHead from "../shared/SectionHead";
import POEMS from "../../data/poems.json";
import PROFILE from "../../data/profile.json";
import { quip } from "../../lib/quips";

// Each poem is a sheet of paper. The paper and the ink follow the nature of
// the poem; see src/data/POEMS_README.md before adding one.

const NATURES = {
  love: { paper: "#f6efe3", ink: "#6b4a32", font: "font-kalam", size: "text-[15px]" },
  night: { paper: "#141828", ink: "#cdd3e8", font: "font-display italic font-light", size: "text-[14px]" },
  rage: { paper: "#171210", ink: "#e05d1e", font: "font-display font-black", size: "text-[14px]" },
  cosmic: { paper: "#0a0b12", ink: "#e6e4dd", font: "font-garamond", size: "text-[15px]" },
  resolve: { paper: "#f7f4ee", ink: "#20201d", font: "font-garamond", size: "text-[15px]" },
  grief: { paper: "#e3e1dd", ink: "#4a4a48", font: "font-display", size: "text-[14px]" },
  light: { paper: "#fbfaf7", ink: "#3a3833", font: "font-kalam", size: "text-[15px]" },
};

function valid(p) {
  const ok = p.slug && p.title && NATURES[p.nature] && Array.isArray(p.stanzas) && p.stanzas.length;
  if (!ok && import.meta.env.DEV)
    console.error(`[verses] poem skipped, missing required fields: ${JSON.stringify(p.slug || p.title || p)}`);
  return ok;
}

function tiltOf(slug) {
  let h = 0;
  for (const ch of slug) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return ((Math.abs(h) % 7) - 3) * 0.6;
}

const Sheet = ({ poem }) => {
  const n = NATURES[poem.nature];
  return (
    <article
      id={`poem-${poem.slug}`}
      className="w-[82vw] max-w-[400px] shrink-0 snap-center"
      style={{ transform: `rotate(${tiltOf(poem.slug)}deg)` }}
    >
      <div
        className="max-h-[560px] overflow-y-auto rounded-[2px] px-7 py-8 shadow-[0_8px_30px_rgba(0,0,0,0.18)] md:px-9 md:py-10"
        style={{ background: n.paper, color: n.ink }}
      >
        <h3 className={`mb-1 text-lg ${n.font}`}>{poem.title}</h3>
        {poem.note && <p className="mb-4 text-xs opacity-70">{poem.note}</p>}
        <div className={`mt-5 space-y-5 ${n.font} ${n.size} leading-relaxed`}>
          {poem.stanzas.map((stanza, i) => (
            <p key={i}>
              {stanza.map((line, j) => (
                <span key={j} className="block">
                  {line}
                </span>
              ))}
            </p>
          ))}
        </div>
        {poem.year && <p className="mt-6 text-xs opacity-60">{poem.year}</p>}
      </div>
    </article>
  );
};

const Verses = () => {
  const poems = POEMS.filter(valid);
  const scroller = useRef(null);
  const [index, setIndex] = useState(0);
  const endQuipped = useRef(false);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const onScroll = () => {
      const i = Math.round((el.scrollLeft / (el.scrollWidth - el.clientWidth || 1)) * (poems.length - 1));
      setIndex(Math.min(Math.max(i, 0), poems.length - 1));
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 2 && !endQuipped.current) {
        endQuipped.current = true;
        quip("paper");
      }
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [poems.length]);

  // The terminal can turn to a poem by slug.
  useEffect(() => {
    const onJump = (e) => {
      const sheet = document.getElementById(`poem-${e.detail.slug}`);
      sheet?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    };
    window.addEventListener("kc-poem", onJump);
    return () => window.removeEventListener("kc-poem", onJump);
  }, []);

  const by = (dir) => {
    const el = scroller.current;
    el?.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 420), behavior: "smooth" });
  };

  return (
    <section id="verses" className="py-12 md:py-16">
      <div className="mx-auto max-w-site px-5 md:px-8">
        <SectionHead title="verses" mark="शब्द" />
      </div>
      <div
        ref={scroller}
        className="flex snap-x snap-mandatory gap-8 overflow-x-auto px-[9vw] pb-8 pt-4 [scrollbar-width:thin] md:gap-12"
      >
        {poems.map((p) => (
          <Sheet key={p.slug} poem={p} />
        ))}
        <div className="w-[9vw] shrink-0" aria-hidden="true" />
      </div>
      <div className="mx-auto flex max-w-site items-center justify-between px-5 md:px-8">
        <p className="text-xs text-ink-soft">
          {index + 1} / {poems.length}
        </p>
        <div className="flex gap-3">
          <button onClick={() => by(-1)} aria-label="previous poem" className="border hairline px-3 py-1 text-xs text-ink-soft hover:text-accent">
            ←
          </button>
          <button onClick={() => by(1)} aria-label="next poem" className="border hairline px-3 py-1 text-xs text-ink-soft hover:text-accent">
            →
          </button>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-site px-5 text-xs text-ink-soft md:px-8">
        the longer words live at{" "}
        <a href={PROFILE.blog} target="_blank" rel="noreferrer" className="text-accent underline-offset-4 hover:underline">
          dhawalpandya01.hashnode.dev ↗
        </a>
      </p>
    </section>
  );
};

export default Verses;
