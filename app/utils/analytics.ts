import Plausible from 'plausible-tracker'

export const plausibleConfig = {
  apiHost: 'https://stats.web.id',
  domain: 'prismix.fly.dev',
  trackLocalhost: false,
}

const { trackPageview, trackEvent } = Plausible(plausibleConfig)

export { Plausible, trackEvent,trackPageview }
