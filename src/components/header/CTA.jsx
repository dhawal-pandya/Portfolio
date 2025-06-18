import React from "react";
import CV from "../../assets/Dhawal_Pandya_Resume.pdf";

const CTA = () => {
  return (
    <div className="mt-44 flex justify-center gap-5">
      <a href={CV} download className="btn">
        Download Resume
      </a>
      <a href="#contact" className="btn btn-primary">
        Let's talk
      </a>
    </div>
  );
};

export default CTA;
