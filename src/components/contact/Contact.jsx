import React, { useState } from "react";
import SectionHead from "../shared/SectionHead";
import Snake from "./Snake";
import PROFILE from "../../data/profile.json";
import { quip } from "../../lib/quips";
import resumeUrl from "../../assets/Dhawal_Pandya_Resume.pdf";

const Contact = () => {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      quip("contact");
    } catch {
      window.location.href = `mailto:${PROFILE.email}`;
    }
  };

  return (
    <section id="contact" className="relative">
      <Snake />
      <div className="relative z-10 mx-auto max-w-site px-5 py-12 md:px-8 md:py-16">
        <SectionHead title="contact" mark="संपर्क" />
        <ul className="max-w-md space-y-4 text-sm">
          <li className="flex items-baseline justify-between gap-4 border-b hairline pb-3">
            <span className="text-ink-soft">email</span>
            <button onClick={copyEmail} className="text-ink underline-offset-4 hover:text-accent hover:underline">
              {copied ? "copied." : PROFILE.email}
            </button>
          </li>
          <li className="flex items-baseline justify-between gap-4 border-b hairline pb-3">
            <span className="text-ink-soft">github</span>
            <a href={PROFILE.github} target="_blank" rel="noreferrer" className="text-ink underline-offset-4 hover:text-accent hover:underline">
              dhawal-pandya ↗
            </a>
          </li>
          <li className="flex items-baseline justify-between gap-4 border-b hairline pb-3">
            <span className="text-ink-soft">linkedin</span>
            <a href={PROFILE.linkedin} target="_blank" rel="noreferrer" className="text-ink underline-offset-4 hover:text-accent hover:underline">
              dhawal-pandya ↗
            </a>
          </li>
          <li className="flex items-baseline justify-between gap-4 border-b hairline pb-3">
            <span className="text-ink-soft">resume</span>
            <a href={resumeUrl} target="_blank" rel="noreferrer" className="text-ink underline-offset-4 hover:text-accent hover:underline">
              the PDF ↗
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Contact;
