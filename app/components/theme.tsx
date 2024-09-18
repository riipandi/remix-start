import { useState } from 'react'
import { Theme, useTheme } from '#/context/providers/theme-provider'
import { clx } from '#/utils/ui-helper'

const themes = [
  { id: Theme.LIGHT, name: 'Light' },
  { id: Theme.DARK, name: 'Dark' },
  { id: Theme.SYSTEM, name: 'System' },
] as const

type ThemeOption = (typeof themes)[number]

export default function ThemeSwitcher() {
  const [theme, setTheme] = useTheme()
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption>(
    themes.find((t) => t.id === theme) || themes[0]
  )

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = themes.find((theme) => theme.id === (event.target.value as Theme))
    if (newTheme) {
      setSelectedTheme(newTheme)
      setTheme(newTheme.id)
    }
  }

  return (
    <div className="relative">
      <select
        value={selectedTheme.id}
        onChange={handleThemeChange}
        className={clx(
          'w-full appearance-none rounded-lg border px-3 py-1.5 pr-8 text-sm focus:outline-none',
          'border-gray-300 bg-white text-gray-900 focus:border-primary-500',
          'dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-primary-400'
        )}
      >
        {themes.map((theme) => (
          <option key={theme.id} value={theme.id}>
            {theme.name}
          </option>
        ))}
      </select>
    </div>
  )
}
