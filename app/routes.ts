/* @ref: https://reactrouter.com/start/framework/routing */

import { type RouteConfig, index } from '@react-router/dev/routes'

export default [
  index('./routes/home.tsx'),
  // route('/healthz', './routes/healthz.ts'),
] satisfies RouteConfig
