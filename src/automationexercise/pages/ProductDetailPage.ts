import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ProductDetailPage extends BasePage {
    readonly productName: Locator;
    readonly productPrice: Locator;
    readonly productCategory: Locator;
    readonly productAvailability: Locator;
    readonly productCondition: Locator;
    readonly productBrand: Locator;
    readonly quantityInput: Locator;
    readonly addToCartButton: Locator;
    readonly viewCartModal: Locator;
    readonly continueShoppingButton: Locator;
    readonly viewCartButton: Locator;
    readonly reviewSection: Locator;
    readonly reviewNameInput: Locator;
    readonly reviewEmailInput: Locator;
    readonly reviewTextarea: Locator;
    readonly reviewSubmitButton: Locator;
    readonly reviewSuccessMessage: Locator;

    // Selectors for dynamic locators used in methods
    private readonly reviewsLinkSelector = "a[href='#reviews']";

    constructor(page: Page) {
        super(page, page.locator(".product-information h2"));

        this.productName = this.page
            .locator(".product-information h2")
            .describe("Product name");
        this.productPrice = this.page
            .locator(".product-information span span")
            .describe("Product price");
        this.productCategory = this.page
            .locator(".product-information p")
            .filter({ hasText: /category/i })
            .describe("Product category");
        this.productAvailability = this.page
            .locator(".product-information p")
            .filter({ hasText: /availability/i })
            .describe("Product availability");
        this.productCondition = this.page
            .locator(".product-information p")
            .filter({ hasText: /condition/i })
            .describe("Product condition");
        this.productBrand = this.page
            .locator(".product-information p")
            .filter({ hasText: /brand/i })
            .describe("Product brand");
        this.quantityInput = this.page
            .locator("#quantity")
            .describe("Quantity input");
        this.addToCartButton = this.page
            .locator("button.cart")
            .describe("Add to cart button");
        this.viewCartModal = this.page
            .locator(".modal-content")
            .describe("View cart modal");
        this.continueShoppingButton = this.viewCartModal
            .getByRole("button", { name: /continue shopping/i })
            .describe("Continue shopping button");
        this.viewCartButton = this.viewCartModal
            .getByRole("link", { name: /view cart/i })
            .describe("View cart button in modal");

        // Initialize review section locators
        this.reviewSection = page.locator(".category-tab");
        this.reviewNameInput = page.locator("#name");
        this.reviewEmailInput = page.locator("#email");
        this.reviewTextarea = page.locator("#review");
        this.reviewSubmitButton = page.locator("#button-review");
        this.reviewSuccessMessage = page.locator(".alert-success").filter({ hasText: "Thank you for your review" });
    }

    /**
     * Set product quantity
     */
    async setQuantity(quantity: number): Promise<void> {
        await this.quantityInput.clear();
        await this.quantityInput.fill(String(quantity));
    }

    /**
     * Add product to cart
     */
    async addToCart(): Promise<void> {
        await this.addToCartButton.click();
        await this.viewCartModal.waitFor({ state: "visible" });
    }

    /**
     * Click "Continue Shopping" in modal after adding to cart
     */
    async clickContinueShopping(): Promise<void> {
        await this.continueShoppingButton.click();
        await this.viewCartModal.waitFor({ state: "hidden" });
    }

    /**
     * Click "View Cart" in modal after adding to cart
     */
    async clickViewCart(): Promise<void> {
        await this.viewCartButton.click();
    }

    /**
     * Verify Write Your Review section is visible
     */
    async verifyReviewSectionVisible(): Promise<void> {
        await expect(
            this.page.locator(this.reviewsLinkSelector),
            "Write Your Review link should be visible"
        ).toBeVisible();
    }

    /**
     * Fill and submit product review
     */
    async submitReview(name: string, email: string, review: string): Promise<void> {
        await this.reviewNameInput.fill(name);
        await this.reviewEmailInput.fill(email);
        await this.reviewTextarea.fill(review);
        await this.reviewSubmitButton.click();
    }

    /**
     * Verify review success message
     */
    async verifyReviewSuccess(): Promise<void> {
        await expect(
            this.reviewSuccessMessage,
            "Review success message should be visible"
        ).toBeVisible();
        await expect(
            this.reviewSuccessMessage,
            "Success message should contain thank you text"
        ).toContainText("Thank you for your review");
    }
    /**
     * Get product name text
     */
    async getProductName(): Promise<string> {
        const name = await this.productName.textContent();
        return name?.trim() || "";
    }

    /**
     * Get product price text
     */
    async getProductPrice(): Promise<string> {
        const price = await this.productPrice.textContent();
        return price?.trim() || "";
    }

    /**
     * Get product category text
     */
    async getProductCategory(): Promise<string> {
        const category = await this.productCategory.textContent();
        return category?.trim() || "";
    }

    /**
     * Get product availability text
     */
    async getProductAvailability(): Promise<string> {
        const availability = await this.productAvailability.textContent();
        return availability?.trim() || "";
    }

    /**
     * Verify product detail page is opened
     */
    async verifyProductDetailVisible(): Promise<void> {
        await expect(
            this.productName,
            "Product name should be visible on detail page"
        ).toBeVisible();
        await expect(
            this.productPrice,
            "Product price should be visible on detail page"
        ).toBeVisible();
    }

    /**
     * Get all product information
     */
    async getProductInfo(): Promise<{
        availability: string;
        category: string;
        name: string;
        price: string;
    }> {
        return {
            availability: await this.getProductAvailability(),
            category: await this.getProductCategory(),
            name: await this.getProductName(),
            price: await this.getProductPrice(),
        };
    }
}
