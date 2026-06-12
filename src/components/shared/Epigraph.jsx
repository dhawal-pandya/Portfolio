import React from "react";

// A line of his, set quietly. It should be felt on the way past, not stood in front of.
const Epigraph = ({ text, source }) => (
  <figure className="mb-10 max-w-prose opacity-80">
    <blockquote className="font-display text-base italic leading-relaxed text-ink-soft md:text-lg">
      {text}
    </blockquote>
    <figcaption className="mt-2 text-[10px] text-ink-soft">
      — {source}
    </figcaption>
  </figure>
);

export default Epigraph;
