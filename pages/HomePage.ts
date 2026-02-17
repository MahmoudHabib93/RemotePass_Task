import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
    readonly pricingLink: Locator;
    readonly productLink: Locator;
    readonly solutionsLink: Locator;
    readonly bookDemoButton: Locator;

    constructor(page: Page) {
        super(page);
        // Use specific navigation container to avoid matching footer links
        const nav = page.getByRole('navigation').first();
        this.pricingLink = nav.getByRole('link', { name: 'Pricing' });
        this.productLink = nav.getByRole('button', { name: 'Product' });
        this.solutionsLink = nav.getByRole('button', { name: 'Solutions' });
        this.bookDemoButton = page.getByRole('link', { name: 'Book a demo' }).first();
    }

    async goToPricing() {
        await this.pricingLink.click();
        await this.page.waitForURL(/.*pricing/);
    }

    async clickBookDemo() {
        await this.bookDemoButton.click();
    }
}
