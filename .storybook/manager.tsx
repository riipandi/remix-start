/* @ref: https://storybook.js.org/docs/configure/user-interface/theming/ */

import type { CSSProperties } from 'react'
import * as React from 'react'
import { addons } from 'storybook/manager-api'
import { dark, light, listenToColorScheme, type Theme } from './themes'

type BadgeConfig = {
  style: CSSProperties
  label: string
}

const badges = {
  'status:new-item': {
    label: 'New Item',
    style: {
      color: '#ffffff',
      backgroundColor: '#3b82f6',
      borderColor: '#60a5fa',
    },
  },
  'status:experimental': {
    label: 'Experimental',
    style: {
      color: '#ffffff',
      backgroundColor: '#f97316',
      borderColor: '#fb923c',
    },
  },
  'status:under-review': {
    label: 'Under Review',
    style: {
      color: '#f0fdf5',
      backgroundColor: '#16a34a',
      borderColor: '#22c55e',
    },
  },
  'status:legacy': {
    label: 'Legacy',
    style: {
      color: '#fdf6fc',
      backgroundColor: '#9a317f',
      borderColor: '#c149a4',
    },
  },
  'status:deprecated': {
    label: 'Deprecated',
    style: {
      color: '#ffffff',
      backgroundColor: '#dc2626',
      borderColor: '#ef4444',
    },
  },
} satisfies Record<string, BadgeConfig>

addons.setConfig({
  isFullscreen: false,
  showPanel: true,
  showToolbar: true,
  panelPosition: 'bottom',
  sidebar: {
    filters: {
      patterns: (item) => {
        return !item.tags?.includes('hidden')
      },
    },
    renderLabel(item) {
      if (item.type !== 'component') {
        return item.name
      }

      let badge: BadgeConfig | undefined

      for (const tag of item.tags) {
        badge = badges[tag]
        if (badge) {
          break
        }
      }

      if (!badge) {
        return item.name
      }

      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '1rem',
            flex: 1,
          }}
        >
          <span>{item.name}</span>
          <span
            style={{
              ...badge.style,
              display: 'inline-block',
              padding: '2px 6px',
              fontSize: '12px',
              lineHeight: '1',
              textAlign: 'center',
              borderRadius: '10px',
              borderWidth: '1px',
              borderStyle: 'solid',
            }}
          >
            {badge.label}
          </span>
        </div>
      )
    },
  },
})

/**
 * Switch color scheme based on the global types or system preferences
 */
addons.register('color-scheme', (api) => {
  const setTheme = (theme: Theme) => {
    // Handle system theme preference
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const isDark = mediaQuery.matches
      api.setOptions({ theme: isDark ? dark : light })
      document.documentElement.dataset.theme = isDark ? 'dark' : 'light'
      return
    }

    // Handle explicit theme selection
    api.setOptions({ theme: theme === 'dark' ? dark : light })
    document.documentElement.dataset.theme = theme
  }

  listenToColorScheme(api, setTheme)
})
