import { expect, isolatedTest as test } from '@fixtures/index';
import { DataFactory } from '@utils/DataFactory';

test.describe("TC14: Place Order - Register while Checkout", () => {
    test("should allow registration during checkout and complete order", async ({
        accountCreatedPage,
        accountDeletedPage,
        cartPage,
        checkoutPage,
        checkoutSteps,
        homePage,
        loginPage,
        paymentDonePage,
        paymentPage,
        productDetailPage,
        productsPage,
        signupPage,
    }) => {
        const workerIndex = test.info().workerIndex;
        const userData = DataFactory.generateUser({ workerIndex });
        const paymentData = DataFactory.generatePaymentDetails();

        // Step 1-3: Navigate to home and verify
        await test.step("Navigate to home page", async () => {
            await homePage.goto();
            await homePage.verifyPageOpened();
        });

        // Step 4: Add products to cart
        await test.step("Add product to cart", async () => {
            await homePage.clickProducts();
            await productsPage.clickViewProduct(0);
            await productDetailPage.addToCart();
            await productDetailPage.clickViewCart();
        });

        // Step 5-6: Click Cart and verify
        await test.step("Verify cart page displayed", async () => {
            await cartPage.verifyPageOpened();
            await cartPage.verifyCartTableVisible();
        });

        // Step 7-8: Proceed to checkout and navigate to registration
        await test.step("Proceed to checkout and navigate to registration", async () => {
            await cartPage.clickProceedToCheckout();

            // Expect modal to appear for unauthenticated user (deterministic behavior)
            const registerLink = cartPage.page
                .locator(".modal-content")
                .getByRole("link", { name: /register.*login/i });

            await expect(
                registerLink,
                "Register/Login link should appear in modal for unauthenticated user"
            ).toBeVisible({ timeout: 3000 });

            await registerLink.click();
        });

        // Step 9: Fill registration and create account
        await test.step("Register new account", async () => {
            await loginPage.signup(userData.name, userData.email);
            await signupPage.fillAccountDetails(userData);
            await signupPage.clickCreateAccount();
        });

        // Step 10: Verify account created
        await test.step("Verify ACCOUNT CREATED and continue", async () => {
            await expect(accountCreatedPage.successMessage).toBeVisible();
            await accountCreatedPage.clickContinue();
        });

        // Step 11: Verify logged in
        await test.step("Verify logged in as username", async () => {
            await homePage.verifyLoggedInVisible();
        });

        // Step 12: Click Cart button
        await test.step("Navigate back to cart", async () => {
            await homePage.navigation.clickCart();
        });

        // Step 13: Click Proceed To Checkout
        await test.step("Proceed to checkout again", async () => {
            await cartPage.clickProceedToCheckout();
        });

        // Step 14: Verify Address Details and Review Order
        await test.step("Verify address details and review order", async () => {
            await checkoutSteps.verifyDeliveryAddress(userData);
            await checkoutSteps.verifyBillingAddress(userData);
        });

        // Step 15: Enter comment and click Place Order
        await test.step("Enter comment and place order", async () => {
            await checkoutPage.enterComment("Please deliver between 9 AM - 5 PM");
            await checkoutPage.clickPlaceOrder();
        });

        // Step 16-17: Enter payment details and confirm
        await test.step("Enter payment details and confirm", async () => {
            await paymentPage.verifyPaymentPageVisible();
            await paymentPage.fillPaymentDetails(paymentData);
            await paymentPage.clickPayAndConfirm();
        });

        // Step 18: Verify success message
        await test.step("Verify order success message", async () => {
            await paymentDonePage.verifyOrderSuccess();
        });

        // Step 19-20: Delete account
        await test.step("Delete account and verify", async () => {
            await homePage.navigation.clickDeleteAccount();
            await accountDeletedPage.verifyAccountDeleted();
            await accountDeletedPage.clickContinue();
        });
    });
});
