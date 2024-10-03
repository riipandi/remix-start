import * as Lucide from 'lucide-react'
import { Theme, type ThemeType, useTheme } from '#/context/providers/theme-provider'
import { clx } from '#/utils/ui-helper'

export function ThemeSelector() {
  const [theme, setTheme] = useTheme()

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(event.target.value as ThemeType)
  }

  return (
    <div className="relative">
      <select
        value={theme || Theme.SYSTEM}
        onChange={handleThemeChange}
        className={clx(
          'w-full appearance-none rounded-lg border px-3 py-1.5 pr-8 text-sm focus:outline-none',
          'border-gray-300 bg-white text-gray-900 focus:border-primary-500',
          'dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-primary-400'
        )}
      >
        {Object.entries(Theme).map(([key, value]) => (
          <option key={value} value={value}>
            {key.charAt(0) + key.slice(1).toLowerCase()}
          </option>
        ))}
      </select>
    </div>
  )
}

export function ThemeSwitcher({ className }: { className?: string }) {
  const [theme, setTheme] = useTheme()

  const toggleTheme = () => {
    setTheme(theme === Theme.DARK ? Theme.LIGHT : Theme.DARK)
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={clx(
        '-m-2.5 rounded-lg p-2 text-gray-800 hover:text-white dark:text-gray-300',
        'hover:bg-gray-700 dark:hover:bg-gray-800',
        'transition-colors duration-200',
        className
      )}
    >
      {theme === Theme.DARK ? (
        <Lucide.MoonStar className="size-5" strokeWidth={1.8} />
      ) : (
        <Lucide.Sun className="size-5" strokeWidth={1.8} />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
