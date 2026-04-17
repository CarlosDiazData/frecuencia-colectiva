/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#c50907',
        'primary-dark': '#991515',
      },
      fontFamily: {
        serif: ['Merriweather', 'Georgia', 'serif'],
        sans: ['Merriweather Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
