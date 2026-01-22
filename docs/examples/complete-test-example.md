# Complete Test Example

This example demonstrates a full test implementation using:
1.  **Page Objects** (Atomic actions)
2.  **Steps Classes** (Business logic with composite methods)
3.  **Fixtures** (Dependency injection)
4.  **Playwright Test** (Execution)

## 1. Page Object (`tests/pages/WikipediaCreateAccountPage.ts`)

```typescript
import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class WikipediaCreateAccountPage extends BasePage {
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly confirmPasswordInput: Locator;
    private readonly createAccountButton: Locator;

    constructor(page: Page) {
        super(page, page.locator("input#wpName2"), "WikipediaCreateAccountPage");
        this.usernameInput = page.locator("input#wpName2").describe("Username input");
        this.passwordInput = page.locator("input#wpPassword2").describe("Password input");
        this.confirmPasswordInput = page.locator("input#wpRetype").describe("Confirm password input");
        this.createAccountButton = page.locator("button#wpCreateaccount").describe("Create account button");
    }

    async enterUsername(username: string): Promise<void> {
        await this.elementToBeVisible(this.usernameInput);
        await this.usernameInput.fill(username);
    }

    async enterPassword(password: string): Promise<void> {
        await this.elementToBeVisible(this.passwordInput);
        await this.passwordInput.fill(password);
    }

    async enterConfirmPassword(password: string): Promise<void> {
        await this.elementToBeVisible(this.confirmPasswordInput);
        await this.confirmPasswordInput.fill(password);
    }

    async clickCreateAccount(): Promise<void> {
        await this.elementToBeVisible(this.createAccountButton);
        await this.createAccountButton.click();
    }
}
```

## 2. Steps Class (`tests/steps/WikipediaCreateAccountSteps.ts`)

```typescript
import { Page } from "@playwright/test";
import { WikipediaCreateAccountPage } from "../pages/WikipediaCreateAccountPage";
import { WikipediaGetStartedPopupPage } from "../pages/WikipediaGetStartedPopupPage";
import { step } from "../../utils/Decorators";

export class WikipediaCreateAccountSteps {
    readonly wikipediaCreateAccountPage: WikipediaCreateAccountPage;
    readonly wikipediaGetStartedPopupPage: WikipediaGetStartedPopupPage;

    // ✅ Dependency Injection via Constructor
    constructor(
        private wikipediaCreateAccountPage: WikipediaCreateAccountPage,
        private wikipediaGetStartedPopupPage: WikipediaGetStartedPopupPage
    ) {}

    @step('Verify Create Account page is opened')
    async verifyPageOpened(): Promise<void> {
        await this.wikipediaCreateAccountPage.verifyPageOpened();
    }

    // ✅ Composite method: combines related actions
    @step('Fill account creation form with username "{0}"')
    async fillAccountForm(username: string, password: string): Promise<void> {
        await this.wikipediaCreateAccountPage.enterUsername(username);
        await this.wikipediaCreateAccountPage.enterPassword(password);
        await this.wikipediaCreateAccountPage.enterConfirmPassword(password);
    }

    @step('Click "Create your account"')
    async clickCreateAccount(): Promise<void> {
        await this.wikipediaCreateAccountPage.clickCreateAccount();
    }

    // ✅ Composite method: verify + dismiss + verify closed
    @step('Verify and dismiss "Get started here" popup with text "{0}"')
    async verifyAndDismissGetStartedPopup(expectedText: string): Promise<void> {
        await this.wikipediaGetStartedPopupPage.verifyPopupVisible();
        await this.wikipediaGetStartedPopupPage.verifyPopupContainsText(expectedText);
        await this.wikipediaGetStartedPopupPage.clickGotIt();
        await this.wikipediaGetStartedPopupPage.verifyPopupHidden();
    }
}
```

## 3. Fixtures (`tests/fixtures/steps.fixture.ts`)

The framework separates Page Object creation from Steps creation.

```typescript
import { test as apiTest } from "./api.fixture";
import { WikipediaCreateAccountSteps } from "../steps/WikipediaCreateAccountSteps";

type StepsFixtures = {
    wikipediaCreateAccountSteps: WikipediaCreateAccountSteps;
};

// Extend apiTest (which extends pagesTest)
export const test = apiTest.extend<StepsFixtures>({
    // Inject existing Page Objects into Step Classes
    wikipediaCreateAccountSteps: async ({ wikipediaCreateAccountPage, wikipediaGetStartedPopupPage }, use) => {
        await use(new WikipediaCreateAccountSteps(wikipediaCreateAccountPage, wikipediaGetStartedPopupPage));
    },
});
```

## 4. Test Spec (`tests/specs/wikipedia-create-account.spec.ts`)

```typescript
import { test, expect } from '@playwright/test';
import { testDataGenerator } from '../../utils/TestDataGenerator';
// Import fixture that combines everything
import { test as base } from '../fixtures';

test.describe('Wikipedia Account Creation', () => {
    // Test constants - no magic values!
    const MIN_PASSWORD_LENGTH = 12;
    const GET_STARTED_POPUP_MESSAGE = 'Click on your username to visit your homepage.';

    test('Successful account creation on Wikipedia', async ({
        wikipediaLandingSteps,
        wikipediaMainSteps,
        wikipediaNavigationSteps,
        wikipediaCreateAccountSteps
    }) => {
        // Generate random credentials
        const randomUsername = testDataGenerator.randomUsername();
        const randomPassword = testDataGenerator.randomPassword(MIN_PASSWORD_LENGTH);

        // Step 1: Open Wikipedia landing page
        await wikipediaLandingSteps.openAndVerify();

        // Step 2: Click English to go to main page
        await wikipediaLandingSteps.selectEnglishAndVerifyMainPage();

        // Step 3: Click "Create account" on Navigation Menu
        await wikipediaNavigationSteps.clickCreateAccount();

        // Step 4: Verify Create Account page is opened
        await wikipediaCreateAccountSteps.verifyPageOpened();

        // Step 5: Fill account form with random username and password
        await wikipediaCreateAccountSteps.fillAccountForm(randomUsername, randomPassword);

        // Step 6: Click "Create your account"
        await wikipediaCreateAccountSteps.clickCreateAccount();

        // Step 7: Verify main page is opened
        await wikipediaMainSteps.verifyPageOpened();

        // Step 8: Verify "Get started here" popup and dismiss it
        await wikipediaCreateAccountSteps.verifyAndDismissGetStartedPopup(GET_STARTED_POPUP_MESSAGE);
    });
});
```

## Key Patterns Demonstrated

1. **Test constants** - No magic values, use named constants
2. **Composite methods** - Combine related actions (`fillAccountForm`, `verifyAndDismissGetStartedPopup`)
3. **`@step` decorator** - All Steps methods are decorated for reporting
4. **Random data** - Use `testDataGenerator` for unique test data
5. **PopupPage** - Separate Page Object for popup handling
6. **Steps only in tests** - No direct Page Object calls in spec files
