import React, { useEffect, useRef, useState } from "react";

// One voice, center of the screen. Never two at once.
const Toast = () => {
  const [msg, setMsg] = useState(null);
  const timer = useRef(0);

  useEffect(() => {
    const onToast = (e) => {
      clearTimeout(timer.current);
      setMsg(e.detail.text);
      timer.current = setTimeout(() => setMsg(null), e.detail.ms || 4000);
    };
    window.addEventListener("kc-toast", onToast);
    return () => {
      window.removeEventListener("kc-toast", onToast);
      clearTimeout(timer.current);
    };
  }, []);

  return (
    <div
      aria-live="polite"
      className={`pointer-events-none fixed left-1/2 top-1/2 z-[90] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${
        msg ? "opacity-100" : "opacity-0"
      }`}
    >
      {msg && (
        <p className="max-w-md rounded border hairline bg-bg-soft px-6 py-4 text-center font-mono text-sm leading-relaxed text-ink shadow-lg md:text-base">
          {msg}
        </p>
      )}
    </div>
  );
};

export default Toast;
