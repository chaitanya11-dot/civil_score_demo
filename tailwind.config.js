/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f6f8f0',
          100: '#e7edd9',
          200: '#d1dbb8',
          300: '#b8c792',
          400: '#9fb06e',
          500: '#85994f',
          600: '#6f823f',
          700: '#5a6a33',
          800: '#48542c',
          900: '#3a4427',
          950: '#1e2413',
        },
      },
    },
  },
  plugins: [],
}