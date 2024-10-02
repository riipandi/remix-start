import { withTV } from 'tailwind-variants/transformer'
import colors from 'tailwindcss/colors'
import defaultTheme from 'tailwindcss/defaultTheme'

import type { Config } from 'tailwindcss'

const TailwindConfig: Config = {
  content: ['./app/**/{**,.client,.server}/**/*!(*.stories|*.spec).{js,jsx,ts,tsx}'],
  darkMode: ['class'],
  theme: {
    extend: {
      fontFamily: {
        sans: [...defaultTheme.fontFamily.sans],
        mono: [...defaultTheme.fontFamily.mono],
      },
      colors: {
        black: '#000d1a',
        gray: colors.neutral,
        primary: colors.indigo,
      },
    },
    debugScreens: {
      position: ['bottom', 'right'],
      borderTopLeftRadius: '4px',
      printSize: false,
      prefix: '',
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
    require('tailwind-debug-breakpoints'),
  ],
}

export default withTV(TailwindConfig)
