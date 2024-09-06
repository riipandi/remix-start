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
    // `emitFile` is necessary since Remix builds more than one bundle!
    !process.env.CI && visualizer({ emitFile: true, template: 'treemap' }),
    inspect({ build: false, open: false }),
    tsconfigPaths(),
  ],
  server: { port: 3000 },
  clearScreen: true,
  test: {
    environment: 'happy-dom',
    // Additionally, this is to load ".env.test" during vitest
    env: loadEnv('test', process.cwd(), ''),
    setupFiles: ['./tests/setup-test.ts'],
    includeSource: ['./app/**/*.{js,jsx,ts,tsx}'],
    exclude: ['node_modules', 'tests-e2e'],
    reporters: process.env.CI ? ['html', 'github-actions'] : ['html', 'default'],
    outputFile: {
      json: './tests-results/vitest-results.json',
      html: './tests-results/index.html',
    },
    coverage: {
      provider: 'istanbul',
      reporter: ['html-spa', 'text-summary'],
      reportsDirectory: './tests-results/coverage',
      include: ['app/**/*.{js,jsx,ts,tsx}'],
      cleanOnRerun: true,
      clean: true,
      thresholds: {
        global: {
          statements: 80,
          branches: 70,
          functions: 75,
          lines: 80,
        },
      },
    },
    dir: './tests',
    globals: true,
  },
})
