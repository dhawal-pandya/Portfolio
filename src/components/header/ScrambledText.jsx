import { useState, useEffect, useRef } from "react";

const ScrambledText = () => {
  const phrases = [
    "Software Engineer",
    "AI Engineer",
    "Software Engineer",
    "AI Engineer",
    "Yogi",
    "The Universe itself",
    "Why are you still reading this?",
    "Okay, here a joke for you",
    "What does an existential AI say when asked about the meaning of life?",
    "Undefined. Please scroll on.",
    "Really, please scroll on...",
    "Here's who I am,",
  ];

  const [scrambledText, setScrambledText] = useState(phrases[0]);
  const phraseIndex = useRef(0);
  const timeoutRef = useRef();

  const chars = "!<>-_\\/[]{}—=+*^?#________";

  const scramble = (newText) => {
    let counter = 0;
    const interval = setInterval(() => {
      const newScrambledText = newText
        .split("")
        .map((char, index) => {
          if (index < counter) {
            return newText[index];
          }
          if (char === " ") {
            return " ";
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");

      setScrambledText(newScrambledText);

      if (counter >= newText.length) {
        clearInterval(interval);
        setScrambledText(newText);
      }
      counter += 1 / 3;
    }, 30);
  };

  useEffect(() => {
    const nextScramble = () => {
      const currentPhrase = phrases[phraseIndex.current];
      const delay = Math.max(currentPhrase.length * 100, 2500);

      timeoutRef.current = setTimeout(() => {
        phraseIndex.current = (phraseIndex.current + 1) % phrases.length;
        scramble(phrases[phraseIndex.current]);
        nextScramble();
      }, delay);
    };

    nextScramble();

    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <div className="text-center font-mono text-2xl md:text-3xl text-color-primary">
      {scrambledText}
    </div>
  );
};

export default ScrambledText;
