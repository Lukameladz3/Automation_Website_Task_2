import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class AccountDeletedPage extends BasePage {
    readonly accountDeletedHeading: Locator;
    readonly continueButton: Locator;

    constructor(page: Page) {
        super(
            page,
            page.getByRole("heading", { name: /account deleted/i }).describe("Account deleted heading")
        );
        this.accountDeletedHeading = this.page
            .getByRole("heading", { name: /account deleted/i })
            .describe("Account deleted heading");
        this.continueButton = this.page
            .getByRole("link", { name: /continue/i })
            .describe("Continue button");
    }

    /**
     * Verify account deleted message is visible
     */
    async verifyAccountDeleted(): Promise<void> {
        await expect(
            this.accountDeletedHeading,
            "Account deleted heading should be visible"
        ).toBeVisible();
    }

    clickSomeButton(){
        this.continueButton.click( { force: true } );
    }

    /**
     * Click continue button
     */
    async clickContinue(): Promise<void> {
        await this.continueButton.click();
    }
}
