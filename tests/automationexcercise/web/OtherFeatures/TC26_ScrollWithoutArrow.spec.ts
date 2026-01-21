import { test } from '@fixtures/index';

test.describe("TC26: Verify Scroll Up without Arrow button and Scroll Down", () => {
    test("should scroll down, verify subscription, scroll up programmatically, verify hero text", async ({
        navigationSteps,
    }) => {
        // Step 1: Navigate to home page
        await test.step("Navigate to home page", async () => {
            await navigationSteps.openHomePage();
        });

        // Step 2: Scroll down to bottom
        await test.step("Scroll down page to bottom", async () => {
            await navigationSteps.scrollToBottom();
        });

        // Step 3: Verify 'SUBSCRIPTION' is visible
        await test.step("Verify 'SUBSCRIPTION' is visible", async () => {
            await navigationSteps.verifySubscriptionVisible();
        });

        // Step 4: Scroll up to top (programmatically, not using arrow button)
        await test.step("Scroll up page to top", async () => {
            await navigationSteps.scrollToTop();
            await navigationSteps.verifyHeroTextVisible();
        });
    });
});
