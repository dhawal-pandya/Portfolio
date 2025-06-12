import React, { useEffect, useState } from 'react';

const Cursor = () => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  useEffect(() => {
    document.addEventListener('mousemove', mouseMoveHandler);
    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('mousemove', mouseMoveHandler);
    };
  }, []);

  const mouseMoveHandler = (e) => {
    setX(e.pageX);
    setY(e.pageY);
  };

  return (
    <div
      className="absolute z-[999] w-5 h-5 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 shadow-[0_0_20px_theme(colors.cursor-glow),_0_0_60px_theme(colors.cursor-glow),_0_0_100px_theme(colors.cursor-glow)] lg:shadow-[0_0_10px_theme(colors.cursor-glow),_0_0_30px_theme(colors.cursor-glow),_0_0_50px_theme(colors.cursor-glow)] animate-colors block max-[600px]:hidden"
      style={{ top: `${y}px`, left: `${x}px` }}
    ></div>
  );
};

export default Cursor;
