import { useEffect, useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';

export const StrictModeDroppable = ({ children, ...props }) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return <Droppable {...props}>{children}</Droppable>;
};

// we had to use this from somewhere, becasue the react-beautiful-dnd is no longer maintained, so other developers have fixed it.
// this here is the fix.
// we import this instead of the react-beautiful-dnd "Droppable" element.
