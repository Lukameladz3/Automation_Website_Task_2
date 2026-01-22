import { expect, test } from '@fixtures/index';

test.describe("TC04: Remove Product from Cart", () => {
    test("should remove products from cart and verify empty state", async ({
        cartPage,
        homePage,
        productDetailPage,
        productsPage,
    }) => {
        let firstProductName: string;
        let secondProductName: string;

        // Step 0: Navigate to cart and clear it if needed
        await test.step("Ensure cart is clean", async () => {
            await cartPage.goto();
            await cartPage.clearCart();
            await cartPage.verifyCartEmpty();
        });

        // Step 1: Add 2 products to cart
        await test.step("Add first product to cart", async () => {
            await homePage.goto();
            await homePage.clickProducts();
            await productsPage.clickViewProduct(0);
            firstProductName = await productDetailPage.getProductName();
            await productDetailPage.addToCart();
            await productDetailPage.clickContinueShopping();
        });

        await test.step("Add second product to cart", async () => {
            await productsPage.goto();
            await productsPage.clickViewProduct(1);
            secondProductName = await productDetailPage.getProductName();
            await productDetailPage.addToCart();
            await productDetailPage.clickViewCart();
        });

        // Step 2: Verify cart has 2 products
        await test.step("Verify cart contains 2 products", async () => {
            const initialCount = await cartPage.getCartItemCount();
            expect(initialCount, "Cart should have 2 products initially").toBe(2);
        });

        // Step 3: Remove first product
        await test.step("Remove first product", async () => {
            await cartPage.removeProductByName(firstProductName);

            // Verify only second product remains
            const countAfterFirst = await cartPage.getCartItemCount();
            expect(countAfterFirst, "Cart should have 1 product after first removal").toBe(1);
            await cartPage.verifyProductInCart(secondProductName);
        });

        // Step 4: Remove second product
        await test.step("Remove second product", async () => {
            await cartPage.removeProductByName(secondProductName);
        });

        // Step 5: Verify cart is empty
        await test.step("Verify cart is empty", async () => {
            await cartPage.verifyCartEmpty();
        });
    });
});
