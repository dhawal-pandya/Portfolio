import React from "react";
import CTA from "./CTA";
import ScrambledText from "./ScrambledText";

const Header = () => {
  return (
    <header id="home" className="relative h-[120vh] overflow-hidden pt-[25vh]">
      <div className="container relative mx-auto h-screen text-center">
        <h5 className="text-[4vw] md:text-[4vw] lg:text-[2vw]">Hello, I'm</h5>
        <h1 className="text-[10vw] font-light md:text-[7vw] lg:text-[7vw]">
          Dhawal Pandya
        </h1>
        <h5 className="text-light text-[4vw] md:text-[4vw] lg:text-[2vw]">
          <ScrambledText />
        </h5>
        <CTA />

        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-20"></div>
      </div>
    </header>
  );
};

export default Header;
