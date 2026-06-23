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
          DEFAULT: '#5B4DFF',
          hover: '#4A3EE0',
          light: '#EEECFF',
        },
        background: '#F8FAFC',
        card: '#FFFFFF',
      },
      borderRadius: {
        'card': '16px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
