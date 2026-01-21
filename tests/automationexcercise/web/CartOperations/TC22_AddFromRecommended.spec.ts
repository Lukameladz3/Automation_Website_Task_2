import { expect, test } from '@fixtures/index';

test.describe("TC22: Add to cart from Recommended items", () => {
    test("should add recommended product to cart and verify", async ({
        cartPage,
        homePage,
    }) => {
        // Step 1-2: Navigate to home
        await test.step("Navigate to home page", async () => {
            await homePage.goto();
            await homePage.verifyPageOpened();
        });

        // Step 3: Scroll to bottom of page
        await test.step("Scroll to bottom", async () => {
            await homePage.scrollToBottom();
        });

        // Step 4: Verify 'RECOMMENDED ITEMS' are visible
        await test.step("Verify recommended items visible", async () => {
            await homePage.verifyRecommendedItemsVisible();
        });

        // Step 5: Click 'Add To Cart' on recommended product
        await test.step("Add recommended product to cart", async () => {
            await homePage.addRecommendedItemToCart(0);
            // Wait for "Added to cart" modal to appear
            await expect(
                homePage.viewCartModal,
                "View cart modal should appear after adding product"
            ).toBeVisible();
        });

        // Step 6: Click 'View Cart' button
        await test.step("View cart", async () => {
            await homePage.clickViewCartFromModal();
        });

        // Step 7: Verify product is displayed in cart
        await test.step("Verify product in cart", async () => {
            await cartPage.verifyPageOpened();
            const itemCount = await cartPage.getCartItemCount();
            expect(itemCount, "Cart should have at least 1 product").toBeGreaterThanOrEqual(1);
        });
    });
});
