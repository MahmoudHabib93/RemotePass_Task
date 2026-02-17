import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class BookDemoPage extends BasePage {
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly emailInput: Locator;
    readonly companyInput: Locator;
    readonly submitButton: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        super(page);

        const isMock = process.env.TEST_ENV === 'mock';
        const frame = this.page.frameLocator('iframe[title*="HubSpot"], iframe').first();

        // Helper to find input by multiple strategies (label, placeholder, name) 
        // We separate mock (page) vs live (frame) targets because Playwright 
        // doesn't allow mixing frame and page locators in .or()
        const getField = (label: string, placeholder: RegExp, name: string) => {
            if (isMock) {
                return this.page.getByLabel(label)
                    .or(this.page.getByPlaceholder(placeholder))
                    .or(this.page.locator(`input[name="${name}"]`)).first();
            } else {
                return frame.getByLabel(label)
                    .or(frame.getByPlaceholder(placeholder))
                    .or(frame.locator(`input[name="${name}"]`)).first();
            }
        };

        this.firstNameInput = getField('First Name', /First Name/i, 'firstname');
        this.lastNameInput = getField('Last Name', /Last Name/i, 'lastname');
        this.emailInput = getField('Work Email', /Email/i, 'email');
        this.companyInput = getField('Company Name', /Company/i, 'company');

        if (isMock) {
            this.submitButton = this.page.getByRole('button', { name: /Submit|Book/i }).first();
            this.errorMessage = this.page.locator('.error-message').or(this.page.getByRole('alert')).first();
        } else {
            this.submitButton = frame.getByRole('button', { name: /Get started|Submit|Book/i }).first();
            this.errorMessage = frame.locator('.hs-error-msg, .error-message, :invalid').or(frame.getByRole('alert')).first();
        }
    }

    async fillForm(userData: { firstName: string, lastName: string, email: string, company: string }) {
        // Wait for either the page-level field or the iframe to be ready
        await Promise.race([
            this.firstNameInput.waitFor({ state: 'visible', timeout: 10000 }).catch(() => { }),
            this.page.waitForLoadState('load')
        ]);

        await this.firstNameInput.fill(userData.firstName);
        await this.lastNameInput.fill(userData.lastName);
        await this.emailInput.fill(userData.email);
        await this.companyInput.fill(userData.company);
    }

    async submit() {
        await this.submitButton.click();
    }

    async verifyErrorVisible() {
        await expect(this.errorMessage).toBeVisible();
    }
}
