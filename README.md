# RemotePass QA Automation Assessment

![Playwright Tests](https://github.com/MahmoudHabib93/RemotePass_Task/actions/workflows/playwright.yml/badge.svg)

This repository contains a professional Playwright + TypeScript automation framework designed for the RemotePass platform assessment.

## Project Structure
- `tests/`: Feature-grouped test specifications (TC01-TC07).
- `pages/`: Reusable Page Object Models (POM) inheriting from `BasePage`.
- `mocks/`: Lightweight local environment for testing logic isolation.
- `playwright.config.ts`: Optimized project configuration for stability.

## Requirements Coverage
- **Framework**: Scalable Playwright + TypeScript setup with POM.
- **Stability**: Hardened locators and 60s timeout buffer; single-worker execution to prevent resource contention.
- **Asynchronous Handling**: Strict usage of standard Playwright wait states (`networkidle`, `isVisible`, etc.).
- **Network Validation**: Includes listeners for console errors and critical network request stability.
- **Constraint**: Exactly **7 sequenced test cases** implemented.

## Final Test Suite (TC01-TC07)
1. **TC01: Global Navigation** - Validated navigation to critical paths (Pricing).
2. **TC02: Broken Link Scanner** - Automated crawl of the homepage for 404/broken links.
3. **TC03: Form Validation** - Error handling checks on the "Book a Demo" HubSpot form (iframe-ready).
4. **TC04: Content Stability** - Verification of core branding and content on the homepage.
5. **TC05: Blog Dynamic Search** - Functional test of the blog search and results rendering.
6. **TC06: Network Listener** - Monitoring for critical console errors and failed API requests.
7. **TC07: API Validation** - Verification of API endpoint response integrity.

## Setup & Execution

### 1. Install Dependencies
```bash
npm install
npx playwright install --with-deps chromium
```

### 2. Run Tests
- **All Tests (Live Site)**:
    ```bash
    $env:TEST_ENV='live'; npx playwright test
    ```
- **All Tests (Mock Environment)**:
    ```bash
    $env:TEST_ENV='mock'; npx playwright test
    ```

### 3. View Results
- **Allure Report**:
    ```bash
    npx allure generate allure-results --clean -o allure-report
    npx allure open allure-report
    ```
- **Playwright HTML Report**:
    ```bash
    npx playwright show-report
    ```

## Design Decisions
- **Single Worker**: Configured `workers: 1` to ensure maximum stability on various hardware environments and prevent browser context crashes.
- **Iframe Handling**: Specialized frame locators for HubSpot-integrated forms.
- **Network Filtering**: Ignored non-critical third-party tracing scripts to focus on platform stability.
