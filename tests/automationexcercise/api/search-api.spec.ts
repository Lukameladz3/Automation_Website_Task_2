import { StatusCode } from "@constants/StatusCode";
import { TestData } from "@constants/TestData";
import { expect, test } from "@fixtures/index";
import { SearchProductResponseSchema } from "@models/ProductModels";

test.describe("Search Product API", () => {
  test("API 5: POST To Search Product with search_product parameter", async ({
    searchService,
  }) => {
    const searchTerms = ["top", "tshirt", "jean"];

    for (const searchTerm of searchTerms) {
      const response = await searchService.searchProduct(searchTerm);

      // Assert status code
      await expect(
        response,
        `POST /api/searchProduct with search_product="${searchTerm}" should return 200 OK`,
      ).toHaveStatusCode(StatusCode.OK);

      // Validate response schema
      const body = await response.json();
      const parsed = SearchProductResponseSchema.parse(body);

      // Assert response structure
      expect(parsed.responseCode, "Response code should be 200").toBe(
        StatusCode.OK,
      );
      expect(
        parsed.products,
        "Search results should be an array",
      ).toBeInstanceOf(Array);
    }
  });

  test("API 6: POST To Search Product without search_product parameter", async ({
    searchService,
  }) => {
    const response = await searchService.searchProductWithoutParameter();

    // API returns HTTP 200 and uses responseCode in body for actual status
    await expect(
      response,
      "POST /api/searchProduct without search_product parameter should return 200 OK (error encoded in body.responseCode)",
    ).toHaveStatusCode(StatusCode.OK);

    // Validate response message
    const body = await response.json();
    expect(
      body.responseCode,
      "Response code in body should be 400 Bad Request",
    ).toBe(StatusCode.BAD_REQUEST);
    expect(
      body.message,
      "Response message should indicate missing search_product parameter",
    ).toBe(TestData.API.MISSING_SEARCH_PRODUCT_MESSAGE);
  });
});
