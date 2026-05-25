import React from "react";

const CTA = () => {
  return (
    <div className="mt-44 flex justify-center gap-5">
      <a
        href="https://raw.githubusercontent.com/dhawal-pandya/Portfolio/master/src/assets/Dhawal_Pandya_Resume.pdf"
        download
        className="btn"
      >
        Download Resume
      </a>
      <a href="#contact" className="btn btn-primary">
        Let's talk
      </a>
    </div>
  );
};

export default CTA;
