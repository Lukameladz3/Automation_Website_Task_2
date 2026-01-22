import { CartPage } from '@pages/CartPage';
import { HomePage } from '@pages/HomePage';
import { ProductDetailPage } from '@pages/ProductDetailPage';
import { ProductsPage } from '@pages/ProductsPage';
import { step } from '@utils/StepDecorator';

/**
 * Reusable steps for cart operations
 */
export class CartSteps {
    constructor(
        private homePage: HomePage,
        private productsPage: ProductsPage,
        private productDetailPage: ProductDetailPage,
        private cartPage: CartPage
    ) { }

    /**
     * Add a single product to cart from products page
     */
    @step('Add single product to cart')
    async addProductToCart(productIndex: number = 0): Promise<void> {
        await this.homePage.clickProducts();
        await this.productsPage.clickViewProduct(productIndex);
        await this.productDetailPage.addToCart();
        await this.productDetailPage.clickViewCart();
    }

    /**
     * Add multiple products to cart
     */
    @step('Add multiple products to cart')
    async addMultipleProducts(productIndices: number[]): Promise<void> {
        for (let i = 0; i < productIndices.length; i++) {
            const index = productIndices[i];
            await this.homePage.clickProducts();
            await this.productsPage.addProductToCart(index);

            // On last product, view cart; otherwise continue shopping
            if (i === productIndices.length - 1) {
                await this.productsPage.clickViewCart();
            } else {
                await this.productsPage.clickContinueShopping();
            }
        }
    }

    /**
     * Verify cart page is displayed and has items
     */
    @step('Verify cart is displayed with items')
    async verifyCartDisplayed(): Promise<void> {
        await this.cartPage.verifyPageOpened();
        await this.cartPage.verifyCartTableVisible();
    }
}
