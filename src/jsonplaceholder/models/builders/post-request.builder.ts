import { RandomDataGenerator } from "../../utils/random-data-generator";
import {
  CreatePostRequest,
  UpdatePostRequest,
} from "../schemas/post.schemas";

/**
 * Builder functions for Post request bodies
 * Provides default values using RandomDataGenerator with ability to override specific fields
 */

/**
 * Build a CreatePostRequest with smart defaults
 * @param overrides - Fields to override (only specify what you need to test)
 * @returns Complete CreatePostRequest with defaults for unspecified fields
 *
 * @example
 * // Use all defaults
 * const request = buildCreatePostRequest();
 *
 * @example
 * // Override specific field
 * const request = buildCreatePostRequest({ userId: 5 });
 *
 * @example
 * // Override multiple fields
 * const request = buildCreatePostRequest({
 *   title: "Custom Title",
 *   userId: 10
 * });
 */
export function buildCreatePostRequest(
  overrides: Partial<CreatePostRequest> = {},
): CreatePostRequest {
  return {
    title: overrides.title ?? RandomDataGenerator.postTitle(),
    body: overrides.body ?? RandomDataGenerator.postBody(),
    userId: overrides.userId ?? RandomDataGenerator.userId(),
  };
}

/**
 * Build an UpdatePostRequest with smart defaults
 * @param overrides - Fields to override (only specify what you need to test)
 * @returns Complete UpdatePostRequest with defaults for unspecified fields
 *
 * @example
 * // Partial update - only title
 * const request = buildUpdatePostRequest({ title: "New Title" });
 *
 * @example
 * // Full update with defaults
 * const request = buildUpdatePostRequest({ userId: 5 });
 */
export function buildUpdatePostRequest(
  overrides: Partial<UpdatePostRequest> = {},
): UpdatePostRequest {
  return {
    title: overrides.title ?? RandomDataGenerator.postTitle(),
    body: overrides.body ?? RandomDataGenerator.postBody(),
    userId: overrides.userId ?? RandomDataGenerator.userId(),
    id: overrides.id,
  };
}

/**
 * Build a minimal CreatePostRequest (useful for edge case testing)
 * @returns CreatePostRequest with minimal valid data
 *
 * @example
 * const request = buildMinimalPostRequest();
 * // { title: "a", body: "a", userId: 1 }
 */
export function buildMinimalPostRequest(): CreatePostRequest {
  return {
    title: "a",
    body: "a",
    userId: 1,
  };
}

/**
 * Build an empty partial post request (useful for testing API strictness)
 * @returns Empty object cast as Partial<CreatePostRequest>
 *
 * @example
 * const request = buildEmptyPostRequest();
 * // {}
 */
export function buildEmptyPostRequest(): Partial<CreatePostRequest> { // Does it make sense?
  return {};
}

/**
 * Build a post request with extremely long values (useful for boundary testing)
 * @param length - Length of the long strings (default: 10000)
 * @returns CreatePostRequest with very long title and body
 *
 * @example
 * const request = buildLongPostRequest();
 * const request = buildLongPostRequest(5000); // Custom length
 */
export function buildLongPostRequest(length = 10000): CreatePostRequest {
  return {
    title: "x".repeat(length),
    body: "y".repeat(length),
    userId: RandomDataGenerator.userId(),
  };
}

/**
 * Build a post request with special characters (useful for security testing)
 * @returns CreatePostRequest with special characters
 *
 * @example
 * const request = buildSpecialCharPostRequest();
 */
export function buildSpecialCharPostRequest(): CreatePostRequest {
  return {
    title: "<script>alert('xss')</script>",
    body: "'; DROP TABLE posts; --",
    userId: RandomDataGenerator.userId(),
  };
}
