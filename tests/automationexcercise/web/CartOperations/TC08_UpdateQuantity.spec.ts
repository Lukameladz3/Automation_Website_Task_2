import { expect, test } from '@fixtures/index';

test.describe("TC08: Update Product Quantity in Cart", () => {
    test("should update product quantities and verify calculations", async ({
        cartPage,
        homePage,
        productDetailPage,
        productsPage,
    }) => {
        let productName: string;
        let productPrice: string;

        // Step 0: Clear cart first
        await test.step("Clear cart if needed", async () => {
            await cartPage.goto();
            await cartPage.clearCart();
            await cartPage.verifyCartEmpty();
        });

        // Step 1: Add product to cart with quantity 1
        await test.step("Add product with initial quantity 1", async () => {
            await homePage.goto();
            await homePage.clickProducts();
            await productsPage.clickViewProduct(0);
            productName = await productDetailPage.getProductName();
            productPrice = await productDetailPage.getProductPrice();
            await productDetailPage.setQuantity(1);
            await productDetailPage.addToCart();
            await productDetailPage.clickViewCart();
        });

        // Step 2: Verify initial quantity is 1
        await test.step("Verify initial quantity is 1", async () => {
            const initialQty = await cartPage.getProductQuantity(productName);
            expect(initialQty, "Initial quantity should be 1").toBe(1);
        });

        // Step 3: TEST - Since cart updates on this site require re-adding product
        // We'll verify the quantity mechanism by adding the same product again from details
        await test.step("Increase quantity by adding product again", async () => {
            await productsPage.goto();
            await productsPage.clickViewProduct(0);
            await productDetailPage.setQuantity(4); // Add 4 more
            await productDetailPage.addToCart();
            await productDetailPage.clickViewCart();
        });

        // Step 4: Verify quantity updated
        await test.step("Verify quantity increased", async () => {
            const updatedQty = await cartPage.getProductQuantity(productName);
            const expectedQty = 5; // 1 + 4
            expect(updatedQty, `Quantity should be ${expectedQty}`).toBe(expectedQty);
        });

        // Step 5: Verify total calculation
        await test.step("Verify price calculations are accurate", async () => {
            const productTotal = await cartPage.getProductTotal(productName);

            // Extract numeric price
            const priceNum = parseFloat(productPrice.replace(/Rs\.\s*/, ""));
            const updatedQty = await cartPage.getProductQuantity(productName);
            const expectedTotal = `Rs. ${priceNum * updatedQty}`;

            // Verify the total matches expected calculation
            expect(
                productTotal.replace(/\s/g, ""),
                "Product total should equal price × quantity"
            ).toBe(expectedTotal.replace(/\s/g, ""));
        });

        // Step 6: Verify cart total
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
