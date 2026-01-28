import { z } from "zod";

/**
 * Error response schemas
 */

// ==================== Error Response ====================

const ErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string(),
  statusCode: z.number(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

// ==================== Not Found (404) ====================

const NotFoundResponseSchema = z.object({});

export type NotFoundResponse = z.infer<typeof NotFoundResponseSchema>;