import { expect, APIResponse } from "@playwright/test";

/**
 * Custom API matchers for response validation
 */
export function expectApiMatchers() {
  // Extend expect with custom matchers
  expect.extend({
    /**
     * Validates response status code
     */
    toHaveStatusCode(response: APIResponse, expectedStatus: number) {
      const actualStatus = response.status();
      const pass = actualStatus === expectedStatus;

      return {
        pass,
        message: () =>
          pass
            ? `Expected status code NOT to be ${expectedStatus}, but got ${actualStatus}`
            : `Expected status code ${expectedStatus}, but got ${actualStatus}`,
      };
    },

    /**
     * Validates response time is within acceptable range
     */
    toBeWithinResponseTime(actualTime: number, maxTime: number) {
      const pass = actualTime <= maxTime;

      return {
        pass,
        message: () =>
          pass
            ? `Expected response time ${actualTime}ms to exceed ${maxTime}ms, but it was within range`
            : `Expected response time to be within ${maxTime}ms, but got ${actualTime}ms (exceeded by ${actualTime - maxTime}ms)`,
      };
    },

    /**
     * Validates content-type header
     */
    toHaveContentType(response: APIResponse, expectedContentType: string) {
      const actualContentType = response.headers()["content-type"];
      const pass = actualContentType === expectedContentType;

      return {
        pass,
        message: () =>
          pass
            ? `Expected content-type NOT to be "${expectedContentType}", but got "${actualContentType}"`
            : `Expected content-type "${expectedContentType}", but got "${actualContentType}"`,
      };
    },

    /**
     * Validates response has JSON body
     */
    async toHaveJsonBody(response: APIResponse) {
      try {
        await response.json();
        return {
          pass: true,
          message: () => "Expected response NOT to have JSON body, but it did",
        };
      } catch {
        return {
          pass: false,
          message: () => "Expected response to have JSON body, but it did not",
        };
      }
    },
  });
}

// Type declarations for custom matchers
declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      toHaveStatusCode(expectedStatus: number): R;
      toBeWithinResponseTime(maxTime: number): R;
      toHaveContentType(expectedContentType: string): R;
      toHaveJsonBody(): Promise<R>;
    }
  }
}
