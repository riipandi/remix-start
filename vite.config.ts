/// <reference types="vitest" />

import { type VitePluginConfig, vitePlugin as remix } from '@remix-run/dev'
import { installGlobals } from '@remix-run/node'
import { flatRoutes } from 'remix-flat-routes'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig, loadEnv } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

installGlobals()

// @ref: https://remix.run/docs/en/main/future/vite#plugin-usage-with-other-vite-based-tools-eg-vitest-storybook
const isTestOrStorybook = process.env.NODE_ENV === 'test' || process.argv[1]?.includes('storybook')

const RemixConfig: VitePluginConfig = {
  ignoredRouteFiles: ['**/.*'],
  serverModuleFormat: 'esm',
  routes(defineRoutes) {
    return flatRoutes('routes', defineRoutes, {
      ignoredRouteFiles: ['.*', '**/*.css', '**/*.test.{js,jsx,ts,tsx}', '**/__*.*'],
    })
  },
}

export default defineConfig({
  plugins: [
    !isTestOrStorybook && remix(RemixConfig),
    visualizer({
      emitFile: true, // `emitFile` is necessary since Remix builds more than one bundle!
    }),
    tsconfigPaths(),
  ],
  server: {
    port: 3000,
  },
  test: {
    environment: 'happy-dom',
    // Additionally, this is to load ".env.test" during vitest
    env: loadEnv('test', process.cwd(), ''),
    setupFiles: ['./tests/setup-test.ts'],
    dir: './tests',
    globals: true,
  },
})
