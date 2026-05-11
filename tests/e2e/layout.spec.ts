import { test, expect, devices } from '@playwright/test';

/**
 * Layout & responsiveness tests.
 *
 * Two of these tests are INTENTIONALLY FAILING — they document known bugs
 * that are open for contributors to fix:
 *
 *   🐛 #13 — Mobile horizontal scroll  → tests/e2e/layout.spec.ts (mobile overflow tests)
 *   🐛 #12 — TOC hidden behind code block → tests/e2e/layout.spec.ts (toc z-index test)
 *
 * Fix the underlying CSS, make the tests pass, and open a PR!
 */

// The article that has both a TOC sidebar and code snippets (used for bug #12)
const ARTICLE_WITH_CODE = '/tools/dx/2026/04/09/top-dev-tools-2026.html';

// ─── Bug #13 — Mobile horizontal scroll ─────────────────────────────────────

test.describe('Mobile viewport — no horizontal overflow', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE

  test('home page has no horizontal scroll @bug-13', async ({ page }) => {
    await page.goto('/');

    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));

    expect(
      scrollWidth,
      `Page scrollWidth (${scrollWidth}px) exceeds clientWidth (${clientWidth}px) — horizontal overflow detected. See issue #13.`
    ).toBeLessThanOrEqual(clientWidth);
  });

  test('article page has no horizontal scroll @bug-13', async ({ page }) => {
    await page.goto(ARTICLE_WITH_CODE);

    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));

    expect(
      scrollWidth,
      `Article scrollWidth (${scrollWidth}px) exceeds clientWidth (${clientWidth}px) — horizontal overflow detected. See issue #13.`
    ).toBeLessThanOrEqual(clientWidth);
  });
});

// ─── Bug #12 — TOC sidebar hidden behind code block ─────────────────────────

test.describe('Article page — TOC sidebar stacking order', () => {
  test('TOC sidebar is rendered above code blocks @bug-12', async ({ page }) => {
    await page.goto(ARTICLE_WITH_CODE);

    const tocSidebar = page.locator('#toc-sidebar');
    await expect(tocSidebar).toBeVisible();

    // Scroll to first code block to trigger the stacking bug
    const firstCodeBlock = page.locator('.post-content pre').first();
    await firstCodeBlock.scrollIntoViewIfNeeded();

    // The TOC sidebar must remain visible and not be obscured.
    // We check its effective z-index is higher than the code block's.
    const { tocZ, codeZ } = await page.evaluate(() => {
      const toc = document.getElementById('toc-sidebar')!;
      const code = document.querySelector('.post-content pre') as HTMLElement;
      return {
        tocZ: parseInt(window.getComputedStyle(toc).zIndex) || 0,
        codeZ: parseInt(window.getComputedStyle(code).zIndex) || 0,
      };
    });

    expect(
      tocZ,
      `TOC z-index (${tocZ}) is not greater than code block z-index (${codeZ}). TOC will be hidden. See issue #12.`
    ).toBeGreaterThan(codeZ);
  });

  test('TOC sidebar is clickable after scrolling past a code block @bug-12', async ({ page }) => {
    await page.goto(ARTICLE_WITH_CODE);

    // Scroll past code blocks
    await page.evaluate(() => window.scrollBy(0, 600));
    await page.waitForTimeout(300);

    const tocSidebar = page.locator('#toc-sidebar');

    // The sidebar must still be visible and interactable
    await expect(tocSidebar).toBeVisible();

    // Check no element is covering the TOC at its center point
    const isClickable = await tocSidebar.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const topEl = document.elementFromPoint(cx, cy);
      return topEl !== null && (topEl === el || el.contains(topEl));
    });

    expect(
      isClickable,
      'TOC sidebar is being covered by another element — it cannot be clicked. See issue #12.'
    ).toBe(true);
  });
});

// ─── General layout — always expected to pass ────────────────────────────────

test.describe('General layout', () => {
  test('home page renders the post list', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('article, .post-card, .post-list')).not.toHaveCount(0);
  });

  test('article page renders the TOC sidebar', async ({ page }) => {
    await page.goto(ARTICLE_WITH_CODE);
    await expect(page.locator('#toc-sidebar')).toBeVisible();
  });

  test('article page renders the post content', async ({ page }) => {
    await page.goto(ARTICLE_WITH_CODE);
    await expect(page.locator('.post-content')).toBeVisible();
  });
});
