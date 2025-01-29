/* @ref: https://reactrouter.com/start/framework/routing */

import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
  index('routes/home/page.tsx'),
  route('healthz', 'routes/healthz.ts'),
] satisfies RouteConfig
