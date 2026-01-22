import { test } from '@fixtures/index';

test.describe("TC17: Remove Products From Cart", () => {
    test("should add product to cart and successfully remove it", async ({
        cartPage,
        homePage,
        productDetailPage,
        productsPage,
    }) => {
        let productName: string;

        // Step 1-3: Navigate to home
        await test.step("Navigate to home page", async () => {
            await homePage.goto();
            await homePage.verifyPageOpened();
        });

        // Step 4: Add product to cart
        await test.step("Add product to cart", async () => {
            await homePage.clickProducts();
            await productsPage.clickViewProduct(0);
            productName = await productDetailPage.getProductName();
            await productDetailPage.addToCart();
            await productDetailPage.clickViewCart();
        });

        // Step 5-6: Verify cart page displayed
        await test.step("Verify cart page and product exists", async () => {
            await cartPage.verifyPageOpened();
            await cartPage.verifyCartTableVisible();
            await cartPage.verifyProductInCart(productName);
        });

        // Step 7: Click X button to remove product
        await test.step("Remove product from cart", async () => {
            await cartPage.removeProductByName(productName);
        });

        // Step 8: Verify product is removed
        await test.step("Verify product removed from cart", async () => {
            await cartPage.verifyProductNotInCart(productName);
        });
    });
});
