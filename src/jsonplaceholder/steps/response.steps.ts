import { expect } from "@playwright/test";
import type { APIResponse } from "@playwright/test";
import { step } from "../utils/step-decorator";

/**
 * Reusable steps for API response verification.
 * Handles complex response validation logic.
 */
export class ResponseSteps {
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
}
