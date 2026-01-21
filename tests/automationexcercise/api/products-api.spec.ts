import { Routes } from "@constants/Routes";
import { StatusCode } from "@constants/StatusCode";
import { TestData } from "@constants/TestData";
import { expect, test } from "@fixtures/index";
import { ProductsListResponseSchema } from "@models/ProductModels";

test.describe("Products API", () => {
  test("API 1: Get All Products List", async ({ productService }) => {
    const response = await productService.getAllProducts();

    // Assert HTTP status code
    await expect(
      response,
      `GET ${Routes.API.PRODUCTS_LIST} HTTP status should be ${StatusCode.OK}`,
    ).toHaveStatusCode(StatusCode.OK);

    // Validate response schema
    const body = await response.json();
    const parsed = ProductsListResponseSchema.parse(body);

    // Assert response structure (responseCode in body should match HTTP status)
    await expect(
      parsed.responseCode,
      `Response code in body should be ${StatusCode.OK}`,
    ).toHaveStatusCode(StatusCode.OK);
    expect(parsed.products, "Products list should be an array").toBeInstanceOf(
      Array,
    );
    expect(
      parsed.products.length,
      "Products list should contain items",
    ).toBeGreaterThan(0);
  });

  test("API 2: POST To All Products List", async ({ productService }) => {
    const response = await productService.postToProductsList();

    // API returns HTTP 200 and uses responseCode in body for actual status
    await expect(
      response,
      `POST ${Routes.API.PRODUCTS_LIST} HTTP status should be 200 OK (error encoded in body.responseCode)`,
    ).toHaveStatusCode(StatusCode.OK);

    // Validate response message
    const body = await response.json();
    expect(
      body.responseCode,
      `Response code in body should be ${StatusCode.METHOD_NOT_ALLOWED}`,
    ).toBe(StatusCode.METHOD_NOT_ALLOWED);
    expect(
      body.message,
      `Response message should indicate method not supported`,
    ).toBe(TestData.API.METHOD_NOT_ALLOWED_MESSAGE);
  });
});
