# Special Cases

Handling complex UI elements in Playwright with TypeScript.

## Working with Tables

Use Playwright's table locators to extract structured data.

```typescript
import { Page, Locator } from "@playwright/test";
import { BasePage } from "../pages/BasePage";

export class UsersPage extends BasePage {
    readonly usersTable: Locator;

    constructor(page: Page) {
        super(page, page.locator("body"), "Users Page");
        this.usersTable = page.locator("#users-table").describe("Users table");
    }

    async getAllUsers(): Promise<Record<string, string>[]> {
        // Get all table rows
        const rows = this.usersTable.locator("tbody tr");
        const rowCount = await rows.count();
        const users: Record<string, string>[] = [];

        // Get headers
        const headers = await this.usersTable.locator("thead th").allTextContents();

        // Parse each row
        for (let i = 0; i < rowCount; i++) {
            const cells = await rows.nth(i).locator("td").allTextContents();
            const userData: Record<string, string> = {};
            
            headers.forEach((header, index) => {
                userData[header] = cells[index];
            });
            
            users.push(userData);
        }

        return users;
    }
}
```

## IFrame Handling

Use Playwright's frame locators to interact with iframe content.

```typescript
import { Page, Locator, FrameLocator } from "@playwright/test";
import { BasePage } from "../pages/BasePage";

export class PaymentPage extends BasePage {
    readonly paymentFrame: FrameLocator;
    readonly cardNumberField: Locator;

    constructor(page: Page) {
        super(page, page.locator("body"), "Payment Page");
        
        // Define the frame locator
        this.paymentFrame = page.frameLocator("#payment-iframe");
        
        // Define elements INSIDE the frame
        this.cardNumberField = this.paymentFrame.locator("#card-number");
    }

    async enterCardNumber(number: string): Promise<void> {
        // Interact with element inside iframe
        await this.cardNumberField.fill(number);
    }

    async getCardNumberValue(): Promise<string> {
        return await this.cardNumberField.inputValue();
    }
}
```

## Browser Alerts

Playwright handles dialogs automatically or via event listeners.

```typescript
async deleteUser(): Promise<void> {
    // Setup listener before action that triggers the dialog
    this.page.once('dialog', dialog => dialog.accept());
    
    await this.deleteButton.click();
}

// If you need to verify the dialog message, use an assertion:
async deleteUserWithVerification(): Promise<void> {
    this.page.once('dialog', async dialog => {
        expect(dialog.message()).toBe('Are you sure you want to delete?');
        await dialog.accept();
    });
    
    await this.deleteButton.click();
}
```
