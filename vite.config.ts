/// <reference types="vitest" />

import { type VitePluginConfig, vitePlugin as remix } from '@remix-run/dev'
import { installGlobals } from '@remix-run/node'
import { flatRoutes } from 'remix-flat-routes'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig, loadEnv } from 'vite'
import inspect from 'vite-plugin-inspect'
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
    inspect({ build: false, open: false }),
    // `emitFile` is necessary since Remix builds more than one bundle!
    visualizer({ emitFile: true }),
    tsconfigPaths(),
  ],
  server: { port: 3000 },
  clearScreen: true,
  test: {
    environment: 'happy-dom',
    // Additionally, this is to load ".env.test" during vitest
    env: loadEnv('test', process.cwd(), ''),
    setupFiles: ['./tests/setup-test.ts'],
    includeSource: ['./app/**/*.{ts,tsx}'],
    exclude: ['node_modules', 'tests-e2e'],
    reporters: process.env.CI ? ['json'] : ['default', 'html'],
    outputFile: {
      json: './tests-results/vitest-results.json',
      html: './tests-results/index.html',
    },
    coverage: {
      provider: 'v8',
      reporter: process.env.CI ? ['json'] : ['html-spa', 'hanging-process'],
      reportsDirectory: './tests-results/coverage',
      cleanOnRerun: true,
      clean: true,
    },
    dir: './tests',
    globals: true,
  },
})
