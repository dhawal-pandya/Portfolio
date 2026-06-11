import React from "react";
import Epigraph from "../shared/Epigraph";
import SectionHead from "../shared/SectionHead";
import GameOfLife from "./GameOfLife";
import DATA from "../../data/projects.json";

const Row = ({ p }) => (
  <li className="group grid grid-cols-1 gap-1 border-b hairline py-5 sm:grid-cols-[1fr_auto] sm:items-baseline">
    <div>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="font-display text-lg text-ink">{p.title}</h3>
        <span className="flex gap-2">
          {p.tags.map((t) => (
            <span
              key={t}
              className={`font-mono text-[10px] ${t === "ai" ? "text-accent" : "text-ink-soft"}`}
            >
              {t}
            </span>
          ))}
        </span>
      </div>
      <p className="mt-1 text-sm text-ink-soft">{p.desc}</p>
    </div>
    <div className="flex gap-5 font-mono text-xs sm:justify-end">
      {p.live && (
        <a href={p.live} target="_blank" rel="noreferrer" className="link-quiet underline-offset-4 hover:underline">
          live ↗
        </a>
      )}
      {p.code && (
        <a href={p.code} target="_blank" rel="noreferrer" className="link-quiet underline-offset-4 hover:underline">
          code ↗
        </a>
      )}
    </div>
  </li>
);

const Projects = () => (
  <section id="projects" className="relative">
    <GameOfLife />
    <div className="pointer-events-none relative z-10 mx-auto max-w-site px-5 py-24 md:px-8 md:py-32">
      <div className="pointer-events-auto">
        <Epigraph text={DATA.epigraph} source={DATA.epigraphSource} />
        <SectionHead title="projects" mark="लीला" />
        <ul className="border-t hairline">
          {DATA.projects.map((p) => (
            <Row key={p.title} p={p} />
          ))}
          <li className="py-5">
            <a
              href={DATA.moreLink}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-xs link-quiet underline-offset-4 hover:underline"
            >
              {DATA.moreText} ↗
            </a>
          </li>
        </ul>
      </div>
    </div>
  </section>
);

export default Projects;
