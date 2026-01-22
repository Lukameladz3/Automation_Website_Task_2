import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CheckoutPage extends BasePage {
    readonly deliveryAddressSection: Locator;
    readonly billingAddressSection: Locator;
    readonly orderReviewTable: Locator;
    readonly orderCommentTextarea: Locator;
    readonly placeOrderButton: Locator;
    readonly checkoutHeading: Locator;
    readonly orderReviewRows: Locator;
    readonly orderReviewTotalRow: Locator;
    readonly totalAmountText: Locator;

    constructor(page: Page) {
        super(
            page,
            page.locator("#cart_info").describe("Order review table")
        );

        this.deliveryAddressSection = this.page
            .locator("#address_delivery")
            .describe("Delivery address section");
        this.billingAddressSection = this.page
            .locator("#address_invoice")
            .describe("Billing address section");
        this.orderReviewTable = this.page
            .locator("#cart_info")
            .describe("Order review table");
        this.orderCommentTextarea = this.page
            .locator("textarea.form-control")
            .describe("Order comment textarea");
        this.placeOrderButton = this.page
            .getByRole("link", { name: /place order/i })
            .describe("Place order button");
        this.checkoutHeading = this.page
            .getByRole("heading", { name: /review your order/i })
            .describe("Checkout heading");
        this.orderReviewRows = this.orderReviewTable
            .locator("tr")
            .describe("Order review rows");
        this.orderReviewTotalRow = this.orderReviewRows
            .last()
            .describe("Order review total row");
        this.totalAmountText = this.orderReviewTotalRow
            .locator("p")
            .last()
            .describe("Total amount text");
    }

    /**
     * Get delivery address text for verification
     */
    async getDeliveryAddressText(): Promise<string> {
        const text = await this.deliveryAddressSection.textContent();
        return text?.trim() || "";
    }

    /**
     * Get billing address text for verification
     */
    async getBillingAddressText(): Promise<string> {
        const text = await this.billingAddressSection.textContent();
        return text?.trim() || "";
    }

    /**
     * Get order review text for verification
     */
    async getOrderReviewText(): Promise<string> {
        const text = await this.orderReviewTable.textContent();
        return text?.trim() || "";
    }

    /**
     * Enter order comment
     */
    async enterComment(comment: string): Promise<void> {
        await this.orderCommentTextarea.fill(comment);
    }

    /**
     * Click place order button
     */
    async clickPlaceOrder(): Promise<void> {
        await this.placeOrderButton.click();
    }

    /**
     * Get total amount from checkout
     */
    async getTotalAmount(): Promise<string> {
        const totalText = await this.totalAmountText.textContent();
        return totalText?.trim() || "";
    }
}
