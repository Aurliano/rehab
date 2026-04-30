/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Vazirmatn", "sans-serif"],
      },
      colors: {
        navy: {
          900: "#020d1a",
          800: "#041428",
          700: "#071e38",
        },
      },
      backgroundImage: {
        "main-gradient":
          "radial-gradient(ellipse at 60% 0%, #0a2a4a 0%, #020d1a 60%)",
      },
    },
  },
  plugins: [],
};
