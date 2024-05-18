import { test, expect } from '@playwright/test';

test.describe('example test', () => {
  test('should work', async ({ page }) => {
    await page.goto('https://example.com');
    const title = await page.title();
    expect(title).toBe('Example Domain');
  });
});
