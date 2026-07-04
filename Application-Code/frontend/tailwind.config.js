/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1B633E',
        secendory: '#3558A9',
        accent: '#01B3D7'
      }
    },
  },
  plugins: [],
}