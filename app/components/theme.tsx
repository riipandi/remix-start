import { Theme, useTheme } from '#/context/providers/theme-provider'

export default function ThemeSwitcher() {
  const [, setTheme] = useTheme()
  return (
    <div className="flex flex-wrap justify-center gap-4 rounded-2xl p-1">
      <button
        type="button"
        className="rounded-xl border-2 border-gray-900 bg-white px-4 py-1 text-gray-900 text-sm"
        onClick={() => setTheme(Theme.LIGHT)}
      >
        Light
      </button>
      <button
        type="button"
        className="rounded-xl border-2 border-gray-50 bg-gray-900 px-4 py-1 text-gray-50 text-sm"
        onClick={() => setTheme(Theme.DARK)}
      >
        Dark
      </button>
    </div>
  )
}
