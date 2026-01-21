import { expect, isolatedTest as test } from '@fixtures/index';
import { DataFactory } from '@utils/DataFactory';

test.describe("TC23: Verify address details in checkout page", () => {
    test("should create account, add products, verify addresses match registration, then delete account", async ({
        accountCreatedPage,
        accountDeletedPage,
        cartPage,
        checkoutPage,
        checkoutSteps,
        homePage,
        loginPage,
        productDetailPage,
        productsPage,
        signupPage,
    }) => {
        // Generate unique user data for this test
        const workerIndex = test.info().workerIndex;
        const userData = DataFactory.generateUser({ workerIndex });

        // Step 1-3: Navigate to home page and verify
        await test.step("Navigate to home page", async () => {
            await homePage.goto();
            await homePage.verifyPageOpened();
        });

        // Step 4-6: Register new account
        await test.step("Register new account", async () => {
            await homePage.clickSignupLogin();
            await loginPage.signup(userData.name, userData.email);
            await signupPage.fillAccountDetails(userData);
            await signupPage.clickCreateAccount();

            // Verify account created
            await expect(accountCreatedPage.successMessage).toBeVisible();
            await accountCreatedPage.clickContinue();
        });

        // Step 7: Verify logged in
        await test.step("Verify logged in as username", async () => {
            await homePage.verifyLoggedInVisible();
        });

        // Step 8: Add products to cart
        await test.step("Add products to cart", async () => {
            await homePage.clickProducts();
            await productsPage.clickViewProduct(0);
            await productDetailPage.addToCart();
            await productDetailPage.clickViewCart();
        });

        // Step 9-10: Go to cart and verify
        await test.step("Verify cart page displayed", async () => {
            await cartPage.verifyPageOpened();
            await cartPage.verifyCartTableVisible();
        });

        // Step 11: Proceed to checkout
        await test.step("Proceed to checkout", async () => {
            await cartPage.clickProceedToCheckout();
            await checkoutPage.verifyPageOpened();
        });

        // Step 12: Verify delivery address matches registration
        await test.step("Verify delivery address matches registration", async () => {
            await checkoutSteps.verifyDeliveryAddress(userData);
        });

        // Step 13: Verify billing address matches registration
        await test.step("Verify billing address matches registration", async () => {
            await checkoutSteps.verifyBillingAddress(userData);
        });

        // Step 14-15: Delete account and verify
        await test.step("Delete account", async () => {
            await homePage.navigation.clickDeleteAccount();
            await accountDeletedPage.verifyAccountDeleted();
            await accountDeletedPage.clickContinue();
        });
    });
});
