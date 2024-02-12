import colors from 'tailwindcss/colors';
import defaultTheme from 'tailwindcss/defaultTheme';

import { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*!(*.stories|*.spec).{ts,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      fontFamily: {
        sans: [...defaultTheme.fontFamily.sans],
        mono: [...defaultTheme.fontFamily.mono],
      },
      colors: {
        black: '#000d1a',
        gray: colors.gray,
        primary: colors.indigo,
      },
    },
    debugScreens: {
      position: ['bottom', 'right'],
      printSize: true,
      prefix: '',
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
    require('./tw-plugins/debug-screen'),
  ],
} satisfies Config;
