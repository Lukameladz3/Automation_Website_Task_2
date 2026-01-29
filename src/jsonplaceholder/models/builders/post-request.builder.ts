import { RandomDataGenerator } from "../../utils/random-data-generator";
import * as PostTypes from "../schemas/post.schemas";

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
  overrides: Partial<PostTypes.CreatePostRequest> = {},
): PostTypes.CreatePostRequest {
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
  overrides: Partial<PostTypes.UpdatePostRequest> = {},
): PostTypes.UpdatePostRequest {
  return {
    title: overrides.title ?? RandomDataGenerator.postTitle(),
    body: overrides.body ?? RandomDataGenerator.postBody(),
    userId: overrides.userId ?? RandomDataGenerator.userId(),
    id: overrides.id,
  };
}
