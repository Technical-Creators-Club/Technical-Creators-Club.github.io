import { test, expect } from '@playwright/test';

/**
 * Navigation tests — verify all internal nav links resolve without errors.
 * These tests should always pass.
 */

const NAV_LINKS = [
  { name: 'Home',       path: '/' },
  { name: 'Categories', path: '/categories/' },
  { name: 'Tags',       path: '/tags/' },
  { name: 'About',      path: '/about/' },
];

for (const { name, path } of NAV_LINKS) {
  test(`navigation: "${name}" page loads without error`, async ({ page }) => {
    const response = await page.goto(path);

    expect(
      response?.status(),
      `"${name}" (${path}) returned HTTP ${response?.status()}`
    ).toBeLessThan(400);

    // Page should have a meaningful title
    const title = await page.title();
    expect(title.trim().length).toBeGreaterThan(0);
  });
}

test('nav bar contains all expected links', async ({ page }) => {
  await page.goto('/');

  for (const { name, path } of NAV_LINKS) {
    // External "Contribute" link is excluded — it points to GitHub
    const link = page.locator(`nav a[href="${path}"], header a[href="${path}"]`).first();
    await expect(link, `Nav link "${name}" not found`).toBeVisible();
  }
});

test('post links on home page are all internal and reachable', async ({ page }) => {
  await page.goto('/');

  const postLinks = await page.locator('a[href*="/20"]').all();
  expect(postLinks.length).toBeGreaterThan(0);

  for (const link of postLinks.slice(0, 5)) { // check first 5 to keep test fast
    const href = await link.getAttribute('href');
    if (!href || href.startsWith('http')) continue;

    const response = await page.request.get(href);
    expect(
      response.status(),
      `Post link "${href}" returned HTTP ${response.status()}`
    ).toBeLessThan(400);
  }
});
