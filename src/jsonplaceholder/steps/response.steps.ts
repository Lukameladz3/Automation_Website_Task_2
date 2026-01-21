import { expect } from "@playwright/test";
import type { APIResponse } from "@playwright/test";
import { step } from "../utils/step-decorator";
import { JsonPlaceholderTestData } from "../constants/json-placeholder.constants";

/**
 * Reusable steps for API response verification.
 * Handles status codes, content types, and response timing.
 */
export class ResponseSteps {
  @step("Verify response status code")
  async verifyStatusCode(
    response: APIResponse,
    expectedStatus: number,
  ): Promise<void> {
    await expect(response).toHaveStatusCode(expectedStatus);
  }

  @step("Verify response status is one of allowed codes")
  async verifyStatusCodeIsOneOf(
    response: APIResponse,
    allowedStatuses: readonly number[] | number[],
  ): Promise<void> {
    const actualStatus = response.status();
    expect(
      [...allowedStatuses],
      `Expected status ${actualStatus} to be one of ${allowedStatuses.join(", ")}`,
    ).toContain(actualStatus);
  }

  @step("Verify JSON content type")
  async verifyJsonContentType(response: APIResponse): Promise<void> {
    const contentType = response.headers()["content-type"];
    expect(contentType).toContain("application/json");
  }

  @step("Verify response time within limit")
  async verifyResponseTime(
    responseTime: number,
    maxMs: number = JsonPlaceholderTestData.GET_POSTS.MAX_RESPONSE_TIME_MS,
  ): Promise<void> {
    expect.soft(responseTime).toBeWithinResponseTime(maxMs);
  }

  @step("Verify empty response body")
  async verifyEmptyBody(response: APIResponse): Promise<void> {
    const body = await response.json();
    expect(Object.keys(body).length).toBe(0);
  }
}
