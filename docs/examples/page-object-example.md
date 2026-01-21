# Page Object Example

## Wikipedia Example

```typescript
import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class WikipediaLoginPage extends BasePage {
    // Define elements as private readonly Locator properties
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;

    constructor(page: Page) {
        // Initialize BasePage with page, locator, and name
        super(page, page.locator("input#wpName1"), "WikipediaLoginPage");

        // Initialize elements with locators and descriptions
        this.usernameInput = page.locator("input#wpName1").describe("Username input");
        this.passwordInput = page.locator("input#wpPassword1").describe("Password input");
        this.loginButton = page.locator("button#wpLoginAttempt").describe("Login button");
    }

    // Atomic Actions

    async enterUsername(username: string): Promise<void> {
        await this.elementToBeVisible(this.usernameInput);
        await this.usernameInput.fill(username);
    }

    async enterPassword(password: string): Promise<void> {
        await this.elementToBeVisible(this.passwordInput);
        await this.passwordInput.fill(password);
    }

    async clickLogin(): Promise<void> {
        await this.elementToBeVisible(this.loginButton);
        await this.loginButton.click();
    }
}
```

## PopupPage Example

```typescript
import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class WikipediaGetStartedPopupPage extends BasePage {
    private readonly gotItButton: Locator;

    constructor(page: Page) {
        // formLocator IS the popup container - no separate container needed
        super(page, page.locator('.oo-ui-popupWidget-popup'), 'WikipediaGetStartedPopupPage');
        this.gotItButton = page.locator('button:has-text("Got it")').describe('Got it button');
    }

    // ✅ Use inherited verifyPageOpened() for visibility - DON'T create verifyPopupVisible()

    async verifyPopupContainsText(expectedText: string): Promise<void> {
        await this.elementToContainText(this.formLocator, expectedText);
    }

    async clickGotIt(): Promise<void> {
        await this.gotItButton.click();
    }

    async verifyPopupHidden(): Promise<void> {
        await this.elementToBeHidden(this.formLocator);
    }
}
```

## Key Points

1. **Extend BasePage** - All Page Objects inherit from BasePage
2. **Private locators** - Use `private readonly` for encapsulation  
3. **`.describe()`** - Always add descriptions for debugging
4. **BasePage methods** - Use `elementToBeVisible()`, `elementToHaveText()`, etc.
5. **Playwright API** - Use `.fill()`, `.click()` directly on locators
6. **formLocator as container** - Use `formLocator` for container checks, don't duplicate
7. **NEVER duplicate BasePage methods** - Use inherited `verifyPageOpened()`, don't create `verifyPopupVisible()`
8. **PopupPage pattern** - Create separate `*PopupPage` classes for popups
