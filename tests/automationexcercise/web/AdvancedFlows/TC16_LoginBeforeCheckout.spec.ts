import { expect, isolatedTest as test } from '@fixtures/index';
import { DataFactory } from '@utils/DataFactory';

test.describe("TC16: Place Order - Login before Checkout", () => {
    test("should login with existing user, add products and complete checkout", async ({
        accountCreatedPage,
        accountDeletedPage,
        cartPage,
        checkoutPage,
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

        // Step 1-3: Navigate and create account first (simulating existing user)
        await test.step("Create account", async () => {
            await homePage.goto();
            await homePage.clickSignupLogin();
            await loginPage.signup(userData.name, userData.email);
            await signupPage.fillAccountDetails(userData);
            await signupPage.clickCreateAccount();
            await expect(accountCreatedPage.successMessage).toBeVisible();
            await accountCreatedPage.clickContinue();
        });

        // Step 4-6: Navigate to home (now logged in)
        await test.step("Navigate to home page", async () => {
            await homePage.goto();
            await homePage.verifyPageOpened();
        });

        // Step 7: Add products to cart
        await test.step("Add products to cart", async () => {
            await homePage.clickProducts();
            await productsPage.clickViewProduct(0);
            await productDetailPage.addToCart();
            await productDetailPage.clickViewCart();
        });

        // Step 8-9: Verify cart
        await test.step("Verify cart page displayed", async () => {
            await cartPage.verifyPageOpened();
            await cartPage.verifyCartTableVisible();
        });

        // Step 10: Proceed to checkout
        await test.step("Proceed to checkout", async () => {
            await cartPage.clickProceedToCheckout();
        });

        // Step 11: Verify checkout page
        await test.step("Verify checkout page", async () => {
            await expect(checkoutPage.orderReviewTable).toBeVisible();
        });

        // Step 12: Enter comment and place order
        await test.step("Enter comment and place order", async () => {
            await checkoutPage.enterComment("Standard delivery is fine");
            await checkoutPage.clickPlaceOrder();
        });

        // Step 13-14: Payment and confirm
        await test.step("Complete payment", async () => {
            await paymentPage.verifyPaymentPageVisible();
            await paymentPage.fillPaymentDetails(paymentData);
            await paymentPage.clickPayAndConfirm();
        });

        // Step 15: Verify success
        await test.step("Verify order success", async () => {
            await paymentDonePage.verifyOrderSuccess();
        });

        // Step 16-17: Delete account
        await test.step("Delete account", async () => {
            await homePage.navigation.clickDeleteAccount();
            await accountDeletedPage.verifyAccountDeleted();
            await accountDeletedPage.clickContinue();
        });
    });
});
