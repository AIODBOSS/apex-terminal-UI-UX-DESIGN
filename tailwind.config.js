/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // We define our custom "Bloomberg" colors here
        'terminal-black': '#050505',
        'terminal-green': '#00ff94',
        'terminal-red': '#ff0055',
      }
    },
  },
  plugins: [],
}