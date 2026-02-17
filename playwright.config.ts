import { defineConfig, devices } from '@playwright/test';
import path from 'path';

const isMock = process.env.TEST_ENV === 'mock';

const config = defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: 1,
    reporter: [['html'], ['allure-playwright']],

    // WebServer config to serve mocks
    webServer: isMock ? {
        command: 'npx http-server mocks -p 3000',
        port: 3000,
        reuseExistingServer: !process.env.CI,
    } : undefined,

    use: {
        // Switch base URL based on environment
        baseURL: isMock ? 'http://localhost:3000' : 'https://www.remotepass.com',
        trace: 'on-first-retry',
        video: 'on-first-retry',
        screenshot: 'only-on-failure',
    },

    timeout: 60000,
    expect: {
        timeout: 60000,
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
});

export default config;
