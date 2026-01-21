# Framework Elements

This document describes how to work with page elements in the framework using Playwright's Locator API directly, combined with centralized check methods from `BasePage`.

**📘 Usage Example:** [page-object-example.md](../examples/page-object-example.md)

---

## Architecture Overview

The framework follows a **hybrid approach** for element handling:

1. **Direct Playwright API**: Use Playwright's `Locator` directly for all element interactions (click, fill, hover, etc.)
2. **Centralized Checks**: Use `BasePage` protected methods for all element state validations (visibility, text, attributes, etc.)

This approach provides:
- Direct access to Playwright's powerful Locator API
- Consistent error messaging through `BasePage` check methods
- Type safety with TypeScript
- Clear separation between assertions and actions

---

## BasePage Check Methods

All Page Objects extend `BasePage`, which provides protected methods for element state verification:

### Visibility & Display
- `elementToBeVisible(element, isSoft?, timeout?)` - Verify element is visible
- `elementToBeHidden(element, isSoft?, timeout?)` - Verify element is hidden

### State Checks
- `elementToBeEnabled(element, isSoft?, timeout?)` - Verify element is enabled
- `elementToBeDisabled(element, isSoft?, timeout?)` - Verify element is disabled
- `elementToBeChecked(element, isSoft?, timeout?)` - Verify checkbox/radio is checked

### Content Verification
- `elementToHaveText(element, text, isSoft?, timeout?)` - Verify element text
- `elementToHaveAttribute(element, attribute, value, isSoft?, timeout?)` - Verify attribute value
- `elementToHaveCss(element, property, value, isSoft?, timeout?)` - Verify CSS property

### Parameters
- `element: Locator` - The Playwright Locator to check
- `isSoft: boolean` - Use soft assertion (default: `true`)
- `timeout?: number` - Custom timeout in milliseconds

All methods return the `Locator` for method chaining.

---

## Usage in Page Objects

```typescript
import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
    readonly usernameField: Locator;
    readonly passwordField: Locator;
    readonly submitButton: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        super(page, page.locator("#loginForm"), "Login Page");

        // Declare elements as Locators with .describe()
        this.usernameField = page.locator("#username").describe("Username field");
        this.passwordField = page.locator("#password").describe("Password field");
        this.submitButton = page.locator("button[type='submit']").describe("Submit button");
        this.errorMessage = page.locator(".error-message").describe("Error message");
    }

    async login(username: string, password: string): Promise<void> {
        // Use BasePage methods for checks
        await this.elementToBeVisible(this.usernameField);
        
        // Use Playwright API directly for interactions
        await this.usernameField.fill(username);
        await this.passwordField.fill(password);
        await this.submitButton.click();
    }

    async verifyErrorDisplayed(expectedError: string): Promise<void> {
        await this.elementToBeVisible(this.errorMessage);
        await this.elementToHaveText(this.errorMessage, expectedError);
    }
}
```

### Using `.describe()` for Debugging

Always use Playwright's `.describe()` method to add human-readable descriptions to locators for better error messages and debugging:

```typescript
export class LoginPage extends BasePage {
    readonly usernameField: Locator;
    readonly submitButton: Locator;

    constructor(page: Page) {
        super(page, page.locator("#loginForm"), "Login Page");

        // Add descriptions to locators
        this.usernameField = page.locator("#username").describe("Username input field");
        this.submitButton = page.locator("button[type='submit']").describe("Login submit button");
    }

    async login(username: string, password: string): Promise<void> {
        // Better error messages when elements are not found
        await this.usernameField.fill(username);  // Error: "Username input field" not found
        await this.submitButton.click();  // Error: "Login submit button" not found
    }
}
```

---

## Common Interaction Patterns

### Clicking Elements
```typescript
// Simple click
await this.submitButton.click();

// Right click
await this.menuItem.click({ button: 'right' });

// Double click
await this.fileItem.dblclick();

// Click with modifier keys
await this.link.click({ modifiers: ['Control'] });
```

### Input Fields
```typescript
// Fill input
await this.usernameField.fill("user@example.com");

// Clear and fill
await this.searchBox.clear();
await this.searchBox.fill("new query");

// Type with delay
await this.textArea.type("Hello", { delay: 100 });
```

### Dropdowns & Selection
```typescript
// Select by value
await this.countryDropdown.selectOption("US");

// Select by label
await this.countryDropdown.selectOption({ label: "United States" });

// Get selected value
const selected = await this.countryDropdown.inputValue();
```

### Checkboxes & Radio Buttons
```typescript
// Check/uncheck
await this.agreeCheckbox.check();
await this.agreeCheckbox.uncheck();

// Verify state using BasePage method
await this.elementToBeChecked(this.agreeCheckbox);
```

### Hover & Focus
```typescript
// Hover over element
await this.menuItem.hover();

// Focus element
await this.inputField.focus();
```

### Drag and Drop
```typescript
// Drag to another element
await this.dragHandle.dragTo(this.dropZone);
```

### Getting Element Data
```typescript
// Get text content
const text = await this.label.textContent();

// Get inner text
const innerText = await this.label.innerText();

// Get attribute
const href = await this.link.getAttribute("href");

// Get input value
const value = await this.textField.inputValue();
```

---

## Best Practices

### ✅ DO
- Use Playwright `Locator` type for all element declarations
- Initialize locators using `page.locator()` or specific locator methods
- Always add `.describe()` to locators for better debugging
- Use `BasePage` protected methods (`elementToBeVisible`, etc.) for state checks
- Use Playwright API directly for interactions (click, fill, hover, etc.)
- Rely on Playwright's built-in auto-waiting
- Use specific locators (IDs, test IDs, ARIA roles) when possible
- Search existing Page Objects for similar locator patterns

### ❌ DON'T
- Create custom wrapper classes for elements
- Duplicate element declarations across pages
- Use `page.waitForTimeout()` for synchronization (use auto-waiting or specific waits)
- Bypass `BasePage` check methods for assertions
- Use overly broad selectors (e.g., `button` instead of `button[type='submit']`)
- Access internal Playwright APIs unless absolutely necessary

---

## Migration from Wrapper Classes

If you encounter legacy code using wrapper classes like `Button`, `TextBox`, or `Label`:

**Before (Old Pattern):**
```typescript
import { Button } from "../elements/Button";
import { TextBox } from "../elements/TextBox";

readonly username: TextBox;
readonly submit: Button;

this.username = new TextBox(page, "#username", "Username field");
await this.username.clearAndType("user");
await this.submit.click();
```

**After (Current Pattern):**
```typescript
import { Locator } from "@playwright/test";

readonly usernameField: Locator;
readonly submitButton: Locator;

this.usernameField = page.locator("#username").describe("Username field");
await this.usernameField.fill("user");
await this.submitButton.click();
```

---

**📘 See usage in:** [page-object-example.md](../examples/page-object-example.md)
