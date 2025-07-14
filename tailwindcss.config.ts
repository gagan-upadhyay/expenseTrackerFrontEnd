/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",         // App Router pages
    "./components/**/*.{ts,tsx}"   // Shared UI components
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#2f556f",
          active: "#233947",
        },
      },
    },
  },
  plugins: [],
};