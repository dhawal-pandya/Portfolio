/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg': '#18182d',
        'bg-variant': '#2c2c6c',
        'primary': '#5fb8f8',
        'primary-variant': '#4db5ff66',
        'light': 'rgba(255, 255, 255, 0.6)',
        'cursor-glow': '#00ddeb',
      },
      width: {
        'container-lg': '75%',
        'container-md': '86%',
        'container-sm': '90%',
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
      keyframes: {
        "colors": {
          "0%": { "filter": "hue-rotate(0deg)" },
          "100%": { "filter": "hue-rotate(360deg)" }
        }
      },
      animation: {
        "colors": "colors 5s infinite"
      }
    },
  },
  plugins: [],
};
