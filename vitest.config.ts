import { resolve } from 'pathe'
import { isCI } from 'std-env'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: ['node_modules', 'tests-e2e'],
    alias: { '#': resolve('app'), '~': resolve('public') },
    reporters: isCI ? ['html', 'github-actions'] : ['html', 'default'],
    outputFile: {
      json: './tests-results/vitest-results.json',
      html: './tests-results/index.html',
    },
    environment: 'happy-dom',
    setupFiles: ['./tests/setup-test.ts'],
    coverage: {
      provider: 'istanbul',
      reporter: ['html-spa', 'text-summary'],
      reportsDirectory: './tests-results/coverage',
      include: ['./tests/**/*.{test,spec}.{ts,tsx}'],
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
    globals: true,
  },
})
