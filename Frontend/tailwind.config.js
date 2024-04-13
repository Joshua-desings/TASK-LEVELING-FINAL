/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      screens: {
        medium: { max: "540px" }, 
        small: { max: "430px" }, 
        large: { max: "280px" },
      },      
      fontFamily: {
        // Recordar poner aqui las fuentes ejemplo: lato: ["Lato", "sans-serif"],
      },
    },
  },
  variants: {},
  plugins: [],
};