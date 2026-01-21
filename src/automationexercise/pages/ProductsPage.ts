import { expect, Locator, Page } from "@playwright/test";
import { Routes } from "../constants/Routes";
import { BasePage } from "./BasePage";

export class ProductsPage extends BasePage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly searchedProductsHeading: Locator;
  readonly productsList: Locator;
  readonly productItems: Locator;
  readonly categorySidebar: Locator;
  readonly brandsSidebar: Locator;
  readonly viewCartModal: Locator;
  readonly continueShoppingButton: Locator;
  readonly viewCartButton: Locator;
  readonly categoryTitleHeading = (expectedTitle: string): Locator =>
    this.page
      .getByRole("heading", { name: new RegExp(expectedTitle, "i") })
      .describe(`Category title heading: "${expectedTitle}"`);
  readonly brandTitleHeading = (brandName: string): Locator =>
    this.page
      .getByRole("heading", { name: new RegExp(`brand.*${brandName}`, "i") })
      .describe(`Brand title heading contains: "${brandName}"`);

  // Selectors for dynamic locators used in methods
  private readonly addToCartSelector = ".add-to-cart";
  private readonly modalContentSelector = ".modal-content";
  private readonly productInfoNameSelector = ".productinfo p";
  private readonly productInfoPriceSelector = ".productinfo h2";
  private readonly categoryProductsLinkSelector =
    "a[href*='category_products']";

  constructor(page: Page) {
    super(
      page,
      page
        .getByRole("heading", { name: /all products/i })
        .describe("All Products heading"),
    );

    this.searchInput = this.page
      .locator("#search_product")
      .describe("Search product input");
    this.searchButton = this.page
      .locator("#submit_search")
      .describe("Search submit button");
    this.searchedProductsHeading = this.page
      .getByRole("heading", { name: /searched products/i })
      .describe("Searched Products heading");
    this.productsList = this.page
      .locator(".features_items")
      .describe("Products list container");
    this.productItems = this.productsList
      .locator(".col-sm-4")
      .describe("Individual product items");
    this.categorySidebar = this.page
      .locator(".left-sidebar .panel-group")
      .describe("Category sidebar");
    this.brandsSidebar = this.page
      .locator(".brands_products")
      .describe("Brands sidebar");
    this.viewCartModal = this.page
      .locator(this.modalContentSelector)
      .describe("View cart modal");
    this.continueShoppingButton = this.viewCartModal
      .getByRole("button", { name: /continue shopping/i })
      .describe("Continue shopping button");
    this.viewCartButton = this.viewCartModal
      .getByRole("link", { name: /view cart/i })
      .describe("View cart button in modal");
  }

  async goto() {
    await super.goto(Routes.WEB.PRODUCTS);
  }

  /**
   * Search for products by keyword
   */
  async search(keyword: string): Promise<void> {
    await this.searchInput.fill(keyword);
    await this.searchButton.click();
  }

  /**
   * Verify search results heading is visible
   */
  async verifySearchResultsVisible(): Promise<void> {
    await expect(
      this.searchedProductsHeading,
      "Searched products heading should be visible",
    ).toBeVisible();
  }

  /**
   * Get all visible product names from search/listing
   */
  async getProductNames(): Promise<string[]> {
    const names: string[] = [];
    const count = await this.productItems.count();

    for (let i = 0; i < count; i++) {
      const productName = await this.productItems
        .nth(i)
        .locator(this.productInfoNameSelector)
        .textContent();
      if (productName) {
        names.push(productName.trim());
      }
    }

    return names;
  }

  /**
   * Get product count
   */
  async getProductCount(): Promise<number> {
    return this.productItems.count();
  }

  /**
   * Click on "View Product" for a specific product by index
   *
   * @remarks
   * This method handles potential ad overlays by using force click as a fallback
   * and ensuring the element is visible before clicking.
   */
  async clickViewProduct(index: number): Promise<void> {
    const viewProductLink = this.productItems
      .nth(index)
      .getByRole("link", { name: /view product/i });

    // Ensure the product is visible and scroll it into view
    await viewProductLink.scrollIntoViewIfNeeded();

    // Try regular click first, then force click if needed (handles ad overlays)
    await this.clickAndWaitForURL(/\/product_details\//, async () => {
      try {
        await viewProductLink.click({ timeout: 5000 });
      } catch (error) {
        // If regular click fails (e.g., due to overlay), force the click
        console.error(error)
        await viewProductLink.click({ force: true });
      }
    });
  }

  /**
   * Add product to cart directly from listing (hover + click)
   */
  async addProductToCart(index: number): Promise<void> {
    const product = this.productItems.nth(index);
    await product.hover();
    await product.locator(this.addToCartSelector).first().click();
    // Modal visibility is automatically ensured by Playwright's auto-waiting
    // when interacting with modal buttons in follow-up actions
  }

  /**
   * Click Continue Shopping button from modal
   */
  async clickContinueShopping(): Promise<void> {
    // Playwright auto-waits for button visibility (including parent modal)
    await this.continueShoppingButton.click();
  }

  /**
   * Click View Cart button from modal
   */
  async clickViewCart(): Promise<void> {
    // Playwright auto-waits for button visibility (including parent modal)
    await this.viewCartButton.click();
  }

  /**
   * Select a category from sidebar
   * @param mainCategory - e.g., "Women", "Men", "Kids"
   * @param subCategory - e.g., "Dress", "Tops", "Jeans"
   */
  async selectCategory(
    mainCategory: string,
    subCategory: string,
  ): Promise<void> {
    // Click main category to expand if needed - use first() to avoid strict mode
    const mainCategoryLink = this.categorySidebar
      .getByRole("link")
      .filter({ hasText: new RegExp(`^\\s*${mainCategory}\\s*$`) })
      .first();
    await mainCategoryLink.click();

    // Click subcategory
    // Scope to the left sidebar category links to avoid strict-mode collisions with ads/popups.
    const subCategoryLink = this.categorySidebar
      .locator(this.categoryProductsLinkSelector)
      .filter({ hasText: new RegExp(subCategory, "i") })
      .first();
    await subCategoryLink.click();
  }

  /**
   * Select a brand from sidebar
   */
  async selectBrand(brandName: string): Promise<void> {
    await this.brandsSidebar
      .getByRole("link", { name: new RegExp(brandName, "i") })
      .click();
  }

  /**
   * Verify category title is displayed
   */
  async verifyCategoryTitleVisible(expectedTitle: string): Promise<void> {
    await expect(this.categoryTitleHeading(expectedTitle)).toBeVisible();
  }

  async verifyBrandTitleVisible(brandName: string): Promise<void> {
    await expect(this.brandTitleHeading(brandName)).toBeVisible();
  }

  /**
   * Get product price by index
   */
  async getProductPrice(index: number): Promise<string> {
    const priceText = await this.productItems
      .nth(index)
      .locator(this.productInfoPriceSelector)
      .textContent();
    return priceText?.trim() || "";
  }
}
