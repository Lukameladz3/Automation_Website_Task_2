import { expect, isolatedTest as test } from '@fixtures/index';
import { DataFactory } from '@utils/DataFactory';

test.describe("TC15: Place Order - Register before Checkout", () => {
    test("should register account first, then add products and complete checkout", async ({
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

        // Step 1-3: Navigate to home
        await test.step("Navigate to home page", async () => {
            await homePage.goto();
            await homePage.verifyPageOpened();
        });

        // Step 4-7: Register account BEFORE adding products
        await test.step("Register new account", async () => {
            await homePage.clickSignupLogin();
            await loginPage.signup(userData.name, userData.email);
            await signupPage.fillAccountDetails(userData);
            await signupPage.clickCreateAccount();
            await expect(accountCreatedPage.successMessage).toBeVisible();
            await accountCreatedPage.clickContinue();
            await homePage.verifyLoggedInVisible();
        });

        // Step 8: Add products to cart
        await test.step("Add products to cart", async () => {
            await homePage.clickProducts();
            await productsPage.clickViewProduct(0);
            await productDetailPage.addToCart();
            await productDetailPage.clickViewCart();
        });

        // Step 9-10: Verify cart
        await test.step("Verify cart page displayed", async () => {
            await cartPage.verifyPageOpened();
            await cartPage.verifyCartTableVisible();
        });

        // Step 11: Proceed to checkout
        await test.step("Proceed to checkout", async () => {
            await cartPage.clickProceedToCheckout();
        });

        // Step 12: Verify addresses and order
        await test.step("Verify address details and review order", async () => {
            await checkoutSteps.verifyDeliveryAddress(userData);
            await checkoutSteps.verifyBillingAddress(userData);
        });

        // Step 13: Enter comment and place order
        await test.step("Enter comment and place order", async () => {
            await checkoutPage.enterComment("Please deliver in the morning");
            await checkoutPage.clickPlaceOrder();
        });

        // Step 14-15: Payment and confirm
        await test.step("Complete payment", async () => {
            await paymentPage.verifyPaymentPageVisible();
            await paymentPage.fillPaymentDetails(paymentData);
            await paymentPage.clickPayAndConfirm();
        });

        // Step 16: Verify success
        await test.step("Verify order success", async () => {
            await paymentDonePage.verifyOrderSuccess();
        });

        // Step 17-18: Delete account
        await test.step("Delete account", async () => {
            await homePage.navigation.clickDeleteAccount();
            await accountDeletedPage.verifyAccountDeleted();
            await accountDeletedPage.clickContinue();
        });
    });
});
