import { TestData } from "@constants/TestData";
import { expect, isolatedTest as test } from "@fixtures/index";

test.describe("TC05-Hybrid: Search Product with API Validation", () => {
  test("should search for products via API and validate UI results match API", async ({
    homePage,
    productApiSteps,
    productDetailPage,
    productsPage,
    productSteps,
  }) => {
    const searchKeyword = TestData.SEARCH.VALID_TERM_2;
    const firstResultIndex = 0;
    const normalize = (value: string) =>
      value
        .replace(/\u00a0/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

    // Step 1: Search products via API first
    await test.step("Search products via API and get expected results", async () => {
      const apiProducts = await productApiSteps.searchProducts(searchKeyword);
      expect(
        apiProducts.length,
        `API should return products for "${searchKeyword}"`,
      ).toBeGreaterThan(0);
    });

    // Step 2: Navigate to products page via UI
    await test.step("Navigate to products page", async () => {
      await homePage.goto();
      await homePage.clickProducts();
      await productsPage.verifyPageOpened();
    });

    // Step 3: Search same keyword via UI
    await test.step(`Search for "${searchKeyword}" via UI`, async () => {
      await productsPage.search(searchKeyword);
      await productSteps.verifySearchResultsVisible();
    });

    // Step 4: Get search results from both API and UI
    await test.step("Compare UI search results with API results", async () => {
      const apiProducts = await productApiSteps.searchProducts(searchKeyword);
      const uiProductNames = await productsPage.getProductNames();

      expect(
        uiProductNames.length,
        "UI search should return at least one product",
      ).toBeGreaterThan(0);

      // Verify that UI products are relevant (contain search keyword or are in API results)
      // We check if UI products match any API product names (case-insensitive)
      const apiProductNames = apiProducts.map((p) => p.name.toLowerCase());

      const matchingProducts = uiProductNames.filter((uiName) => {
        const uiNameLower = uiName.toLowerCase();
        // Check if UI product name matches any API product name or contains search keyword
        const matchesApi = apiProductNames.some(
          (apiName) =>
            apiName.includes(uiNameLower) || uiNameLower.includes(apiName),
        );
        const containsKeyword = uiNameLower.includes(
          searchKeyword.toLowerCase(),
        );

        return matchesApi || containsKeyword;
      });

      expect(
        matchingProducts.length,
        "At least some UI search results should match API results or contain search keyword",
      ).toBeGreaterThan(0);
    });

    // Step 5: Verify product details page matches API product data
    await test.step("View first product and verify details match API", async () => {
      await productsPage.clickViewProduct(firstResultIndex);
      await productDetailPage.verifyProductDetailVisible();

      const uiProductName = await productDetailPage.getProductName();
      const uiProductPrice = await productDetailPage.getProductPrice();

      // Get product from API
      const apiProducts = await productApiSteps.searchProducts(searchKeyword);
      const apiProduct = await productApiSteps.getProductByName(
        apiProducts,
        uiProductName,
      );

      expect(
        apiProduct,
        `Product "${uiProductName}" should be found in API search results for "${searchKeyword}"`,
      ).toBeDefined();

      // Verify price matches
      const pricesMatch = await productApiSteps.verifyProductPricesMatch(
        apiProduct!,
        uiProductPrice,
      );
      expect(
        pricesMatch,
        `Product price in UI (${uiProductPrice}) should match API price (${apiProduct!.price})`,
      ).toBe(true);

      // Verify name matches
      expect(
        normalize(uiProductName),
        "Product name should match API product name (normalized)",
      ).toContain(normalize(apiProduct!.name));
    });
  });

  test("should show no results for non-existent product (API validation)", async ({
    homePage,
    productApiSteps,
    productsPage,
  }) => {
    const invalidKeyword = TestData.SEARCH.INVALID_TERM;

    // Step 1: Verify API also returns no results for invalid search
    await test.step("Verify API returns no results for invalid search", async () => {
      // The API should return empty array for invalid search term
      const apiProducts = await productApiSteps.searchProducts(invalidKeyword);
      expect(
        apiProducts.length,
        `API should return no products for invalid search term "${invalidKeyword}"`,
      ).toBe(0);
    });

    // Step 2: Navigate and search via UI
    await test.step("Search for non-existent product via UI", async () => {
      await homePage.goto();
      await homePage.clickProducts();
      await productsPage.search(invalidKeyword);
    });

    // Step 3: Verify no products found in UI
    await test.step("Verify no products found in UI", async () => {
      const productCount = await productsPage.getProductCount();
      expect(
        productCount,
        "No products should be found for invalid search",
      ).toBe(0);
    });
  });
});
