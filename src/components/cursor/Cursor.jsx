import React, { useEffect, useState } from 'react';
import './Cursor.css';

const Cursor = () => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  useEffect(() => {
    document.addEventListener('mousemove', mouseMoveHandler);
  }, []);

  const mouseMoveHandler = (e) => {
    setX(e.pageX);
    setY(e.pageY);
  };

  return (
    <div className='cursor' style={{ top: `${y}px`, left: `${x}px` }}></div>
  );
};

export default Cursor;
