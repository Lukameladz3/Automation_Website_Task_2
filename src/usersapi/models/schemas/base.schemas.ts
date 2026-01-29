import { z } from "zod";

/**
 * Base schema for error responses
 */
export const ErrorResponseSchema = z.object({
  message: z.string(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
