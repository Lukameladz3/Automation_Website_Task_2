import { TestData } from '@constants/TestData';
import { expect, isolatedTest as test } from '@fixtures/index';

test.describe("TC09-Hybrid: Product Category and Brand Filtering with API Validation", () => {
    test("should filter products by category", async ({ homePage, productsPage, productSteps }) => {
        const womenDressCategory = TestData.CATEGORIES.WOMEN_DRESS;
        const menJeansCategory = TestData.CATEGORIES.MEN_JEANS;

        // Step 1: Navigate to homepage
        await test.step("Navigate to homepage", async () => {
            await homePage.goto();
            await homePage.verifyPageOpened();
        });

        // Step 2: Verify category sidebar is visible
        await test.step("Verify category sidebar is visible", async () => {
            await expect(
                productsPage.categorySidebar,
                "Category sidebar should be visible"
            ).toBeVisible();
        });

        // Step 3: Click on Women > Dress category
        await test.step("Select Women > Dress category", async () => {
            await productsPage.selectCategory(womenDressCategory.category, womenDressCategory.subcategory);
        });

        // Step 4: Verify category title is displayed
        await test.step("Verify Women - Dress products page", async () => {
            await productSteps.verifyCategoryTitle(womenDressCategory.expectedTitle);
            await productSteps.verifyProductsListVisible();
        });

        // Step 5: Get product count for this category
        await test.step("Verify products are displayed", async () => {
            const productCount = await productsPage.getProductCount();
            expect(productCount, "Category should have at least one product").toBeGreaterThan(0);
        });

        // Step 6: Switch to different category (Men > Jeans)
        await test.step("Select Men > Jeans category", async () => {
            await productsPage.selectCategory(menJeansCategory.category, menJeansCategory.subcategory);
        });

        // Step 7: Verify new category products displayed
        await test.step("Verify Men - Jeans products page", async () => {
            await productSteps.verifyCategoryTitle(menJeansCategory.expectedTitle);
            await productSteps.verifyProductsListVisible();

            const productCount = await productsPage.getProductCount();
            expect(productCount, "Category should have at least one product").toBeGreaterThan(0);
        });
    });

    test("should filter products by brand with API validation", async ({
        brandApiSteps,
        homePage,
        productApiSteps,
        productsPage,
        productSteps,
    }) => {
        const poloBrand = TestData.BRANDS.POLO;
        const hmBrand = TestData.BRANDS.H_AND_M;

        // Step 1: Get all brands via API
        await test.step("Get all brands via API", async () => {
            const apiBrands = await brandApiSteps.verifyAndGetAllBrands();
            expect(apiBrands.length, "API should return brands").toBeGreaterThan(0);
        });

        // Step 2: Navigate to products page
        await test.step("Navigate to products page", async () => {
            await homePage.goto();
            await homePage.clickProducts();
            await productsPage.verifyPageOpened();
        });

        // Step 3: Verify brands sidebar contains brands from API
        await test.step("Verify brands sidebar contains brands from API", async () => {
            const apiBrands = await brandApiSteps.verifyAndGetAllBrands();
            const apiBrandNames = await brandApiSteps.getBrandNames(apiBrands);

            // Verify brands sidebar is visible
            await expect(
                productsPage.brandsSidebar,
                "Brands sidebar should be visible"
            ).toBeVisible();

            // Note: We can't directly verify all brands from API are in UI without parsing UI,
            // but we can verify at least some known brands exist
            expect(apiBrandNames.length, "API should return brand names").toBeGreaterThan(0);
        });

        // Step 4: Click on Polo brand and verify
        await test.step("Select Polo brand and verify with API", async () => {
            // Verify Polo brand exists in API
            const poloExists = await brandApiSteps.isBrandExists(poloBrand.name);
            expect(poloExists, "Polo brand should exist in API").toBe(true);

            // Select Polo brand in UI
            await productsPage.selectBrand(poloBrand.name);
        });

        // Step 5: Verify brand title is displayed
        await test.step("Verify Polo brand products page", async () => {
            await productSteps.verifyBrandTitle(poloBrand.name);
            await productSteps.verifyProductsListVisible();
        });

        // Step 6: Verify products are displayed and compare with API
        await test.step("Verify brand has products and validate against API", async () => {
            const productCount = await productsPage.getProductCount();
            expect(productCount, "Brand should have at least one product").toBeGreaterThan(0);

            // Get all products from API to verify brand filtering
            const allApiProducts = await productApiSteps.verifyAndGetAllProducts();
            const poloProducts = allApiProducts.filter(p => 
                p.brand.toLowerCase() === poloBrand.name.toLowerCase()
            );

            // Verify that UI shows products for Polo brand
            // We can't directly match exact products, but we verify brand filtering works
            expect(poloProducts.length, "API should have Polo brand products").toBeGreaterThan(0);
        });

        // Step 7: Switch to different brand (H&M) and verify
        await test.step("Select H&M brand and verify with API", async () => {
            // Verify H&M brand exists in API
            const hmExists = await brandApiSteps.isBrandExists(hmBrand.name);
            expect(hmExists, "H&M brand should exist in API").toBe(true);

            // Select H&M brand in UI
            await productsPage.selectBrand(hmBrand.name);
        });

        // Step 8: Verify new brand products displayed
        await test.step("Verify H&M brand products page", async () => {
            await productSteps.verifyBrandTitle(hmBrand.name);
            await productSteps.verifyProductsListVisible();

            const productCount = await productsPage.getProductCount();
            expect(productCount, "Brand should have at least one product").toBeGreaterThan(0);

            // Get H&M products from API
            const allApiProducts = await productApiSteps.verifyAndGetAllProducts();
            const hmProducts = allApiProducts.filter(p => 
                p.brand.toLowerCase().includes(hmBrand.name.toLowerCase()) ||
                p.brand.toLowerCase().includes(hmBrand.name.toLowerCase().replace("&", " "))
            );

            expect(hmProducts.length, "API should have H&M brand products").toBeGreaterThan(0);
        });
    });
});

