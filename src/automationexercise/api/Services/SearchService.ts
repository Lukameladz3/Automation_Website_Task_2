import { APIResponse } from '@playwright/test';
import { Routes } from '@constants/Routes';
import { ApiClient } from '../ApiClient';

export class SearchService extends ApiClient {
    async searchProduct(searchProduct: string): Promise<APIResponse> {
        return this.post(Routes.API.SEARCH_PRODUCT, { form: { search_product: searchProduct } });
    }

    async searchProductWithoutParameter(): Promise<APIResponse> {
        return this.post(Routes.API.SEARCH_PRODUCT);
    }
}


