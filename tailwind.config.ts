import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/_Components/**/*.{js,ts,jsx,tsx}",
    "./src/app/(pages)/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
    },
    extend: {
      animation: {
        shimmer: "shimmer 1.5s infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      boxShadow: {
        blueGlow: "0 0 10px #1c64f2",
      },
      screens: {
        xs: "400px",
        sm: "575px",
        "3xl": "1600px",
        "4xl": "1950px",
      },
      fontFamily: {
        righteous: ["var(--font-righteous)", "cursive"],
        roboto: ["var(--font-roboto)", "sans-serif"],
        cairo: ["var(--font-arabic)", "sans-serif"],
      },
    },
  },
  darkMode: "class",
  plugins: [],
};

export default config;
