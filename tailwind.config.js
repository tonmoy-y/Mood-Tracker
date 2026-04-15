/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Avenir Next', 'Nunito Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Iowan Old Style', 'Palatino Linotype', 'Palatino', 'serif'],
      },
    },
  },
  plugins: [],
}

