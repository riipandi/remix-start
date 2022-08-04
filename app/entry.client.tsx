import * as React from 'react'
import { RemixBrowser } from '@remix-run/react'
import { hydrateRoot } from 'react-dom/client'
import Plausible from 'plausible-tracker'

import { plausibleConfig } from '~/constants/analytics'

function hydrate() {
  const { trackPageview } = Plausible(plausibleConfig)

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
