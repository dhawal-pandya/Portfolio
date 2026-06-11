import React, { useState } from "react";
import Epigraph from "../shared/Epigraph";
import SectionHead from "../shared/SectionHead";
import WORK from "../../data/work.json";

const Job = ({ job }) => {
  const [open, setOpen] = useState(false);
  return (
    <article className="relative border-l hairline pb-12 pl-6 last:pb-0 md:pl-10">
      <span className="absolute -left-[3.5px] top-2 h-[7px] w-[7px] rounded-full bg-accent" />
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h3 className="font-display text-xl text-ink">{job.company}</h3>
        <span className="font-mono text-xs text-ink-soft">{job.span}</span>
      </div>
      <p className="mt-1 font-mono text-xs text-ink-soft">
        {job.title} · {job.place}
      </p>
      <ul className="mt-4 max-w-prose space-y-2 text-[15px] leading-relaxed text-ink">
        {job.points.map((p, i) => (
          <li key={i} className="flex gap-3">
            <span className="mt-[11px] h-px w-3 shrink-0 bg-line" aria-hidden="true" />
            <span>{p}</span>
          </li>
        ))}
        {open &&
          job.more.map((p, i) => (
            <li key={`m${i}`} className="flex gap-3 text-ink-soft">
              <span className="mt-[11px] h-px w-3 shrink-0 bg-line" aria-hidden="true" />
              <span>{p}</span>
            </li>
          ))}
      </ul>
      {job.more.length > 0 && (
        <button
          onClick={() => setOpen((o) => !o)}
          className="mt-3 font-mono text-xs text-ink-soft underline-offset-4 hover:text-accent hover:underline"
        >
          {open ? "less" : "more"}
        </button>
      )}
    </article>
  );
};

const Work = () => (
  <section id="work" className="mx-auto max-w-site px-5 py-24 md:px-8 md:py-32">
    <Epigraph text={WORK.epigraph} source={WORK.epigraphSource} />
    <SectionHead title="work" mark="कर्म" />
    <div className="mt-4">
      {WORK.jobs.map((j) => (
        <Job key={j.company} job={j} />
      ))}
    </div>
    <div className="mt-16 grid grid-cols-2 gap-x-8 gap-y-6 border-t hairline pt-8 sm:grid-cols-3 md:grid-cols-5">
      {WORK.skills.map((s) => (
        <div key={s.group}>
          <h4 className="mb-2 font-mono text-xs text-accent">{s.group}</h4>
          <ul className="space-y-1 text-sm text-ink-soft">
            {s.items.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </section>
);

export default Work;
