import { test, expect } from '@playwright/test';
import { BlogPage } from '../pages/BlogPage';

test.describe('Feature Logic', () => {

    test('TC04: Verify Homepage Content stability', async ({ page }) => {
        const isMock = process.env.TEST_ENV === 'mock';
        await page.goto(isMock ? '/' : 'https://www.remotepass.com/');

        // Wait for page load
        await page.waitForLoadState('networkidle');

        // Verify "Compliance" text is visible (Core product feature)
        // This is highly stable and doesn't rely on complex selectors
        await expect(page.getByText(/Compliance/i).first()).toBeVisible({ timeout: 15000 });
        console.log('TC04: Homepage content (Compliance) verified');
    });

    test('TC05: Blog Dynamic Search', async ({ page }) => {
        const blogPage = new BlogPage(page);
        const isMock = process.env.TEST_ENV === 'mock';
        await blogPage.navigateTo(isMock ? '/blog.html' : '/blog');

        await blogPage.verifyPageLoaded();

        if (isMock) {
            await blogPage.search('Remote');
            await blogPage.verifySearchResults('Remote');
        }
    });
});
