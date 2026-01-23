import { z } from "zod";

/**
 * Base schema for error responses
 */
export const ErrorResponseSchema = z.object({
  message: z.string(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

/**
 * Lenient error response schema (allows additional fields)
 */
export const ErrorResponsePassthroughSchema = ErrorResponseSchema.passthrough();

/**
 * Partial error response schema for flexible validation
 */
export const PartialErrorResponseSchema = ErrorResponseSchema.partial();
