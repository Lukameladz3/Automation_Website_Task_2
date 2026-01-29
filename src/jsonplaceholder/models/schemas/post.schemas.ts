import { z } from "zod";

/**
 * All Post-related schemas (GET, POST, PUT, DELETE operations)
 */

// ==================== Base Post Schema ====================

export const PostSchema = z
  .object({
    body: z.string(),
    id: z.number(),
    title: z.string(),
    userId: z.number(),
  })
  .strict();

export type Post = z.infer<typeof PostSchema>;

export const PostArraySchema = z.array(PostSchema);

// ==================== POST (Create) Operations ====================

const CreatePostRequestSchema = z
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

// ==================== PUT (Update) Operations ====================

const UpdatePostRequestSchema = z
  .object({
    body: z.string().optional(),
    id: z.number().optional(),
    title: z.string().optional(),
    userId: z.number().optional(),
  })
  .strict();

export type UpdatePostRequest = z.infer<typeof UpdatePostRequestSchema>;

const UpdatePostResponseSchema = PostSchema;

export type UpdatePostResponse = z.infer<typeof UpdatePostResponseSchema>;

const UpdatePostResponsePartialSchema = PostSchema.partial().loose();

export type UpdatePostResponsePartial = z.infer<
  typeof UpdatePostResponsePartialSchema
>;

export const UpdatePostResponseUnionSchema = z.union([
  UpdatePostResponseSchema,
  UpdatePostResponsePartialSchema,
]);

export type UpdatePostResponseUnion = z.infer<
  typeof UpdatePostResponseUnionSchema
>;

// ==================== DELETE Operations ====================

export const DeletePostResponseSchema = z.object({}).strict();

export type DeletePostResponse = z.infer<typeof DeletePostResponseSchema>;
