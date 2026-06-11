/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-soft": "var(--bg-soft)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        accent: "var(--accent)",
        line: "var(--line)",
      },
      fontFamily: {
        display: ["'Fraunces Variable'", "Georgia", "serif"],
        body: ["'Inter Variable'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono Variable'", "ui-monospace", "monospace"],
        devanagari: ["'Noto Serif Devanagari Variable'", "serif"],
        garamond: ["'EB Garamond'", "Georgia", "serif"],
        kalam: ["Kalam", "cursive"],
      },
      maxWidth: {
        prose: "68ch",
        site: "1100px",
      },
    },
  },
  plugins: [],
};
