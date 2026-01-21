import { expect, isolatedTest as test } from '@fixtures/index';
import { User } from '@models/UserModels';
import { DataFactory } from '@utils/DataFactory';

test.describe("TC03-Hybrid: Add Multiple Products to Cart (API Setup)", () => {
    let testUser: User;
    let userCreated = false;

    test.beforeEach(async ({ homePage, loginPage, userApiSteps }) => {
        // Step 1: Create user via API (faster than UI registration)
        const workerIndex = test.info().workerIndex;
        testUser = DataFactory.generateUser({ workerIndex });
        await userApiSteps.createAndVerifyUser(testUser);
        userCreated = true;

        // Step 2: Login via UI (validates login flow)
        await homePage.goto();
        await homePage.clickSignupLogin();
        await loginPage.login(testUser.email, testUser.password);
        await expect(
            homePage.loggedInText,
            "User should be logged in after API creation"
        ).toContainText(testUser.name);
    });

    test.afterEach(async ({ userApiSteps }) => {
        // Cleanup: Delete user via API
        if (!userCreated) return;
        await userApiSteps.deleteUser(testUser.email, testUser.password);
    });

    test("should add multiple products with different quantities and verify cart with API price validation", async ({
        cartPage,
        homePage,
        productApiSteps,
        productDetailPage,
        productsPage,
        productSteps,
    }) => {
        let firstProductName: string;
        let secondProductName: string;
        let firstProductApiPrice: string;
        let secondProductApiPrice: string;
        const firstProductQuantity = 3;
        const secondProductQuantity = 1;
        const firstProductIndex = 0;
        const secondProductIndex = 1;

        const normalizeName = (value: string) =>
            value.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim().toLowerCase();

        const findCartItemByName = (
            items: Array<{ name: string; price: string; quantity: string; total: string }>,
            name: string
        ) => items.find((item) => normalizeName(item.name) === normalizeName(name));

        // Step 1: Get all products via API for price validation
        await test.step("Get all products via API", async () => {
            const apiProducts = await productApiSteps.verifyAndGetAllProducts();
            expect(
                apiProducts.length,
                "API should return products"
            ).toBeGreaterThan(0);
        });

        // Step 2: Navigate to products page
        await test.step("Navigate to products page", async () => {
            await homePage.goto();
            await homePage.clickProducts();
            await productsPage.verifyPageOpened();
            await productSteps.verifyProductsListVisible();
        });

        // Step 3: Select first product and view details
        await test.step("View first product details and get API price", async () => {
            await productsPage.clickViewProduct(firstProductIndex);
            await productDetailPage.verifyProductDetailVisible();
            firstProductName = await productDetailPage.getProductName();

            // Get product details from API
            const apiProducts = await productApiSteps.verifyAndGetAllProducts();
            const apiProduct = await productApiSteps.getProductByName(apiProducts, firstProductName);
            expect(
                apiProduct,
                `Product "${firstProductName}" should exist in API`
            ).toBeDefined();
            
            firstProductApiPrice = apiProduct!.price;
        });

        // Step 4: Set quantity to 3 and add to cart
        await test.step("Add first product with quantity 3", async () => {
            await productDetailPage.setQuantity(firstProductQuantity);
            await productDetailPage.addToCart();
            await productDetailPage.clickContinueShopping();
        });

        // Step 5: Navigate back to products
        await test.step("Return to products page", async () => {
            await productsPage.goto();
            await productSteps.verifyProductsListVisible();
        });

        // Step 6: Add second product (different from first)
        await test.step("Add second product with quantity 1 and get API price", async () => {
            await productsPage.goto();
            await productsPage.clickViewProduct(secondProductIndex);
            secondProductName = await productDetailPage.getProductName();

            // Get second product details from API
            const apiProducts = await productApiSteps.verifyAndGetAllProducts();
            const apiProduct = await productApiSteps.getProductByName(apiProducts, secondProductName);
            expect(
                apiProduct,
                `Product "${secondProductName}" should exist in API`
            ).toBeDefined();
            
            secondProductApiPrice = apiProduct!.price;

            await productDetailPage.addToCart();
            await productDetailPage.clickViewCart();
        });

        // Step 7: Verify cart contains both products
        await test.step("Verify both products in cart", async () => {
            await cartPage.verifyCartTableVisible();
            await cartPage.verifyProductInCart(firstProductName);
            await cartPage.verifyProductInCart(secondProductName);
        });

        // Step 8: Verify quantities
        await test.step("Verify product quantities", async () => {
            const firstQty = await cartPage.getProductQuantity(firstProductName);
            const secondQty = await cartPage.getProductQuantity(secondProductName);

            expect(
                firstQty,
                `First product should have quantity ${firstProductQuantity}`
            ).toBe(firstProductQuantity);
            expect(secondQty, `Second product should have quantity ${secondProductQuantity}`).toBe(secondProductQuantity);
        });

        // Step 9: Verify cart prices match API product prices
        await test.step("Verify cart prices match API product prices", async () => {
            const items = await cartPage.getCartItems();
            
            // Find first product in cart
            const firstCartItem = findCartItemByName(items, firstProductName);
            expect(firstCartItem, "First product should be in cart").toBeDefined();
            
            const pricesMatch1 = productApiSteps.verifyProductPricesMatch(
                { brand: "", id: 0, name: firstProductName, price: firstProductApiPrice },
                firstCartItem!.price
            );
            const pricesMatch1Resolved = await pricesMatch1;
            expect(
                pricesMatch1Resolved,
                `First product price in cart (${firstCartItem!.price}) should match API price (${firstProductApiPrice})`
            ).toBe(true);
            
            // Find second product in cart
            const secondCartItem = findCartItemByName(items, secondProductName);
            expect(secondCartItem, "Second product should be in cart").toBeDefined();
            
            const pricesMatch2 = productApiSteps.verifyProductPricesMatch(
                { brand: "", id: 0, name: secondProductName, price: secondProductApiPrice },
                secondCartItem!.price
            );
            const pricesMatch2Resolved = await pricesMatch2;
            expect(
                pricesMatch2Resolved,
                `Second product price in cart (${secondCartItem!.price}) should match API price (${secondProductApiPrice})`
            ).toBe(true);
        });

        // Step 10: Verify cart item count
        await test.step("Verify cart has 2 products", async () => {
            const itemCount = await cartPage.getCartItemCount();
            expect(itemCount, "Cart should contain 2 products").toBe(2);
        });

        // Step 11: Verify total calculation matches API prices
        await test.step("Verify total calculation from API prices", async () => {
            const items = await cartPage.getCartItems();
            
            // Calculate expected total from API prices
            const firstApiPriceNum = await productApiSteps.parsePriceToNumber(firstProductApiPrice);
            const secondApiPriceNum = await productApiSteps.parsePriceToNumber(secondProductApiPrice);
            const expectedTotal = (firstApiPriceNum * firstProductQuantity) + (secondApiPriceNum * secondProductQuantity);

            // Get actual cart total (sum of item totals)
            let actualTotal = 0;
            for (const item of items) {
                actualTotal += await productApiSteps.parsePriceToNumber(item.total);
            }

            // Allow small difference for rounding
            const difference = Math.abs(expectedTotal - actualTotal);
            expect(
                difference,
                `Cart total (${actualTotal}) should match calculated total from API prices (${expectedTotal})`
            ).toBeLessThan(0.01);
        });
    });
});


