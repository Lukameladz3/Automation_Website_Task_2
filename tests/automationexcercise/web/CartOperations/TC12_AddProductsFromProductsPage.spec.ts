import { expect, test } from "@fixtures/index";

test.describe("TC12: Add Products in Cart", () => {
  test("should add multiple products from products page and verify cart", async ({
    cartPage,
    homePage,
    productsPage,
  }) => {
    // Step 0: Clear cart first to ensure clean state
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

    // Step 4: Click Products button
    await test.step("Navigate to products page", async () => {
      await homePage.clickProducts();
      await productsPage.verifyPageOpened();
    });

    // Step 5-6: Add first product
    await test.step("Add first product to cart", async () => {
      await productsPage.addProductToCart(0);
      await productsPage.clickContinueShopping();
    });

    // Step 7-8: Add second product and view cart
    await test.step("Add second product and view cart", async () => {
      await productsPage.addProductToCart(1);
      await productsPage.clickViewCart();
    });

    // Step 9: Verify both products are in cart
    await test.step("Verify both products added to cart", async () => {
      const items = await cartPage.getCartItems();
      expect(items.length, "Cart should have 2 products").toBe(2);
    });

    // Step 10: Verify prices, quantity and total
    await test.step("Verify product details (price, quantity, total)", async () => {
      const items = await cartPage.getCartItems();

      // Verify each item has all required fields
      const allItemsHaveRequiredFields = items.every(
        (item) => item.price && item.quantity && item.total,
      );
      expect(
        allItemsHaveRequiredFields,
        "All items should have price, quantity, and total",
      ).toBe(true);

      // Verify quantity is 1 for each (since we added 1 of each)
      const allQuantitiesAreOne = items.every(
        (item) => parseInt(item.quantity) === 1,
      );
      expect(allQuantitiesAreOne, "All products should have quantity 1").toBe(
        true,
      );
    });
  });
});
