/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'green-deep': '#3b4a35',
        'green-mid': '#3b4a35',
        'green-light': '#3b4a35',
        gold: '#b8966a',
        'gold-light': '#d4b896',
        cream: '#f5f0e8',
        alabaster: '#ede8df',
        charcoal: '#3a3a3a',
        'soft-grey': '#7a7a7a',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        sans: ['Jost', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.3em',
        superwide: '0.5em',
      },
    },
  },
  plugins: [],
}
