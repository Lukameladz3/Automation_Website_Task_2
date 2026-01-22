import { expect, test } from "@fixtures/index";

test.describe("TC03: Add Multiple Products to Cart", () => {
  test("should add multiple products with different quantities and verify cart", async ({
    cartPage,
    homePage,
    productDetailPage,
    productsPage,
    productSteps,
  }) => {
    let firstProductName: string;
    let secondProductName: string;
    const firstProductQuantity = 3;

    // Step 1: Navigate to products page
    await test.step("Navigate to products page", async () => {
      await homePage.goto();
      await homePage.clickProducts();
      await productsPage.verifyPageOpened();
      await productSteps.verifyProductsListVisible();
    });

    // Step 2: Select first product and view details
    await test.step("View first product details", async () => {
      await productsPage.clickViewProduct(0);
      await productDetailPage.verifyProductDetailVisible();
    });

    // Step 3: Set quantity to 3 and add to cart
    await test.step("Add first product with quantity 3", async () => {
      firstProductName = await productDetailPage.getProductName();
      await productDetailPage.setQuantity(firstProductQuantity);
      await productDetailPage.addToCart();
      await productDetailPage.clickContinueShopping();
    });

    // Step 4: Navigate back to products
    await test.step("Return to products page", async () => {
      await productsPage.goto();
      await productSteps.verifyProductsListVisible();
    });

    // Step 5: Add second product (different from first)
    await test.step("Add second product with quantity 1", async () => {
      // Navigate back to products page first
      await productsPage.goto();
      await productsPage.clickViewProduct(1);
      secondProductName = await productDetailPage.getProductName();
      await productDetailPage.addToCart();
      await productDetailPage.clickViewCart();
    });

    // Step 6: Verify cart contains both products
    await test.step("Verify both products in cart", async () => {
      await cartPage.verifyCartTableVisible();
      await cartPage.verifyProductInCart(firstProductName);
      await cartPage.verifyProductInCart(secondProductName);
    });

    // Step 7: Verify quantities
    await test.step("Verify product quantities", async () => {
      const firstQty = await cartPage.getProductQuantity(firstProductName);
      const secondQty = await cartPage.getProductQuantity(secondProductName);

      expect(
        firstQty,
        `First product should have quantity ${firstProductQuantity}`,
      ).toBe(firstProductQuantity);
      expect(secondQty, "Second product should have quantity 1").toBe(1);
    });

    // Step 8: Verify cart item count
    await test.step("Verify cart has 2 products", async () => {
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount, "Cart should contain 2 products").toBe(2);
    });

    // Step 9: Verify cart items details
    await test.step("Verify cart items have prices and totals", async () => {
      const items = await cartPage.getCartItems();
      expect(items.length, "Cart should have 2 items").toBe(2);

      // Verify each item has required data
      const allItemsHaveRequiredData = items.every(
        (item) => item.name && item.price && item.quantity && item.total,
      );
      expect(
        allItemsHaveRequiredData,
        "All items should have name, price, quantity, and total",
      ).toBe(true);
    });
  });
});
