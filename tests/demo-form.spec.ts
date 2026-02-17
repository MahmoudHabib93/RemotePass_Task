import { test, expect } from '@playwright/test';
import { BookDemoPage } from '../pages/BookDemoPage';

test.describe('Book a Demo Form', () => {
    let demoPage: BookDemoPage;

    test.beforeEach(async ({ page }) => {
        demoPage = new BookDemoPage(page);
        // Explicit mock handling for navigation
        const url = process.env.TEST_ENV === 'mock' ? '/book-demo.html' : '/book-a-demo';
        await demoPage.navigateTo(url);
    });

    test('TC03: Form Validation - Invalid Email', async ({ page }) => {
        await demoPage.fillForm({
            firstName: 'Test',
            lastName: 'User',
            email: 'invalid-email',
            company: 'QA Inc'
        });

        await demoPage.submit();

        // Mock Implementation specific validation
        await demoPage.verifyErrorVisible();
    });
});
