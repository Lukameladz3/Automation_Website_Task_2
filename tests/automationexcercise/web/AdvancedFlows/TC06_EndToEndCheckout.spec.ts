import { expect, test } from '@fixtures/index';
import { DataFactory } from '@utils/DataFactory';

test.describe("TC06: Complete End-to-End Purchase Flow", () => {
    test("should complete full checkout from product selection to order confirmation", async ({
        authedUser,
        cartPage,
        checkoutPage,
        checkoutSteps,
        homePage,
        paymentDonePage,
        paymentPage,
        productDetailPage,
        productsPage,
    }) => {
        let firstProductName: string;
        let secondProductName: string;

        // Step 1: Add multiple products to cart
        await test.step("Add first product to cart", async () => {
            await homePage.goto();
            await homePage.clickProducts();
            await productsPage.clickViewProduct(0);
            firstProductName = await productDetailPage.getProductName();
            await productDetailPage.addToCart();
            await productDetailPage.clickContinueShopping();
        });

        await test.step("Add second product to cart", async () => {
            await productsPage.goto();
            await productsPage.clickViewProduct(1);
            secondProductName = await productDetailPage.getProductName();
            await productDetailPage.addToCart();
            await productDetailPage.clickViewCart();
        });

        // Step 2: Verify products in cart
        await test.step("Verify both products in cart", async () => {
            await cartPage.verifyCartTableVisible();
            await cartPage.verifyProductInCart(firstProductName);
            await cartPage.verifyProductInCart(secondProductName);
        });

        // Step 3: Proceed to checkout
        await test.step("Proceed to checkout", async () => {
            await cartPage.clickProceedToCheckout();
        });

        // Step 4: Verify delivery address
        await test.step("Verify delivery address is displayed correctly", async () => {
            await checkoutSteps.verifyDeliveryAddress(authedUser);
        });

        // Step 5: Verify billing address
        await test.step("Verify billing address is displayed correctly", async () => {
            await checkoutSteps.verifyBillingAddress(authedUser);
        });

        // Step 6: Verify order details
        await test.step("Verify order contains products", async () => {
            await checkoutSteps.verifyOrderContainsProduct(firstProductName);
            await checkoutSteps.verifyOrderContainsProduct(secondProductName);
        });

        // Step 7: Enter order comment
        await test.step("Enter order comment", async () => {
            const orderComment = DataFactory.generateOrderComment();
            await checkoutPage.enterComment(orderComment);
        });

        // Step 8: Click Place Order
        await test.step("Place order", async () => {
            await checkoutPage.clickPlaceOrder();
        });

        // Step 9: Fill payment details
        await test.step("Fill payment details", async () => {
            const paymentDetails = DataFactory.generatePaymentDetails();
            await paymentPage.verifyPaymentPageVisible();
            await paymentPage.fillPaymentDetails(paymentDetails);
        });

        // Step 10: Confirm payment
        await test.step("Confirm payment and complete order", async () => {
            await paymentPage.clickPayAndConfirm();
        });

        // Step 11: Verify order success
        await test.step("Verify order placed successfully", async () => {
            await paymentDonePage.verifyOrderSuccess();
        });

        // Step 12: Verify order confirmation
        await test.step("Verify order confirmation details", async () => {
            const confirmation = await paymentDonePage.getOrderConfirmation();
            expect(confirmation, "Order confirmation should be displayed").toBeTruthy();
        });

        // Step 13: Continue after order
        await test.step("Click continue button", async () => {
            await paymentDonePage.clickContinue();
        });

        // Step 14: Verify cart is cleared
        await test.step("Verify cart is empty after order", async () => {
            await cartPage.goto();
            await cartPage.verifyCartEmpty();
        });
    });
});
