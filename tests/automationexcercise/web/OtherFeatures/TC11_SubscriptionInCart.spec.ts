import { test } from '@fixtures/index';

test.describe("TC11: Verify Subscription in Cart page", () => {
    test("should allow subscription from cart page footer", async ({
        cartPage,
        homePage,
    }) => {
        const testEmail = `subscriber${Date.now()}@example.com`;

        // Navigate to home and verify
        await homePage.goto();
        await homePage.verifyPageOpened();

        // Navigate to cart page
        await homePage.navigation.clickCart();

        // Scroll to footer and verify subscription text
        await cartPage.subscriptionEmailInput.scrollIntoViewIfNeeded();
        await cartPage.verifySubscriptionVisible();

        // Subscribe with email
        await cartPage.subscribeWithEmail(testEmail);

        // Verify subscription success message
        await cartPage.verifySubscriptionSuccess();
    });
});
