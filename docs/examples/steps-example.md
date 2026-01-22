# Steps Class Example

## TypeScript Implementation

### ✅ RECOMMENDED: Parameterized Methods with Composite Actions

Methods accept data as parameters and combine related actions.

```typescript
import { Page } from "@playwright/test";
import { WikipediaLoginPage } from "../pages/WikipediaLoginPage";
import { WikipediaNavigationMenu } from "../pages/WikipediaNavigationMenu";
import { step } from "../../utils/Decorators";

export class WikipediaLoginSteps {
    readonly wikipediaLoginPage: WikipediaLoginPage;
    readonly wikipediaNavigationMenu: WikipediaNavigationMenu;

    constructor(page: Page) {
        this.wikipediaLoginPage = new WikipediaLoginPage(page);
        this.wikipediaNavigationMenu = new WikipediaNavigationMenu(page);
    }

    @step('Verify Login page is opened')
    async verifyPageOpened(): Promise<void> {
        await this.wikipediaLoginPage.verifyPageOpened();
    }

    // ✅ Atomic: accepts credentials as parameters
    @step('Enter Username "{0}" and Password on the Login Page')
    async enterCredentials(username: string, password: string): Promise<void> {
        await this.wikipediaLoginPage.enterUsername(username);
        await this.wikipediaLoginPage.enterPassword(password);
    }

    @step('Click "Log in" on the Login Page')
    async clickLoginButton(): Promise<void> {
        await this.wikipediaLoginPage.clickLogin();
    }

    // ✅ Composite: combines enterCredentials + clickLoginButton
    @step('Login to Wikipedia with "{0}"')
    async login(username: string, password: string): Promise<void> {
        await this.enterCredentials(username, password);
        await this.clickLoginButton();
    }
}
```

### Usage in Tests

```typescript
import { test } from '../fixtures';
import { getWikipediaUsername, getWikipediaPassword } from '../../utils/Config';

test.describe('Wikipedia Login Tests', () => {
    test('Login with valid credentials', async ({ 
        wikipediaNavigationSteps, 
        wikipediaLoginSteps 
    }) => {
        // Get data at test level
        const username = getWikipediaUsername();
        const password = getWikipediaPassword();
        
        // Use Steps methods
        await wikipediaNavigationSteps.clickLogIn();
        await wikipediaLoginSteps.verifyPageOpened();
        await wikipediaLoginSteps.login(username, password);
        await wikipediaNavigationSteps.verifyUsernameDisplayed(username);
    });

    test('Login with invalid credentials', async ({ 
        wikipediaNavigationSteps, 
        wikipediaLoginSteps 
    }) => {
        await wikipediaNavigationSteps.clickLogIn();
        await wikipediaLoginSteps.login('invalid_user', 'wrong_password');
        // Verify error message
    });
});
```

## Fixture Registration

```typescript
// tests/fixtures.ts
import { test as base } from "@playwright/test";
import { WikipediaLoginSteps } from "./steps/WikipediaLoginSteps";

type StepsFixtures = {
    wikipediaLoginSteps: WikipediaLoginSteps;
};

export const test = base.extend<StepsFixtures>({
    wikipediaLoginSteps: async ({ page }, use) => {
        await use(new WikipediaLoginSteps(page));
    },
});
```

## Composite Methods Pattern

**Rule:** Combine related actions that are frequently used together.

```typescript
// ❌ VERBOSE: Separate calls for related actions
await steps.verifyPopupDisplayed(message);
await steps.clickGotIt();
await steps.verifyPopupClosed();

// ✅ BETTER: Single composite method
await steps.verifyAndDismissPopup(message);
```

**Implementation:**
```typescript
@step('Verify and dismiss popup with text "{0}"')
async verifyAndDismissPopup(expectedText: string): Promise<void> {
    await this.verifyPopupDisplayed(expectedText);  // Reuse existing
    await this.clickDismiss();                       // Reuse existing
    await this.verifyPopupHidden();                  // Verify final state
}
```

## Why Parameterized Methods?

✅ **Versatile** - Same method works for valid/invalid/edge case data  
✅ **Testable** - Easy to test different scenarios  
✅ **Reusable** - No duplication for different data sets  
✅ **Data-Driven** - Perfect for parameterized tests  
✅ **Clear** - Test controls what data to use  

## Anti-Pattern to Avoid

❌ **DON'T hardcode or read from secrets inside Steps:**

```typescript
// ❌ BAD: Hardcoded, inflexible
@step("Login")
async login(): Promise<void> {
    const username = process.env.USERNAME; // DON'T DO THIS
    const password = "hardcoded123";        // DON'T DO THIS
    
    await this.loginPage.enterUsername(username);
    await this.loginPage.enterPassword(password);
}
```

This makes the method:
- Only work with one set of credentials
- Impossible to test invalid credentials
- Not reusable across different test scenarios
