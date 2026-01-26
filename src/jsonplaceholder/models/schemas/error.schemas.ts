import { z } from "zod";

/**
 * Error response schemas
 */

// ==================== Error Response ====================

export const ErrorResponseSchema = z.object({ // No need to export what is used only in this file
  error: z.string(),
  message: z.string(),
  statusCode: z.number(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

// ==================== Not Found (404) ====================

export const NotFoundResponseSchema = z.object({});

export type NotFoundResponse = z.infer<typeof NotFoundResponseSchema>;
