import { expect } from "@playwright/test";
import type { APIResponse } from "@playwright/test";

declare global {
  // Augment Playwright's expect matchers
  namespace PlaywrightTest {
    interface Matchers<R> {
      toHaveStatusCode(expected: number): Promise<R>;
      toExist(): R;
      toBeWithinResponseTime(maxMs: number): R;
    }
  }
}

type StatusLike = APIResponse | number;

expect.extend({
  async toHaveStatusCode(received: StatusLike, expected: number) {
    const actual =
      typeof (received as APIResponse).status === "function"
        ? (received as APIResponse).status()
        : (received as number);

    const pass = actual === expected;

    return {
      message: () =>
        pass ? `Expected status code to be ${expected}, received ${actual}.` : `Expected status code to be ${expected}, but received ${actual}.`,
      pass,
    };
  },

  toExist(received: any) {
    const pass = received !== null && received !== undefined;

    return {
      message: () =>
        pass
          ? `Expected value not to exist, but received ${received}.`
          : `Expected value to exist, but received ${received}.`,
      pass,
    };
  },

  toBeWithinResponseTime(received: number, maxMs: number) {
    const pass = received < maxMs;
    return {
      message: () =>
        pass
          ? `Expected response time not to be within ${maxMs}ms, but was ${received}ms.`
          : `Expected response time to be within ${maxMs}ms, but was ${received}ms.`,
      pass,
    };
  },
});
