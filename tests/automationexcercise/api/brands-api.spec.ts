import { Routes } from "@constants/Routes";
import { StatusCode } from "@constants/StatusCode";
import { TestData } from "@constants/TestData";
import { expect, test } from "@fixtures/index";
import { BrandsListResponseSchema } from "@models/BrandModels";

test.describe("Brands API", () => {
  test("API 3: Get All Brands List", async ({ brandService }) => {
    const response = await brandService.getAllBrands();

    // Assert HTTP status code
    await expect(
      response,
      `GET ${Routes.API.BRANDS_LIST} HTTP status should be 200 OK`,
    ).toHaveStatusCode(StatusCode.OK);

    // Validate response schema
    const body = await response.json();
    const parsed = BrandsListResponseSchema.parse(body);

    // Assert response structure (responseCode in body should match HTTP status)
    await expect(
      parsed.responseCode,
      "Response code in body should be 200",
    ).toHaveStatusCode(StatusCode.OK);
    expect(parsed.brands, "Brands list should be an array").toBeInstanceOf(
      Array,
    );
    expect(
      parsed.brands.length,
      "Brands list should contain items",
    ).toBeGreaterThan(0);
  });

  test("API 4: PUT To All Brands List", async ({ brandService }) => {
    const response = await brandService.putToBrandsList();

    // API returns HTTP 200 and uses responseCode in body for actual status
    await expect(
      response,
      `PUT ${Routes.API.BRANDS_LIST} HTTP status should be 200 OK (error encoded in body.responseCode)`,
    ).toHaveStatusCode(StatusCode.OK);

    // Validate response body
    const body = await response.json();
    expect(
      body.responseCode,
      `Response code in body should be ${StatusCode.METHOD_NOT_ALLOWED}`,
    ).toBe(StatusCode.METHOD_NOT_ALLOWED);
    expect(
      body.message,
      "Response message should indicate method not supported",
    ).toBe(TestData.API.METHOD_NOT_ALLOWED_MESSAGE);
  });
});
