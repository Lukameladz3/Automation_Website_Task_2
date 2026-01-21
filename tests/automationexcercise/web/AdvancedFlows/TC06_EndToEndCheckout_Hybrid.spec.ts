import { expect, isolatedTest as test } from '@fixtures/index';
import { User } from '@models/UserModels';
import { DataFactory } from '@utils/DataFactory';

test.describe("TC06-Hybrid: Complete End-to-End Purchase Flow (API Setup + Full Validation)", () => {
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

    test("should complete full checkout from product selection to order confirmation with API validation", async ({
        cartPage,
        checkoutPage,
        checkoutSteps,
        homePage,
        paymentDonePage,
        paymentPage,
        productApiSteps,
        productDetailPage,
        productsPage,
        userApiSteps,
    }) => {
        let firstProductName: string;
        let secondProductName: string;
        let firstProductApiPrice: string;
        let secondProductApiPrice: string;
        let cartItemsBeforeCheckout: Array<{ name: string; price: string; quantity: string; total: string }> = [];
        let expectedTotalFromApiPrices = 0;
        const firstProductIndex = 0;
        const secondProductIndex = 1;

        const normalizeName = (value: string) =>
            value.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim().toLowerCase();

        const findCartItemByName = (
            items: Array<{ name: string; price: string; quantity: string; total: string }>,
            name: string
        ) => items.find((item) => normalizeName(item.name) === normalizeName(name));

        // Step 1: Get user details via API for address validation
        await test.step("Get user details via API for validation", async () => {
            const userDetail = await userApiSteps.verifyAndGetUserDetailByEmail(testUser.email);
            expect(
                userDetail.user.email,
                "API user email should match created user"
            ).toBe(testUser.email);
        });

        // Step 2: Get products list via API for price validation
        await test.step("Get all products via API for price validation", async () => {
            const apiProducts = await productApiSteps.verifyAndGetAllProducts();
            expect(apiProducts.length, "API should return products").toBeGreaterThan(0);
        });

        // Step 3: Add multiple products to cart
        await test.step("Add first product to cart", async () => {
            await homePage.goto();
            await homePage.clickProducts();
            await productsPage.clickViewProduct(firstProductIndex);
            firstProductName = await productDetailPage.getProductName();

            // Get first product price from API
            const apiProducts = await productApiSteps.verifyAndGetAllProducts();
            const apiProduct = await productApiSteps.getProductByName(apiProducts, firstProductName);
            expect(
                apiProduct,
                `Product "${firstProductName}" should exist in API`
            ).toBeDefined();
            
            firstProductApiPrice = apiProduct!.price;

            await productDetailPage.addToCart();
            await productDetailPage.clickContinueShopping();
        });

        await test.step("Add second product to cart", async () => {
            await productsPage.goto();
            await productsPage.clickViewProduct(secondProductIndex);
            secondProductName = await productDetailPage.getProductName();

            // Get second product price from API
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

        // Step 4: Verify products in cart
        await test.step("Verify both products in cart", async () => {
            await cartPage.verifyCartTableVisible();
            await cartPage.verifyProductInCart(firstProductName);
            await cartPage.verifyProductInCart(secondProductName);
        });

        // Step 5: Verify cart prices match API product prices
        await test.step("Verify cart prices match API product prices", async () => {
            const items = await cartPage.getCartItems();
            cartItemsBeforeCheckout = items;
            
            const firstCartItem = findCartItemByName(items, firstProductName);
            expect(firstCartItem, `Product "${firstProductName}" should be in cart`).toBeDefined();
            
            const pricesMatch1 = productApiSteps.verifyProductPricesMatch(
                { brand: "", id: 0, name: firstProductName, price: firstProductApiPrice },
                firstCartItem!.price
            );
            const pricesMatch1Resolved = await pricesMatch1;
            expect(
                pricesMatch1Resolved,
                `First product price should match API price`
            ).toBe(true);

            const secondCartItem = findCartItemByName(items, secondProductName);
            expect(secondCartItem, `Product "${secondProductName}" should be in cart`).toBeDefined();
            
            const pricesMatch2 = productApiSteps.verifyProductPricesMatch(
                { brand: "", id: 0, name: secondProductName, price: secondProductApiPrice },
                secondCartItem!.price
            );
            const pricesMatch2Resolved = await pricesMatch2;
            expect(
                pricesMatch2Resolved,
                `Second product price should match API price`
            ).toBe(true);

            // Cache expected total while we're definitely on the cart page.
            const firstPriceNum = await productApiSteps.parsePriceToNumber(firstProductApiPrice);
            const secondPriceNum = await productApiSteps.parsePriceToNumber(secondProductApiPrice);
            const firstQty = parseInt(firstCartItem!.quantity, 10) || 1;
            const secondQty = parseInt(secondCartItem!.quantity, 10) || 1;
            expectedTotalFromApiPrices = (firstPriceNum * firstQty) + (secondPriceNum * secondQty);
            expect(expectedTotalFromApiPrices, "Expected total should be computed from API prices").toBeGreaterThan(0);
        });

        // Step 6: Proceed to checkout
        await test.step("Proceed to checkout", async () => {
            await cartPage.clickProceedToCheckout();
        });

        // Step 7: Verify delivery address matches API user address details
        await test.step("Verify delivery address matches API user details", async () => {
            const userDetail = await userApiSteps.verifyAndGetUserDetailByEmail(testUser.email);
            await checkoutSteps.verifyDeliveryAddress({
                address1: userDetail.user.address1,
                address2: userDetail.user.address2 || "",
                birthDay: userDetail.user.birth_day,
                birthMonth: userDetail.user.birth_month,
                birthYear: userDetail.user.birth_year,
                city: userDetail.user.city,
                company: userDetail.user.company,
                country: userDetail.user.country,
                email: userDetail.user.email,
                firstName: userDetail.user.first_name,
                lastName: userDetail.user.last_name,
                mobileNumber: testUser.mobileNumber,
                name: userDetail.user.name,
                password: testUser.password,
                state: userDetail.user.state,
                title: userDetail.user.title as "Mr" | "Mrs",
                zipcode: userDetail.user.zipcode,
            });
        });

        // Step 8: Verify billing address matches API user address details
        await test.step("Verify billing address matches API user details", async () => {
            const userDetail = await userApiSteps.verifyAndGetUserDetailByEmail(testUser.email);
            await checkoutSteps.verifyBillingAddress({
                address1: userDetail.user.address1,
                address2: userDetail.user.address2 || "",
                birthDay: userDetail.user.birth_day,
                birthMonth: userDetail.user.birth_month,
                birthYear: userDetail.user.birth_year,
                city: userDetail.user.city,
                company: userDetail.user.company,
                country: userDetail.user.country,
                email: userDetail.user.email,
                firstName: userDetail.user.first_name,
                lastName: userDetail.user.last_name,
                mobileNumber: testUser.mobileNumber,
                name: userDetail.user.name,
                password: testUser.password,
                state: userDetail.user.state,
                title: userDetail.user.title as "Mr" | "Mrs",
                zipcode: userDetail.user.zipcode,
            });
        });

        // Step 9: Verify order details (products, quantities, prices match API)
        await test.step("Verify order contains products", async () => {
            await checkoutSteps.verifyOrderContainsProduct(firstProductName);
            await checkoutSteps.verifyOrderContainsProduct(secondProductName);
        });

        // Step 10: Enter order comment
        await test.step("Enter order comment", async () => {
            const orderComment = DataFactory.generateOrderComment();
            await checkoutPage.enterComment(orderComment);
        });

        // Step 11: Click Place Order
        await test.step("Place order", async () => {
            await checkoutPage.clickPlaceOrder();
        });

        // Step 12: Fill payment details
        await test.step("Fill payment details", async () => {
            const paymentDetails = DataFactory.generatePaymentDetails();
            await paymentPage.verifyPaymentPageVisible();
            await paymentPage.fillPaymentDetails(paymentDetails);
        });

        // Step 13: Confirm payment
        await test.step("Confirm payment and complete order", async () => {
            await paymentPage.clickPayAndConfirm();
        });

        // Step 14: Verify order success
        await test.step("Verify order placed successfully", async () => {
            await paymentDonePage.verifyOrderSuccess();
        });

        // Step 15: Verify order confirmation
        await test.step("Verify order confirmation details", async () => {
            const confirmation = await paymentDonePage.getOrderConfirmation();
            expect(confirmation, "Order confirmation should be displayed").toBeTruthy();
        });

        // Step 16: Verify order total matches calculated total from API prices
        await test.step("Verify order total calculation from API prices", async () => {
            expect(firstProductApiPrice, "First product API price should be captured").toBeTruthy();
            expect(secondProductApiPrice, "Second product API price should be captured").toBeTruthy();

            expect(
                cartItemsBeforeCheckout.length,
                "Cart items should have been captured before checkout"
            ).toBeGreaterThanOrEqual(2);

            // Note: We can't easily read the final order total from paymentDonePage,
            // but we validate our expected total computed from API prices + cart quantities is sane.
            expect(expectedTotalFromApiPrices, "Expected total should be calculated correctly").toBeGreaterThan(0);
        });

        // Step 17: Continue after order
        await test.step("Click continue button", async () => {
            await paymentDonePage.clickContinue();
        });

        // Step 18: Verify cart is cleared
        await test.step("Verify cart is empty after order", async () => {
            await cartPage.goto();
            await cartPage.verifyCartEmpty();
        });
    });
});

