import twTheme from 'tailwindcss/defaultTheme'
import plugin from 'tailwindcss/plugin'
import type { ResolvableTo, ScreensConfig } from 'tailwindcss/types/config'

type ScreenEntry = [screen: string, size: string]

/**
 * A Tailwind CSS component that shows the currently active screen (responsive breakpoint).
 *
 * Based on https://github.com/maxzz/tailwindcss-plugin-debug-screens
 * Usage: add class 'debug-screen' on body element
 */
const debugScreenPlugin = plugin(
  function ({ addComponents, theme }) {
    const screens = (theme('screens') || {}) as ResolvableTo<ScreensConfig>
    const userStyles = theme('debugScreens.style', {})
    const ignoredScreens = theme('debugScreens.ignore', ['dark'])
    const prefix = theme('debugScreens.prefix', 'screen: ')
    const selector = theme('debugScreens.selector', '.debug-screen')
    const printSize = theme('debugScreens.printSize', true)

    const defaultPosition = ['bottom', 'left']
    const position = theme('debugScreens.position', defaultPosition)
    const positionX = position[0] || defaultPosition[0]
    const positionY = position[1] || defaultPosition[1]

    const screenEntries = sortScreenEntries(screens).filter(
      ([screen]) => !ignoredScreens.includes(screen)
    )
    if (!screenEntries.length) {
      return
    }
    const lowestScreenName = screenEntries[0][0]
    const lowestScreenSize = printSize ? `(${screenEntries[0][1]})` : ''

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const components: Record<string, any> = {
      [`${selector}::before`]: Object.assign(
        {
          zIndex: '2147483647',
          position: 'fixed',
          [positionX]: '4px',
          [positionY]: '6px',
          padding: '.5em',
          fontSize: '12px',
          lineHeight: '1',
          fontFamily: 'sans-serif',
          color: '#ffffff',
          backgroundColor: '#131115',
          opacity: '0.8',
          border: 'none',
          borderRadius: '4px',
          boxShadow: '0 0 2px 2px #fff5',
          content: `'${prefix}less then ${lowestScreenName} ${lowestScreenSize}'`,
        },
        userStyles
      ),
    }

    screenEntries.forEach(([screen, size]) => {
      const printScreenSize = printSize ? ` (${size})` : ''
      components[`@screen ${screen}`] = {
        [`${selector}::before`]: { content: `'${prefix}${screen}${printScreenSize}'` },
      }
    })

    addComponents(components)
  },
  {
    theme: {
      screens: {
        xsm: '501px', // Chrome minimum screen size is 500px
        ...twTheme.screens,
      },
    },
  }
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sortScreenEntries(screens: any): ScreenEntry[] {
  const normalized = normalizeScreens(screens)
  const newScreens = extractScreenValues(normalized)
  newScreens.sort((a, b) => parseInt(a[1]) - parseInt(b[1]))
  return newScreens

  type NormalizeScreenValue = {
    min: string
    max: string | undefined
    raw?: string
  }

  type NormalizeScreen = {
    name: string
    not: boolean
    values: NormalizeScreenValue[]
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function normalizeScreens(screens: any, root = true): NormalizeScreen[] {
    if (Array.isArray(screens)) {
      return screens.map((screen) => {
        if (root && Array.isArray(screen)) {
          throw new Error('The tuple syntax is not supported for `screens`.')
        }

        if (typeof screen === 'string') {
          return { name: screen.toString(), not: false, values: [{ min: screen, max: undefined }] }
        }

        // eslint-disable-next-line prefer-const
        let [name, options] = screen
        name = name.toString()

        if (typeof options === 'string') {
          return { name, not: false, values: [{ min: options, max: undefined }] }
        }

        if (Array.isArray(options)) {
          return { name, not: false, values: options.map((option) => resolveValue(option)) }
        }

        return { name, not: false, values: [resolveValue(options)] }
      })
    }

    return normalizeScreens(Object.entries(screens ?? {}), false)

    function resolveValue({
      'min-width': _minWidth,
      min = _minWidth,
      max,
      raw,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }: any): NormalizeScreenValue {
      return { min, max, raw }
    }
  }

  function extractScreenValues(breakpoints: NormalizeScreen[] = []) {
    return breakpoints
      .flatMap((breakpoint) => breakpoint.values.map((brk) => [breakpoint.name, brk.min]))
      .filter((v) => v !== undefined) as ScreenEntry[]
  }
}

export default debugScreenPlugin
