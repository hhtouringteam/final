/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      spacing: {
        48: "12rem",
        118: "29.5rem",
      },
      colors: {
        "blue-200": "#97aee8",
        black: "#000",
      },
    },
  },
  variants: {},
  plugins: [],
};
