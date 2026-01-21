import { expect } from '@playwright/test';
import { StatusCode } from '@constants/StatusCode';
import { Brand, BrandsListResponseSchema } from '@models/BrandModels';
import { step } from '@utils/StepDecorator';
import { BrandService } from '../Services/BrandService';

/**
 * BrandApiSteps - API operations for brand data
 * Used for validating brand data between API and UI
 */
export class BrandApiSteps {
    constructor(private brandService: BrandService) {}

    /**
     * Verify and get all brands via API
     * @returns Array of brands
     */
    @step('API: Verify and get all brands')
    async verifyAndGetAllBrands(): Promise<Brand[]> {
        const response = await this.brandService.getAllBrands();

        // Assert HTTP status
        await expect(
            response,
            `Get all brands API should return HTTP 200, got ${response.status()}`
        ).toHaveStatusCode(StatusCode.OK);

        // Validate response schema
        const body = await response.json();
        const parsed = BrandsListResponseSchema.safeParse(body);
        expect(
            parsed.success,
            `Brands list response schema validation should succeed.\nIssues: ${
                parsed.success ? 'none' : JSON.stringify(parsed.error.issues)
            }`
        ).toBeTruthy();
        if (!parsed.success) {
            throw parsed.error;
        }

        // Assert response code
        await expect(
            parsed.data.responseCode,
            `Response code should be 200, got ${parsed.data.responseCode}`
        ).toHaveStatusCode(StatusCode.OK);

        return parsed.data.brands;
    }

    /**
     * Get brand by name from brands list
     * @param brands Array of brands
     * @param brandName Brand name to find
     * @returns Brand if found, undefined otherwise
     */
    @step('API: Find brand by name in list')
    async getBrandByName(brands: Brand[], brandName: string): Promise<Brand | undefined> {
        return brands.find(brand => 
            brand.brand.toLowerCase() === brandName.toLowerCase()
        );
    }

    /**
     * Verify if brand exists in API brands list
     * @param brandName Brand name to check
     * @returns true if brand exists, false otherwise
     */
    @step('API: Check if brand exists')
    async isBrandExists(brandName: string): Promise<boolean> {
        const brands = await this.verifyAndGetAllBrands();
        const brand = await this.getBrandByName(brands, brandName);
        return brand !== undefined;
    }

    /**
     * Get brand names as array of strings
     * @param brands Array of brands
     * @returns Array of brand names
     */
    @step('API: Get brand names list')
    async getBrandNames(brands: Brand[]): Promise<string[]> {
        return brands.map(brand => brand.brand);
    }
}

