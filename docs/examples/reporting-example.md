# Playwright Reporting Example

This example demonstrates how to use Playwright's built-in reporting features.

## 1. Configuration

Ensure `playwright.config.ts` is configured for HTML reporting.

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
```

## 2. Using Steps for Better Reports

Use the `@step` decorator in your Steps classes to create readable reports.

```typescript
import { Page } from "@playwright/test";
import { WikipediaLoginPage } from "../pages/WikipediaLoginPage";
import { step } from "../../utils/Decorators";

export class WikipediaLoginSteps {
    readonly wikipediaLoginPage: WikipediaLoginPage;

    constructor(page: Page) {
        this.wikipediaLoginPage = new WikipediaLoginPage(page);
    }

    @step("Login with {0}")
    async login(username: string, password: string): Promise<void> {
        await this.wikipediaLoginPage.enterUsername(username);
        await this.wikipediaLoginPage.enterPassword(password);
        await this.wikipediaLoginPage.clickLogin();
    }
}
```

## 3. Attaching Screenshots Manually

You can attach screenshots manually if needed (though Playwright handles failures automatically).

```typescript
import { test } from '@playwright/test';
import { step } from "../../utils/Decorators";

export class BaseSteps {
    constructor(protected page: Page) {}

    @step("Take screenshot")
    async takeScreenshot(name: string): Promise<void> {
        const screenshot = await this.page.screenshot();
        await test.info().attach(name, { body: screenshot, contentType: 'image/png' });
    }
}
```

## 4. Viewing the Report

Run the following command after test execution:

```bash
npx playwright show-report
```

This opens the HTML report where you can see:
-   Test execution timeline
-   Steps hierarchy
-   Screenshots and videos
-   Traces (DOM snapshots, network logs)
