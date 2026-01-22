import { expect, test } from '@fixtures/index';

test.describe("TC13: Verify Product quantity in Cart", () => {
    test("should verify exact quantity when product added with increased quantity", async ({
        cartPage,
        homePage,
        productDetailPage,
        productsPage,
    }) => {
        let productName: string;
        const targetQuantity = 4;

        // Step 0: Clear cart first
        await test.step("Clear cart if needed", async () => {
            await cartPage.goto();
            await cartPage.clearCart();
            await cartPage.verifyCartEmpty();
        });

        // Step 1-3: Navigate to home and verify
        await test.step("Navigate to home page", async () => {
            await homePage.goto();
            await homePage.verifyPageOpened();
        });

        // Step 4: Click View Product for any product
        await test.step("View product detail", async () => {
            await homePage.clickProducts();
            await productsPage.clickViewProduct(0);
        });

        // Step 5: Verify product detail is opened
        await test.step("Verify product detail page opened", async () => {
            await productDetailPage.verifyProductDetailVisible();
            productName = await productDetailPage.getProductName();
        });

        // Step 6: Increase quantity to 4
        await test.step("Set quantity to 4", async () => {
            await productDetailPage.setQuantity(targetQuantity);
        });

        // Step 7: Click Add to cart
        await test.step("Add product to cart", async () => {
            await productDetailPage.addToCart();
        });

        // Step 8: Click View Cart
        await test.step("View cart", async () => {
            await productDetailPage.clickViewCart();
        });

        // Step 9: Verify exact quantity in cart
        await test.step("Verify product quantity is 4", async () => {
            const quantity = await cartPage.getProductQuantity(productName);
            expect(quantity, "Product quantity in cart should be exactly 4").toBe(targetQuantity);
        });
    });
});
