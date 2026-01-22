import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class PaymentDonePage extends BasePage {
    readonly successMessage: Locator;
    readonly orderConfirmationText: Locator;
    readonly downloadInvoiceButton: Locator;
    readonly continueButton: Locator;

    constructor(page: Page) {
        super(
            page,
            page.locator("[data-qa='order-placed']").describe("Order placed message")
        );

        this.successMessage = this.page
            .locator("[data-qa='order-placed'] b")
            .describe("Order placed success message");
        this.orderConfirmationText = this.page
            .locator(".col-sm-9 p")
            .describe("Order confirmation text");
        this.downloadInvoiceButton = this.page
            .getByRole("link", { name: /download invoice/i })
            .describe("Download invoice button");
        this.continueButton = this.page
            .locator("[data-qa='continue-button']")
            .describe("Continue button");
    }

    /**
     * Verify order success message is displayed
     */
    async verifyOrderSuccess(): Promise<void> {
        await expect(
            this.successMessage,
            "Order success message should be visible"
        ).toBeVisible();

        const messageText = await this.successMessage.textContent();
        expect(
            messageText?.trim().toUpperCase(),
            "Success message should contain 'ORDER PLACED'"
        ).toContain("ORDER PLACED");
    }

    /**
     * Get order confirmation message
     */
    async getOrderConfirmation(): Promise<string> {
        const text = await this.orderConfirmationText.textContent();
        return text?.trim() || "";
    }

    /**
     * Download invoice
     */
    async downloadInvoice(): Promise<void> {
        await this.downloadInvoiceButton.click();
    }

    /**
     * Click continue button
     */
    async clickContinue(): Promise<void> {
        await this.continueButton.click();
    }
}
