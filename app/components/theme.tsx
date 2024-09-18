import { Theme, type ThemeType, useTheme } from '#/context/providers/theme-provider'
import { clx } from '#/utils/ui-helper'

export default function ThemeSwitcher() {
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
