import { APIResponse } from "@playwright/test";
import { z } from "zod";

/**
 * Utility class for validating API responses with Zod schemas
 * Provides type-safe response validation with optional schema parameter
 */
export class ResponseValidator {
  /**
   * Validates API response with Zod schema
   * @param response - The API response to validate
   * @param schema - Zod schema for validation
   * @returns Validated data of type T
   */
  static async validate<T>(
    response: APIResponse,
    schema: z.ZodSchema<T>,
  ): Promise<T>;

  /**
   * Returns raw API response without validation
   * @param response - The API response
   * @param schema - null to skip validation
   * @returns Raw APIResponse
   */
  static async validate(
    response: APIResponse,
    schema: null,
  ): Promise<APIResponse>;

  /**
   * Validates API response with optional Zod schema
   * @param response - The API response to validate
   * @param schema - Zod schema for validation or null to return raw response
   * @returns Validated data or raw APIResponse
   *
   * @example
   * // With validation
   * const user = await ResponseValidator.validate(response, UserSchema);
   *
   * @example
   * // Without validation (for error testing)
   * const rawResponse = await ResponseValidator.validate(response, null);
   */
  static async validate<T>(
    response: APIResponse,
    schema: z.ZodSchema<T> | null,
  ): Promise<T | APIResponse> {
    if (schema === null) {
      return response;
    }
    const body = await response.json();
    return schema.parse(body);
  }
}
