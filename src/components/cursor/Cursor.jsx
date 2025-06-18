import React, { useEffect, useState } from "react";

const Cursor = () => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  useEffect(() => {
    const mouseMoveHandler = (e) => {
      setX(e.clientX);
      setY(e.clientY);
    };

    document.addEventListener("mousemove", mouseMoveHandler);

    return () => {
      document.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed z-[999] hidden h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_20px_#00ddeb,0_0_60px_#00ddeb,0_0_100px_#00ddeb] animate-colors lg:block"
      style={{ top: y, left: x }}
    ></div>
  );
};

export default Cursor;
