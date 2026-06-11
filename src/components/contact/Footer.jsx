import React, { useRef } from "react";
import PROFILE from "../../data/profile.json";
import { foundSecret } from "../../lib/secrets";

// One word. Click it seven times and see.
const Footer = () => {
  const clicks = useRef([]);

  const onWord = () => {
    const now = Date.now();
    clicks.current = [...clicks.current.filter((t) => now - t < 6000), now];
    if (clicks.current.length >= 7) {
      clicks.current = [];
      foundSecret("ash");
      window.location.hash = "#/ash";
    }
  };

  return (
    <footer className="border-t hairline py-12 text-center">
      <button
        onClick={onWord}
        className="select-none font-devanagari text-lg text-ink-soft transition-colors hover:text-ink"
        aria-label={PROFILE.footer}
      >
        {PROFILE.footer}
      </button>
    </footer>
  );
};

export default Footer;
