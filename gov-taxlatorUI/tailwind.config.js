// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef5ff",
          100: "#d9e8ff",
          200: "#b7d4ff",
          300: "#88b7ff",
          400: "#5792ff",
          500: "#2f6bff",
          600: "#1f4fe0",
          700: "#183db4",
          800: "#16358f",
          900: "#142e73"
        }
      },
      boxShadow: {
        soft: "0 10px 30px rgba(15, 23, 42, 0.12)"
      }
    },
  },
  plugins: [],
};
