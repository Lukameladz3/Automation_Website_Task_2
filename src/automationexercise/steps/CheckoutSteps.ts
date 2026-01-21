import { expect } from '@playwright/test';
import { PaymentDetails } from '@models/PaymentModels';
import { User } from '@models/UserModels';
import { CartPage } from '@pages/CartPage';
import { CheckoutPage } from '@pages/CheckoutPage';
import { HomePage } from '@pages/HomePage';
import { PaymentDonePage } from '@pages/PaymentDonePage';
import { PaymentPage } from '@pages/PaymentPage';
import { step } from '@utils/StepDecorator';

/**
 * Reusable steps for checkout flow
 */
export class CheckoutSteps {
    constructor(
        private homePage: HomePage,
        private cartPage: CartPage,
        private checkoutPage: CheckoutPage,
        private paymentPage: PaymentPage,
        private paymentDonePage: PaymentDonePage
    ) { }

    /**
     * Complete full checkout flow from cart to order confirmation
     */
    @step('Complete full checkout flow')
    async completeCheckout(userData: User, paymentData: PaymentDetails, comment?: string): Promise<void> {
        // Go to cart and proceed to checkout
        await this.cartPage.clickProceedToCheckout();

        // Verify addresses using Steps layer logic
        await this.verifyDeliveryAddress(userData);
        await this.verifyBillingAddress(userData);

        // Enter comment if provided
        if (comment) {
            await this.checkoutPage.enterComment(comment);
        }

        // Place order
        await this.checkoutPage.clickPlaceOrder();

        // Complete payment
        await this.paymentPage.verifyPaymentPageVisible();
        await this.paymentPage.fillPaymentDetails(paymentData);
        await this.paymentPage.clickPayAndConfirm();

        // Verify success
        await this.paymentDonePage.verifyOrderSuccess();
    }

    /**
     * Proceed to checkout (for tests that need to do steps manually)
     */
    @step('Proceed to checkout')
    async proceedToCheckout(): Promise<void> {
        await this.cartPage.clickProceedToCheckout();
    }

    /**
     * Verify delivery address matches user data
     */
    @step('Verify delivery address')
    async verifyDeliveryAddress(userData: User): Promise<void> {
        const addressText = await this.checkoutPage.getDeliveryAddressText();

        // Verify delivery address contains all required user information
        expect(addressText, "Delivery address should contain first name").toContain(userData.firstName);
        expect(addressText, "Delivery address should contain last name").toContain(userData.lastName);
        expect(addressText, "Delivery address should contain address1").toContain(userData.address1);
        expect(addressText, "Delivery address should contain city").toContain(userData.city);
        expect(addressText, "Delivery address should contain state").toContain(userData.state);
        expect(addressText, "Delivery address should contain country").toContain(userData.country);
    }

    /**
     * Verify billing address matches user data
     */
    @step('Verify billing address')
    async verifyBillingAddress(userData: User): Promise<void> {
        const addressText = await this.checkoutPage.getBillingAddressText();

        // Verify billing address contains required user information
        expect(addressText, "Billing address should contain first name").toContain(userData.firstName);
        expect(addressText, "Billing address should contain last name").toContain(userData.lastName);
        expect(addressText, "Billing address should contain address1").toContain(userData.address1);
    }

    /**
     * Verify order contains expected product
     */
    @step('Verify order contains product')
    async verifyOrderContainsProduct(productName: string): Promise<void> {
        const orderText = await this.checkoutPage.getOrderReviewText();
        const normalize = (value: string) =>
            value.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim().toLowerCase();

        const normalizedOrder = normalize(orderText);
        const normalizedName = normalize(productName);
        
        // Verify the order review contains the specified product name
        expect(
            normalizedOrder,
            `Order should contain product: ${productName}`
        ).toContain(normalizedName);
    }

    /**
     * Verify addresses in checkout
     */
    @step('Verify checkout addresses')
    async verifyAddresses(userData: User): Promise<void> {
        await this.verifyDeliveryAddress(userData);
        await this.verifyBillingAddress(userData);
    }

    /**
     * Place order with optional comment
     */
    @step('Place order')
    async placeOrder(comment?: string): Promise<void> {
        if (comment) {
            await this.checkoutPage.enterComment(comment);
        }
        await this.checkoutPage.clickPlaceOrder();
    }

    /**
     * Complete payment
     */
    @step('Complete payment flow')
    async completePayment(paymentData: PaymentDetails): Promise<void> {
        await this.paymentPage.verifyPaymentPageVisible();
        await this.paymentPage.fillPaymentDetails(paymentData);
        await this.paymentPage.clickPayAndConfirm();
        await this.paymentDonePage.verifyOrderSuccess();
    }
}
