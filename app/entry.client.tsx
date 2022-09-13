import * as React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { RemixBrowser } from '@remix-run/react'

import { Plausible, plausibleConfig, trackPageview } from '@/utils/analytics'

function hydrate() {
  React.startTransition(() => {
    hydrateRoot(
      document,
      <React.StrictMode>
        <RemixBrowser />
      </React.StrictMode>,
    )
  })

  Plausible(plausibleConfig)
  trackPageview()
}

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate)
} else {
  window.setTimeout(hydrate, 1)
}
