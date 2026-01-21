import { expect, isolatedTest as test } from '@fixtures/index';
import { User } from '@models/UserModels';
import { DataFactory } from '@utils/DataFactory';

test.describe("TC04-Hybrid: Remove Product from Cart (API Setup)", () => {
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

    test("should remove products from cart and verify empty state", async ({
        cartPage,
        homePage,
        productDetailPage,
        productsPage,
    }) => {
        let firstProductName: string;
        let secondProductName: string;

        // Step 0: Ensure cart is clean
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

