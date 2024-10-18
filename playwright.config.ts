import 'dotenv/config'
import path from 'node:path'
import { defineConfig, devices } from '@playwright/test'

export const STORAGE_STATE = path.join(import.meta.dirname, '.playwright/user.json')

/**
 * Reference: https://playwright.dev/docs/test-configuration
 * Example: https://dev.to/this-is-learning/playwright-lets-start-2mdj
 */
export default defineConfig({
  quiet: !!process.env.CI,
  testDir: './tests-e2e',
  outputDir: './tests-results/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never', outputFolder: './tests-results/e2e' }], ['list']],
  use: {
    baseURL: process.env.URL || 'http://127.0.0.1:3000',
    ...devices['Desktop Chrome'],
    defaultBrowserType: 'chromium',
    colorScheme: 'no-preference',
    locale: 'en-US',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    launchOptions: {
      slowMo: 1000, // a 1000 milliseconds pause before each operation. Useful for slow systems.
    },
  },
  /* Configure projects for major browsers */
  projects: [
    { name: 'Chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'Firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'Safari', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
  ],
  /* Run your local dev server before starting the tests */
  webServer: process.env.URL
    ? undefined
    : {
        command: 'pnpm run build && pnpm run preview',
        reuseExistingServer: !process.env.CI,
        timeout: 30_000,
        port: 3000,
      },
})
