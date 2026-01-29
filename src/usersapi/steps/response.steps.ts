import { APIResponse } from "@playwright/test";
import { step } from "../utils";

/**
 * Step class for response validation
 * Encapsulates complex response validation logic
 */
export class ResponseSteps {
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
