import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

const isMock = process.env.TEST_ENV === 'mock';

test.describe('Navigation & Stability', () => {
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        await homePage.navigateTo('/');
    });

    test('TC01: Verify Global Navigation to Pricing', async ({ page }) => {
        await homePage.goToPricing();
        // Adjust assertion for mock extension
        if (isMock) {
            await expect(page).toHaveURL(/.*pricing\.html/);
            await expect(page).toHaveTitle(/Pricing/i);
        } else {
            await expect(page).toHaveURL(/.*pricing/);
        }
    });

    test('TC02: Automated Broken Link Scanner', async ({ page, request }) => {
        // Collect all links on the homepage
        // In mock: scanning local links
        const links = await page.locator('a[href]').evaluateAll((elements: HTMLAnchorElement[]) =>
            elements.map(el => el.getAttribute('href')).filter((href): href is string => href !== null)
        );
        const uniqueLinks = [...new Set(links)];

        console.log(`Scanning ${uniqueLinks.length} links...`);

        for (const link of uniqueLinks.slice(0, 10)) {
            if (link && !link.startsWith('#')) {
                // Handle relative links in mock environment
                const urlToFetch = (isMock && !link.startsWith('http'))
                    ? `http://localhost:3000/${link}`
                    : link;

                try {
                    const response = await request.head(urlToFetch);
                    expect(response.status(), `Link failed: ${urlToFetch}`).toBeLessThan(404);
                } catch (e) {
                    // Ignore external link failures in mock env if offline
                    if (!isMock) throw e;
                }
            }
        }
    });


});
