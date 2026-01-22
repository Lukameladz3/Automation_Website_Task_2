import { expect, test } from '@fixtures/index';

test.describe("TC25: Verify Scroll Up using Arrow button and Scroll Down", () => {
    test("should scroll down, verify subscription, scroll up with arrow, verify hero text", async ({
        homePage,
    }) => {
        // Step 1: Navigate to home page
        await test.step("Navigate to home page", async () => {
            await homePage.goto();
            await homePage.verifyPageOpened();
        });

        // Step 2: Scroll down to bottom
        await test.step("Scroll down page to bottom", async () => {
            await homePage.scrollToBottom();
        });

        // Step 3: Verify 'SUBSCRIPTION' is visible
        await test.step("Verify 'SUBSCRIPTION' is visible", async () => {
            await homePage.verifySubscriptionVisible();
        });

        // Step 4: Click arrow button to scroll up
        await test.step("Click on arrow at bottom right to move upward", async () => {
            await homePage.clickScrollUpArrow();
            // Wait for hero text to be in viewport (scroll animation complete)
            await expect(
                homePage.fullFledgedText,
                "Hero text should be in viewport after scroll click"
            ).toBeInViewport();
        });

        // Step 5: Verify page scrolled up and hero text is visible
        await test.step("Verify page scrolled up and hero text is visible", async () => {
            await homePage.verifyFullFledgedTextVisible();

            // Verify we're actually at the top by checking if hero text is in viewport
            await expect(
                homePage.fullFledgedText,
                "Hero text should be in viewport after scrolling up"
            ).toBeInViewport();
        });
    });
});
