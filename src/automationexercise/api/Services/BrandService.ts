import { APIResponse } from '@playwright/test';
import { Routes } from '@constants/Routes';
import { ApiClient } from '../ApiClient';

export class BrandService extends ApiClient {
    async getAllBrands(): Promise<APIResponse> {
        return this.get(Routes.API.BRANDS_LIST);
    }

    async putToBrandsList(): Promise<APIResponse> {
        return this.put(Routes.API.BRANDS_LIST);
    }
}


