import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class BlogPage extends BasePage {
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly postTitles: Locator;

    constructor(page: Page) {
        super(page);
        this.searchInput = page.getByRole('searchbox').or(page.getByPlaceholder(/search/i)).or(page.locator('input[type="search"]'));
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.postTitles = page.locator('#results').getByRole('heading', { level: 3 }).or(page.getByRole('heading', { level: 3 }));
    }

    async search(term: string) {
        await this.searchInput.fill(term);
        await this.searchInput.press('Enter');
    }

    async verifySearchResults(searchTerm: string) {
        // Wait specifically for the results section to update
        await expect(this.page.locator('#results')).toContainText(`Results for ${searchTerm}`);
    }

    async verifyPageLoaded() {
        // Verify the blog page loaded by checking URL and visible content
        await expect(this.page).toHaveURL(/\/blog/);
        await expect(this.postTitles.first()).toBeVisible();
    }
}
