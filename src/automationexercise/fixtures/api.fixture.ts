import { APIRequestContext } from "@playwright/test";
import { BrandApiSteps } from "@automationexercise/api/api-steps/BrandApiSteps";
import { ProductApiSteps } from "@automationexercise/api/api-steps/ProductApiSteps";
import { UserApiSteps } from "@automationexercise/api/api-steps/UserApiSteps";
import { BrandService } from "@automationexercise/api/Services/BrandService";
import { ProductService } from "@automationexercise/api/Services/ProductService";
import { SearchService } from "@automationexercise/api/Services/SearchService";
import { UserService } from "@automationexercise/api/Services/UserService";

export type ApiFixtures = {
  brandApiSteps: BrandApiSteps;
  brandService: BrandService;
  productApiSteps: ProductApiSteps;
  productService: ProductService;
  searchService: SearchService;
  userApiSteps: UserApiSteps;
  userService: UserService;
};

export const apiFixtures = {
  brandApiSteps: async (
    { brandService }: { brandService: BrandService },
    use: (s: BrandApiSteps) => Promise<void>,
  ) => {
    await use(new BrandApiSteps(brandService));
  },
  brandService: async (
    { request }: { request: APIRequestContext },
    use: (s: BrandService) => Promise<void>,
  ) => {
    await use(new BrandService(request));
  },
  productApiSteps: async (
    {
      productService,
      searchService,
    }: { productService: ProductService; searchService: SearchService },
    use: (s: ProductApiSteps) => Promise<void>,
  ) => {
    await use(new ProductApiSteps(productService, searchService));
  },
  productService: async (
    { request }: { request: APIRequestContext },
    use: (s: ProductService) => Promise<void>,
  ) => {
    await use(new ProductService(request));
  },
  searchService: async (
    { request }: { request: APIRequestContext },
    use: (s: SearchService) => Promise<void>,
  ) => {
    await use(new SearchService(request));
  },
  userApiSteps: async (
    { userService }: { userService: UserService },
    use: (s: UserApiSteps) => Promise<void>,
  ) => {
    await use(new UserApiSteps(userService));
  },
  userService: async (
    { request }: { request: APIRequestContext },
    use: (s: UserService) => Promise<void>,
  ) => {
    await use(new UserService(request));
  },
};
