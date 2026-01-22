import { expect, test } from '@fixtures/index';

test.describe("TC07: User Logout Functionality", () => {
    test("should logout user and terminate session", async ({
        homePage,
        loginPage,
    }) => {
        // Step 1: Verify user is logged in
        await test.step("Verify user is logged in initially", async () => {
            await homePage.goto();
            await homePage.verifyLoggedInVisible();
        });

        // Step 2: Navigate to different pages while logged in
        await test.step("Navigate to products page", async () => {
            await homePage.clickProducts();
        });

        // Step 3: Click logout
        await test.step("Click logout", async () => {
            await homePage.clickLogout();
        });

        // Step 4: Verify redirected to login page
        await test.step("Verify redirected to login page", async () => {
            await expect(
                loginPage.loginHeader,
                "Should be redirected to login page"
            ).toBeVisible();
        });

        // Step 5: Verify logged in text is no longer visible
        await test.step("Verify user is logged out", async () => {
            await homePage.verifyLoggedInNotVisible();
        });

        // Step 6: Try to access account page directly (should redirect or block)
        await test.step("Verify session is terminated", async () => {
            // Navigate to homepage
            await homePage.goto();

            // User should not be logged in
            await homePage.verifyLoggedInNotVisible();
        });

        // Step 7: Test back button doesn't restore session
        await test.step("Verify back button doesn't restore session", async () => {
            await homePage.goBack();

            // Still should not be logged in
            await homePage.verifyLoggedInNotVisible();
        });
    });
});
