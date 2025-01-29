import { expect, test } from '@playwright/test'

test.describe('@feature-default', () => {
  test('has title', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Remix Start/)
  })

  test('contain title', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Hello from Express' })).toBeVisible()
  })
})
