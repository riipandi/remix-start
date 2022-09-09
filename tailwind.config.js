/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./app/**/*.{ts,tsx,jsx,js}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        mono: [...defaultTheme.fontFamily.mono],
      },
      colors: {
        gray: colors.slate,
        primary: {
          50: '#ecfdf3',
          100: '#d1fae1',
          200: '#a7f3c9',
          300: '#6ee7ac',
          400: '#34d38b',
          500: '#0fa968',
          600: '#05965c',
          700: '#04784c',
          800: '#065f3e',
          900: '#064e34',
        },
        secondary: colors.rose,
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography'),
  ],
}
