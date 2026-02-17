import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigateTo(path: string = '/') {
        await this.page.goto(path);
        await this.page.waitForLoadState('load');
        await this.page.waitForLoadState('networkidle');
    }

    async getByRoleHelper(role: any, name: string) {
        return this.page.getByRole(role, { name: name });
    }

    async verifyTitle(title: string) {
        await expect(this.page).toHaveTitle(new RegExp(title));
    }

    async verifyUrl(urlPart: string) {
        await expect(this.page).toHaveURL(new RegExp(urlPart));
    }
}
