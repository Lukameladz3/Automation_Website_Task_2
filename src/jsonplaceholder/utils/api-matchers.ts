import { expect } from "@playwright/test";
import type { APIResponse } from "@playwright/test";

declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      toHaveStatusCode(expected: number): Promise<R>;
      toBeWithinResponseTime(maxMs: number): R;
    }
  }
}

expect.extend({
  async toHaveStatusCode(received: APIResponse, expected: number) {
    const actual = received.status();
    const pass = actual === expected;

    return {
      message: () =>
        pass
          ? `Expected status code not to be ${expected}`
          : `Expected status code to be ${expected}, but received ${actual}`,
      pass,
    };
  },

  toBeWithinResponseTime(received: number, maxMs: number) {
    const pass = received < maxMs;
    return {
      message: () =>
        pass
          ? `Expected response time to exceed ${maxMs}ms, but was ${received}ms`
          : `Expected response time to be within ${maxMs}ms, but was ${received}ms`,
      pass,
    };
  },
});
