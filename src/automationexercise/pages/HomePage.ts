import { expect, Locator, Page } from "@playwright/test";
import { NavigationMenu } from "../components/NavigationMenu";
import { Routes } from "../constants/Routes";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
  readonly navigation: NavigationMenu;
  readonly loggedInText: Locator;
  readonly subscriptionText: Locator;
  readonly fullFledgedText: Locator;
  readonly scrollUpArrowButton: Locator;
  readonly recommendedItemsSection: Locator;
  readonly recommendedItemsHeading: Locator;
  readonly recommendedProductItems: Locator;
  readonly viewCartModal: Locator;
  readonly viewCartButton: Locator;

  // Selectors for dynamic locators used in methods
  private readonly productInfoNameSelector = ".productinfo p";
  private readonly productInfoAddToCartSelector = ".productinfo a.add-to-cart";

  constructor(page: Page, navigation: NavigationMenu) {
    super(page, page.locator("h1, h2").first().describe("Home page heading"));
    this.navigation = navigation;

    this.loggedInText = page.locator("li").filter({ hasText: "Logged in as" }).describe("Logged in text");
    this.subscriptionText = page.locator("h2").filter({ hasText: "Subscription" }).describe("Subscription heading");
    this.fullFledgedText = page.getByText("Full-Fledged practice website for Automation Engineers").first().describe("Full-fledged practice text");
    this.scrollUpArrowButton = page.locator("#scrollUp").describe("Scroll up arrow button");

    // Recommended items section
    this.recommendedItemsSection = page.locator(".recommended_items");
    this.recommendedItemsHeading = this.recommendedItemsSection.locator("h2.title");
    this.recommendedProductItems = this.recommendedItemsSection.locator(".product-image-wrapper");

    // Modal
    this.viewCartModal = page.locator(".modal-content");
    this.viewCartButton = this.viewCartModal.locator("u").filter({ hasText: "View Cart" });
  }

  async goto(): Promise<void> {
    await super.goto(Routes.WEB.HOME);
  }

  async clickSignupLogin(): Promise<void> {
    await this.navigation.clickSignupLogin();
  }

  async clickLogout(): Promise<void> {
    await this.navigation.clickLogout();
  }

  async clickProducts(): Promise<void> {
    await this.clickAndWaitForURL(
      new RegExp(`${Routes.WEB.PRODUCTS}(/|\\?|$)`),
      () => this.navigation.productsLink.click(),
    );
  }

  async clickContactUs(): Promise<void> {
    await this.navigation.contactUsLink.click();
  }

  async verifyLoggedInVisible(): Promise<void> {
    await expect(
      this.loggedInText,
      "Logged in text should be visible"
    ).toBeVisible();
  }

  async verifyLoggedInNotVisible(): Promise<void> {
    await expect(
      this.loggedInText,
      "Logged in text should not be visible"
    ).not.toBeVisible();
  }

  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  async scrollToTop(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  async verifySubscriptionVisible(): Promise<void> {
    await expect(
      this.subscriptionText,
      "Subscription text should be visible"
    ).toBeVisible();
  }

  async verifyFullFledgedTextVisible(): Promise<void> {
    await expect(
      this.fullFledgedText,
      "Full-Fledged text should be visible"
    ).toBeVisible();
  }

  async verifyFullFledgedTextInViewport(): Promise<void> {
    await this.verifyFullFledgedTextVisible();
    await expect(
      this.fullFledgedText,
      "Hero text should be in viewport"
    ).toBeInViewport();
  }

  async clickScrollUpArrow(): Promise<void> {
    await this.scrollUpArrowButton.click();
  }

  /**
   * Verify recommended items section is visible
   */
  async verifyRecommendedItemsVisible(): Promise<void> {
    await expect(
      this.recommendedItemsHeading,
      "Recommended items heading should be visible"
    ).toBeVisible();
  }

  /**
   * Get recommended product name by index
   */
  async getRecommendedProductName(index: number): Promise<string> {
    const product = this.recommendedProductItems.nth(index);
    const name = await product.locator(this.productInfoNameSelector).textContent();
    return name?.trim() || "";
  }

  /**
   * Add recommended item to cart by index
   */
  async addRecommendedItemToCart(index: number): Promise<void> {
    // Scroll the section into view first (more reliable than scrolling an individual card).
    await this.recommendedItemsSection.scrollIntoViewIfNeeded();

    // The recommended items section is a carousel; some cards exist but are hidden.
    // Treat `index` as the N-th *visible* recommended card.
    const total = await this.recommendedProductItems.count();
    let visibleIndex = -1;
    let product: Locator | null = null;

    for (let i = 0; i < total; i++) {
      const candidate = this.recommendedProductItems.nth(i);
      if (await candidate.isVisible()) {
        visibleIndex++;
        if (visibleIndex === index) {
          product = candidate;
          break;
        }
      }
    }

    if (!product) {
      throw new Error(`Could not find visible recommended item at visible index ${index} (total cards: ${total})`);
    }

    await product.hover();
    await product.locator(this.productInfoAddToCartSelector).click();
  }

  /**
   * Click View Cart button from modal
   */
  async clickViewCartFromModal(): Promise<void> {
    await this.viewCartButton.click();
  }
}
