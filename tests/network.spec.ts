import { test, expect } from '@playwright/test';

test.describe('Network & Performance', () => {
    let consoleErrors: string[] = [];
    let failedRequests: string[] = [];

    test.beforeEach(async ({ page }) => {
        consoleErrors = [];
        failedRequests = [];

        // Listen for console errors
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            }
        });

        // Listen for failed requests
        page.on('requestfailed', request => {
            const url = request.url();
            const failure = request.failure();
            const errorText = failure ? failure.errorText : 'Unknown Error';

            // Filter out non-critical failures
            const isAborted = errorText.includes('ERR_ABORTED');
            const isBlockedByORB = errorText.includes('ERR_BLOCKED_BY_ORB');
            const isAnalytics = /google-analytics|googletagmanager|google\.com\/ccm|appspot\.com|reb2b\.js/.test(url);

            if (!isAborted && !isBlockedByORB && !isAnalytics) {
                failedRequests.push(`${url} ${errorText}`);
            }
        });
    });

    test('TC06: Console Error & Network Listener', async ({ page }) => {
        const isMock = process.env.TEST_ENV === 'mock';
        const url = isMock ? 'http://localhost:3000/' : 'https://www.remotepass.com/';

        await test.step('Navigate to "/"', async () => {
            await page.goto(url, { waitUntil: 'load' });
        });

        // Wait a bit for async trackers to fire
        await page.waitForTimeout(2000);

        await test.step('Found Console Errors', async () => {
            expect(consoleErrors, `Console Errors found: ${consoleErrors.join(', ')}`).toEqual([]);
        });

        await test.step('Found Failed Network Requests', async () => {
            expect(failedRequests, `Failed Network Requests found: ${failedRequests.join(', ')}`).toEqual([]);
        });
    });
});
