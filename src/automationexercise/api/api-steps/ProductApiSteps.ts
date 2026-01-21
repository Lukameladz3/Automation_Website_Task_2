import { expect } from '@playwright/test';
import { StatusCode } from '@constants/StatusCode';
import { Product, ProductsListResponseSchema, SearchProductResponseSchema } from '@models/ProductModels';
import { parsePriceToNumber as parsePrice, pricesMatch } from '@utils/PriceUtils';
import { retry, RetryableError } from '@utils/Retry';
import { step } from '@utils/StepDecorator';
import { ProductService } from '../Services/ProductService';
import { SearchService } from '../Services/SearchService';

/**
 * ProductApiSteps - API operations for product data
 * Used for validating product data between API and UI
 */
export class ProductApiSteps {
    constructor(
        private productService: ProductService,
        private searchService: SearchService
    ) {}

    /**
     * Verify and get all products via API
     * @returns Array of products
     */
    @step('API: Verify and get all products')
    async verifyAndGetAllProducts(): Promise<Product[]> {
        const response = await retry(async (attempt) => {
            const res = await this.productService.getAllProducts();
            const status = res.status();
            if ([StatusCode.INTERNAL_SERVER_ERROR, 502, 503, 504].includes(status)) {
                const body = await res.json().catch(() => undefined);
                throw new RetryableError(
                    `Transient API error (attempt ${attempt}): status=${status}, body=${JSON.stringify(body)}`
                );
            }
            return res;
        });

        await expect(
            response,
            `Get all products API should return HTTP 200, got ${response.status()}`
        ).toHaveStatusCode(StatusCode.OK);

        const body = await response.json();
        const parsed = ProductsListResponseSchema.safeParse(body);
        expect(
            parsed.success,
            `Products list response schema validation should succeed.\nIssues: ${
                parsed.success ? 'none' : JSON.stringify(parsed.error.issues)
            }`
        ).toBeTruthy();
        if (!parsed.success) {
            throw parsed.error;
        }

        await expect(
            parsed.data.responseCode,
            `Response code should be 200, got ${parsed.data.responseCode}`
        ).toHaveStatusCode(StatusCode.OK);

        return parsed.data.products;
    }

    /**
     * Search products via API
     * @param searchTerm Search keyword
     * @returns Array of matching products
     */
    @step('API: Search products')
    async searchProducts(searchTerm: string): Promise<Product[]> {
        const response = await retry(async (attempt) => {
            const res = await this.searchService.searchProduct(searchTerm);
            const status = res.status();
            if ([StatusCode.INTERNAL_SERVER_ERROR, 502, 503, 504].includes(status)) {
                const body = await res.json().catch(() => undefined);
                throw new RetryableError(
                    `Transient API error (attempt ${attempt}): status=${status}, body=${JSON.stringify(body)}`
                );
            }
            return res;
        });

        await expect(
            response,
            `Search products API should return HTTP 200 for "${searchTerm}", got ${response.status()}`
        ).toHaveStatusCode(StatusCode.OK);

        const body = await response.json();
        const parsed = SearchProductResponseSchema.safeParse(body);
        expect(
            parsed.success,
            `Search product response schema validation should succeed.\nIssues: ${
                parsed.success ? 'none' : JSON.stringify(parsed.error.issues)
            }`
        ).toBeTruthy();
        if (!parsed.success) {
            throw parsed.error;
        }

        await expect(
            parsed.data.responseCode,
            `Search response code should be 200, got ${parsed.data.responseCode}`
        ).toHaveStatusCode(StatusCode.OK);

        return parsed.data.products;
    }

    /**
     * Get product by ID from products list
     * @param products Array of products
     * @param productId Product ID to find
     * @returns Product if found, undefined otherwise
     */
    @step('API: Find product by ID in list')
    async getProductById(products: Product[], productId: number): Promise<Product | undefined> {
        return products.find(product => product.id === productId);
    }

    /**
     * Get product by name from products list
     * @param products Array of products
     * @param productName Product name to find
     * @returns Product if found, undefined otherwise
     */
    @step('API: Find product by name in list')
    async getProductByName(products: Product[], productName: string): Promise<Product | undefined> {
        const normalize = (value: string) =>
            value
                .replace(/\u00a0/g, " ") // NBSP → space
                .replace(/\s+/g, " ")
                .trim()
                .toLowerCase();

        const target = normalize(productName);
        return products.find((product) => {
            const apiName = normalize(product.name);
            return apiName.includes(target) || target.includes(apiName);
        });
    }

    /**
     * Verify product prices match between API and UI
     * Handles price format differences (e.g., "Rs. 500" vs "500")
     * @param apiProduct Product from API
     * @param uiPrice Price string from UI
     * @returns true if prices match, false otherwise
     */
    @step('API: Verify UI price matches API price')
    async verifyProductPricesMatch(apiProduct: Product, uiPrice: string): Promise<boolean> {
        return pricesMatch(apiProduct.price, uiPrice);
    }

    /**
     * Parse price string to number (removes currency symbols)
     * @param priceString Price string (e.g., "Rs. 500" or "$50.00")
     * @returns Numeric price value
     */
    @step('API: Parse price string to number')
    async parsePriceToNumber(priceString: string): Promise<number> {
        return parsePrice(priceString);
    }
}

