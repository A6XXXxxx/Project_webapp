/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    // "./src/**/*.{js,jsx,ts,tsx}",
    "./src/HomePage/**/*.{js,jsx}", 

  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui'),],
}

