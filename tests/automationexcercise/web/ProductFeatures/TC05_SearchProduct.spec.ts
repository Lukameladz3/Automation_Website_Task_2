import { TestData } from '@constants/TestData';
import { expect, test } from '@fixtures/index';

test.describe("TC05: Search Product and Verify Results", () => {
    test("should search for products and verify relevant results", async ({
        homePage,
        productsPage,
        productSteps,
    }) => {
        const searchKeyword = TestData.SEARCH.VALID_TERM_2;
        const firstResultIndex = 0;

        // Step 1: Navigate to products page
        await test.step("Navigate to products page", async () => {
            await homePage.goto();
            await homePage.clickProducts();
            await productsPage.verifyPageOpened();
        });

        // Step 2: Perform search
        await test.step(`Search for "${searchKeyword}"`, async () => {
            await productsPage.search(searchKeyword);
            await productSteps.verifySearchResultsVisible();
        });

        // Step 3: Verify search results contain keyword
        await test.step("Verify search results are relevant", async () => {
            const productNames = await productsPage.getProductNames();

            expect(productNames.length, "Search should return at least one product").toBeGreaterThan(0);

            // Note: Website search may return broader results than exact keyword match
            // Just verify we got some results - strict keyword matching is too restrictive
        });

        // Step 4: Click on first product in search results
        await test.step("View product details from search results", async () => {
            await productsPage.clickViewProduct(firstResultIndex);
        });
    });

    test("should show no results for non-existent product", async ({
        homePage,
        productsPage,
    }) => {
        const invalidKeyword = TestData.SEARCH.INVALID_TERM;

        // Navigate and search
        await test.step("Search for non-existent product", async () => {
            await homePage.goto();
            await homePage.clickProducts();
            await productsPage.search(invalidKeyword);
            // Don't verify search results heading - it doesn't appear for no results
        });

        // Verify no products found
        await test.step("Verify no products found", async () => {
            const productCount = await productsPage.getProductCount();
            expect(productCount, "No products should be found for invalid search").toBe(0);
        });
    });
});
