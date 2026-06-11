import React from "react";

const SectionHead = ({ mark, title }) => (
  <div className="mb-10 flex items-baseline gap-4">
    <h2 className="font-display text-3xl text-ink md:text-4xl">{title}</h2>
    {mark && (
      <span
        aria-hidden="true"
        className="font-devanagari text-sm text-ink-soft select-none"
      >
        {mark}
      </span>
    )}
  </div>
);

export default SectionHead;
