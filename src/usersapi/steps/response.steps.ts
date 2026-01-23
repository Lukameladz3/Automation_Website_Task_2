import { expect, APIResponse } from "@playwright/test";
import { UsersApiTestData } from "../constants";
import { step } from "../utils";

/**
 * Step class for response validation
 * Encapsulates common response assertion patterns
 */
export class ResponseSteps {
  @step("Verify response status code")
  async verifyStatusCode(response: APIResponse, expectedStatus: number) {
    const actualStatus = response.status();
    expect(
      actualStatus,
      `Expected status code ${expectedStatus}, but got ${actualStatus}`,
    ).toBe(expectedStatus);
  }

  @step("Verify response has JSON content type")
  async verifyJsonContentType(response: APIResponse) {
    const contentType = response.headers()["content-type"];
    expect(
      contentType,
      `Expected JSON content type, but got ${contentType}`,
    ).toBe(UsersApiTestData.CONTENT_TYPES.JSON);
  }

  @step("Verify response time is acceptable")
  async verifyResponseTime(actualTime: number, maxTime: number) {
    expect(
      actualTime,
      `Response time ${actualTime}ms exceeded maximum ${maxTime}ms (exceeded by ${actualTime - maxTime}ms)`,
    ).toBeLessThanOrEqual(maxTime);
  }

  @step("Verify response has valid JSON body")
  async verifyJsonBody(response: APIResponse) {
    let body;
    try {
      body = await response.json();
    } catch (error) {
      throw new Error(`Expected valid JSON body, but parsing failed: ${error}`);
    }
    expect(body).toBeDefined();
    return body;
  }

  @step("Verify error message")
  async verifyErrorMessage(response: APIResponse, expectedMessage: string) {
    const body = await response.json();
    expect(body).toHaveProperty("message");
    expect(body.message).toBe(expectedMessage);
  }

  @step("Measure response time")
  async measureResponseTime(callback: () => Promise<APIResponse>): Promise<{
    response: APIResponse;
    responseTime: number;
  }> {
    const startTime = Date.now();
    const response = await callback();
    const responseTime = Date.now() - startTime;
    return { response, responseTime };
  }
}
