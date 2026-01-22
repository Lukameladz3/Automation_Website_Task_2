# Page Object Pattern

**Location:** `tests/pages/` directory

**📘 Full Example:** [page-object-example.md](../examples/page-object-example.md)

---

## Rules

1.  **🔴 CHECK [page-object-map.md](../maps/page-object-map.md) FIRST** - Never create without checking
2.  **Inherit from `BasePage`**
3.  **ONE locator per element** - Most reliable verified locator only
4.  **Locator extraction** - Follow [locators.md](locators.md) methodology
5.  **Direct Playwright API** - Use `Locator` for elements, BasePage methods for checks, `.describe()` for debugging
6.  **Atomic Actions** - Expose simple actions (click, type, get text), NOT complex business logic
7.  **Search existing first** - No duplicates allowed
8.  **ONE Page Object per unique page/URL**
9.  **Consumed by Steps** - Page Objects are used by Steps classes. Direct usage in Tests is PROHIBITED.
10. **UPDATE page-object-map.md** - Immediately after creation
11. **🔴 POPUPS get separate Page Objects** - Always create a dedicated `*PopupPage` class for popups/modals. Small popups don't require separate Steps classes - integrate into parent Steps.
12. **🔴 NEVER duplicate BasePage methods** - Don't create methods like `verifyPopupVisible()` when `verifyPageOpened()` exists. Use inherited methods.

---

## Popup Page Objects

**Naming:** `*PopupPage.ts` (e.g., `WikipediaGetStartedPopupPage.ts`)

**Rules:**
- Always create a separate Page Object for popups/modals
- Use `PopupPage` suffix in class name
- **Use `formLocator` as the container** - Don't create separate container locators
- Small popups: integrate into parent Steps class (no separate Steps)
- Large/complex popups: may warrant their own Steps class

```typescript
export class ConfirmDialogPopupPage extends BasePage {
    private readonly confirmButton: Locator;
    private readonly cancelButton: Locator;

    constructor(page: Page) {
        // formLocator IS the popup container - no separate container needed
        super(page, page.locator('.dialog-popup'), 'ConfirmDialogPopupPage');
        this.confirmButton = page.locator('button:has-text("OK")').describe('OK button');
        this.cancelButton = page.locator('button:has-text("Cancel")').describe('Cancel button');
    }

    // ✅ Use inherited verifyPageOpened() for visibility - DON'T create verifyPopupVisible()

    async verifyPopupContainsText(expectedText: string): Promise<void> {
        await this.elementToContainText(this.formLocator, expectedText);
    }

    async clickConfirm(): Promise<void> {
        await this.confirmButton.click();
    }

    async verifyPopupHidden(): Promise<void> {
        await this.elementToBeHidden(this.formLocator);
    }
}
```

---

## Before Creating

**MANDATORY STEPS:**
1.  **OPEN** `docs/maps/page-object-map.md`
2.  **SEARCH** for existing Page Objects
3.  **VERIFY** no similar page exists

```bash
# Check the map
cat docs/maps/page-object-map.md

# Search existing
grep -r "class.*Page" tests/pages/
```

**Reuse Strategy:**
Same page → extend existing | Similar page → inheritance | Different page → new class

---

## Page Object Structure

```typescript
import { Page, Locator } from "@playwright/test";
import { BasePage } from "../../framework/ui/pages/BasePage";

export class PageName extends BasePage {
    /**
     * Page description.
     * URL: https://example.com/page
     */

    readonly submitButton: Locator;
    readonly messageLabel: Locator;

    constructor(page: Page) {
        super(page, page.locator("#unique-container"), "Page Name");

        // Elements - ONE locator each, use .describe() for debugging
        this.submitButton = page.locator("#submit-btn").describe("Submit button");
        this.messageLabel = page.locator(".message").describe("Message label");
    }

    async clickSubmit(): Promise<void> {
        // Use BasePage methods for checks
        await this.elementToBeVisible(this.submitButton);
        // Use Playwright API for interactions
        await this.submitButton.click();
    }

    async getMessageText(): Promise<string> {
        await this.elementToBeVisible(this.messageLabel);
        return await this.messageLabel.textContent() || "";
    }
}
```

---

## Success Criteria

-   ✅ Existing Page Objects searched and reused
-   ✅ ONE verified locator per element
-   ✅ Follows `locators.md` methodology
-   ✅ Playwright `Locator` used for all elements
-   ✅ All locators have `.describe()` for debugging
-   ✅ BasePage check methods used for validations
-   ✅ Atomic public API
-   ✅ No duplicate functionality
-   ✅ ONE Page Object per unique page/URL
-   ✅ Consumed by Steps classes
-   ✅ [page-object-map.md](../maps/page-object-map.md) updated
