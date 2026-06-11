import React, { useEffect } from "react";
import { foundSecret } from "../../lib/secrets";

// An empty page with one thing on it. You clicked your way here.
const Ash = () => {
  useEffect(() => {
    foundSecret("ash");
  }, []);

  return (
    <main className="grid min-h-screen place-items-center bg-bg px-6">
      <div className="max-w-md text-center">
        <p className="font-display text-2xl italic leading-relaxed text-ink md:text-3xl">
          it is better to be ashes
          <br />
          than merely dust.
        </p>
        <p className="mt-8 font-mono text-xs text-ink-soft">
          beware the world, I shall dare again
        </p>
        <a
          href="#top"
          onClick={() => (window.location.hash = "")}
          className="mt-16 inline-block font-mono text-xs text-ink-soft hover:text-accent"
        >
          ← back
        </a>
      </div>
    </main>
  );
};

export default Ash;
