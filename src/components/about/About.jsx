import React, { useRef, useState } from "react";
import Epigraph from "../shared/Epigraph";
import SectionHead from "../shared/SectionHead";
import Chai from "./Chai";
import PROFILE from "../../data/profile.json";
import { foundSecret } from "../../lib/secrets";
import me from "../../assets/dp1.png";

const About = () => {
  const [held, setHeld] = useState(false);
  const timer = useRef(0);

  const startHold = () => {
    timer.current = setTimeout(() => {
      setHeld(true);
      foundSecret("photo");
    }, 600);
  };
  const endHold = () => {
    clearTimeout(timer.current);
    setHeld(false);
  };

  return (
    <section id="about" className="relative">
      <Chai />
      <div className="relative z-10 mx-auto max-w-site px-5 py-24 md:px-8 md:py-32">
      <Epigraph text={PROFILE.about.epigraph} source={PROFILE.about.epigraphSource} />
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[320px_1fr] md:gap-16">
        <div
          className="relative mx-auto h-72 w-72 select-none overflow-hidden rounded-sm border hairline md:mx-0 md:h-80 md:w-80"
          onMouseDown={startHold}
          onMouseUp={endHold}
          onMouseLeave={endHold}
          onTouchStart={startHold}
          onTouchEnd={endHold}
          onContextMenu={(e) => e.preventDefault()}
        >
          <img
            src={me}
            alt="Dhawal Pandya"
            draggable="false"
            className={`h-full w-full object-cover transition-all duration-500 hover:scale-105 ${
              held ? "opacity-0" : "opacity-100"
            }`}
          />
          <div
            className={`absolute inset-0 grid place-items-center bg-bg-soft p-4 text-center transition-opacity duration-300 ${
              held ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <p className="font-mono text-xs leading-relaxed text-ink-soft">
              {PROFILE.about.photoHold}
            </p>
          </div>
        </div>
        <div>
          <SectionHead title="about" />
          <div className="max-w-prose space-y-5 text-[15px] leading-relaxed text-ink">
            {PROFILE.about.paragraphs.map((p, i) => (
              <p key={i} className={i === PROFILE.about.paragraphs.length - 1 ? "text-ink-soft" : ""}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

export default About;
