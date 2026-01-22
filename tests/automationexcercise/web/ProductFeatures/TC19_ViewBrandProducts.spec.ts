import { expect, test } from '@fixtures/index';

test.describe("TC19: View & Cart Brand Products", () => {
    test("should navigate through different brands and view their products", async ({
        homePage,
        productsPage,
    }) => {
        // Step 1-2: Navigate to home
        await test.step("Navigate to home page", async () => {
            await homePage.goto();
            await homePage.verifyPageOpened();
        });

        // Step 3: Click Products button
        await test.step("Navigate to products page", async () => {
            await homePage.clickProducts();
            await productsPage.verifyPageOpened();
        });

        // Step 4: Verify brands visible on left sidebar
        await test.step("Verify brands are visible", async () => {
            await expect(
                productsPage.brandsSidebar,
                "Brands sidebar should be visible"
            ).toBeVisible();
        });

        // Step 5: Click on first brand
        await test.step("Click on Polo brand", async () => {
            await productsPage.selectBrand("Polo");
        });

        // Step 6: Verify navigated to brand page and products displayed
        await test.step("Verify Polo brand page and products", async () => {
            const heading = productsPage.page.locator(".title.text-center");
            await expect(heading).toContainText("Brand");
            await expect(heading).toContainText("Polo");

            // Verify products are displayed
            const productCount = await productsPage.productItems.count();
            expect(productCount, "Should have products displayed").toBeGreaterThan(0);
        });

        // Step 7: Click on another brand
        await test.step("Click on H&M brand", async () => {
            await productsPage.selectBrand("H&M");
        });

        // Step 8: Verify navigated to that brand page
        await test.step("Verify H&M brand page and products", async () => {
            const heading = productsPage.page.locator(".title.text-center");
            await expect(heading).toContainText("Brand");
            await expect(heading).toContainText("H&M");

            // Verify products are displayed
            const productCount = await productsPage.productItems.count();
            expect(productCount, "Should have products displayed").toBeGreaterThan(0);
        });
    });
});
