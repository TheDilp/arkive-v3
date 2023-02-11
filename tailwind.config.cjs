/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Lato: ["Lato"],
        Merriweather: ["Merriweather"],
      },
      transitionProperty: {
        width: "width",
      },
    },
  },
  plugins: [],
};
