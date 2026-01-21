import { expect, isolatedTest as test } from '@fixtures/index';
import { User } from '@models/UserModels';
import { DataFactory } from '@utils/DataFactory';

test.describe("TC08-Hybrid: Update Product Quantity in Cart (API Setup)", () => {
    let testUser: User;
    let userCreated = false;

    test.beforeEach(async ({ homePage, loginPage, userApiSteps }) => {
        // Create user via API for faster setup
        const workerIndex = test.info().workerIndex;
        testUser = DataFactory.generateUser({ workerIndex });
        await userApiSteps.createAndVerifyUser(testUser);
        userCreated = true;

        // Login via UI
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

    test("should update product quantities and verify calculations with API price validation", async ({
        cartPage,
        homePage,
        productApiSteps,
        productDetailPage,
        productsPage,
    }) => {
        let productName: string;
        let productPrice: string;
        let productApiPrice: string;

        // Step 0: Clear cart first
        await test.step("Clear cart if needed", async () => {
            await cartPage.goto();
            await cartPage.clearCart();
            await cartPage.verifyCartEmpty();
        });

        // Step 1: Get product from API for price validation
        await test.step("Get product details from API", async () => {
            const apiProducts = await productApiSteps.verifyAndGetAllProducts();
            expect(apiProducts.length, "API should return products").toBeGreaterThan(0);
        });

        // Step 2: Add product to cart with quantity 1
        await test.step("Add product with initial quantity 1", async () => {
            await homePage.goto();
            await homePage.clickProducts();
            await productsPage.clickViewProduct(0);
            productName = await productDetailPage.getProductName();
            productPrice = await productDetailPage.getProductPrice();

            // Get product price from API
            const apiProducts = await productApiSteps.verifyAndGetAllProducts();
            const apiProduct = await productApiSteps.getProductByName(apiProducts, productName);
            expect(
                apiProduct,
                `Product "${productName}" should exist in API`
            ).toBeDefined();
            // Narrow type for subsequent usage
            const requiredApiProduct = apiProduct!;
            productApiPrice = requiredApiProduct.price;
            
            // Verify UI price matches API price
            const pricesMatch = await productApiSteps.verifyProductPricesMatch(requiredApiProduct, productPrice);
            expect(
                pricesMatch,
                `Product price in UI (${productPrice}) should match API price (${productApiPrice})`
            ).toBe(true);

            await productDetailPage.setQuantity(1);
            await productDetailPage.addToCart();
            await productDetailPage.clickViewCart();
        });

        // Step 3: Verify initial quantity is 1
        await test.step("Verify initial quantity is 1", async () => {
            const initialQty = await cartPage.getProductQuantity(productName);
            expect(initialQty, "Initial quantity should be 1").toBe(1);
        });

        // Step 4: Increase quantity by adding product again
        await test.step("Increase quantity by adding product again", async () => {
            await productsPage.goto();
            await productsPage.clickViewProduct(0);
            await productDetailPage.setQuantity(4); // Add 4 more
            await productDetailPage.addToCart();
            await productDetailPage.clickViewCart();
        });

        // Step 5: Verify quantity updated
        await test.step("Verify quantity increased", async () => {
            const updatedQty = await cartPage.getProductQuantity(productName);
            const expectedQty = 5; // 1 + 4
            expect(updatedQty, `Quantity should be ${expectedQty}`).toBe(expectedQty);
        });

        // Step 6: Verify total calculation matches API price
        await test.step("Verify price calculations are accurate using API price", async () => {
            const productTotal = await cartPage.getProductTotal(productName);
            const updatedQty = await cartPage.getProductQuantity(productName);

            // Calculate expected total from API price
            const apiPriceNum = await productApiSteps.parsePriceToNumber(productApiPrice);
            const expectedTotalNum = apiPriceNum * updatedQty;
            const actualTotalNum = await productApiSteps.parsePriceToNumber(productTotal);

            // Allow small difference for rounding
            const difference = Math.abs(expectedTotalNum - actualTotalNum);
            expect(
                difference,
                `Product total (${actualTotalNum}) should equal API price (${apiPriceNum}) × quantity (${updatedQty}) = ${expectedTotalNum}`
            ).toBeLessThan(0.01);
        });

        // Step 7: Verify cart total
        await test.step("Verify cart total is accurate", async () => {
            const cartTotal = await cartPage.getCartTotal();
            const productTotal = await cartPage.getProductTotal(productName);

            // Cart should match product total (since only one product)
            expect(
                cartTotal.replace(/\s/g, ""),
                "Cart total should match sum of product totals"
            ).toBe(productTotal.replace(/\s/g, ""));
        });
    });
});

