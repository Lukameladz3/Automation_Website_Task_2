import { expect } from '@playwright/test';
import { ProductDetailPage } from '@pages/ProductDetailPage';
import { ProductsPage } from '@pages/ProductsPage';
import { step } from '@utils/StepDecorator';

export class ProductSteps {
    constructor(
        private productsPage: ProductsPage,
        private productDetailPage: ProductDetailPage
    ) {}

    @step('Verify search results visible')
    async verifySearchResultsVisible(): Promise<void> {
        // Verify searched products heading is displayed after search
        await expect(
            this.productsPage.searchedProductsHeading,
            "Searched products heading should be visible"
        ).toBeVisible();
    }

    @step('Verify products list visible')
    async verifyProductsListVisible(): Promise<void> {
        // Verify at least one product is visible on the products page
        await expect(
            this.productsPage.productItems.first(),
            "At least one product should be visible"
        ).toBeVisible();
    }

    @step('Verify category title')
    async verifyCategoryTitle(expectedTitle: string): Promise<void> {
        await this.productsPage.verifyCategoryTitleVisible(expectedTitle);
    }

    @step('Verify brand title')
    async verifyBrandTitle(brandName: string): Promise<void> {
        await this.productsPage.verifyBrandTitleVisible(brandName);
    }
}
