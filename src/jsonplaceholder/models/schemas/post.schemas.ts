import { z } from "zod";

export const CreatePostRequestSchema = z
  .object({
    body: z.string(),
    title: z.string(),
    userId: z.number(),
  })
  .strict();

export type CreatePostRequest = z.infer<typeof CreatePostRequestSchema>;

export const CreatePostResponseSchema = z
  .object({
    body: z.string(),
    id: z.number(),
    title: z.string(),
    userId: z.number(),
  })
  .strict();

export type CreatePostResponse = z.infer<typeof CreatePostResponseSchema>;

export const CreatePostResponsePassthroughSchema = z
  .object({
    body: z.string(),
    id: z.number(),
    title: z.string(),
    userId: z.number(),
  })
  .passthrough();

export type CreatePostResponsePassthrough = z.infer<
  typeof CreatePostResponsePassthroughSchema
>;

export const CreatePostResponsePartialSchema = z
  .object({
    body: z.string().optional(),
    id: z.number(),
    title: z.string().optional(),
    userId: z.number().optional(),
  })
  .strict();

export type CreatePostResponsePartial = z.infer<
  typeof CreatePostResponsePartialSchema
>;
