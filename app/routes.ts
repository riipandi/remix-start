/* @ref: https://reactrouter.com/start/framework/routing */

import { index, type RouteConfig, route } from '@react-router/dev/routes'

export default [
  index('routes/home/page.tsx'),
  route('healthz', 'routes/healthz/route.ts'),
] satisfies RouteConfig
