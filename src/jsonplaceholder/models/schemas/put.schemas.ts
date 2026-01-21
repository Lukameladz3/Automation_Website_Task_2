import { z } from "zod";
import { PostSchema } from "./common.schemas";

export const UpdatePostRequestSchema = z
  .object({
    body: z.string().optional(),
    id: z.number().optional(),
    title: z.string().optional(),
    userId: z.number().optional(),
  })
  .strict();

export type UpdatePostRequest = z.infer<typeof UpdatePostRequestSchema>;

export const UpdatePostResponseSchema = PostSchema;

export type UpdatePostResponse = z.infer<typeof UpdatePostResponseSchema>;

export const UpdatePostResponsePartialSchema =
  PostSchema.partial().loose();

export type UpdatePostResponsePartial = z.infer<
  typeof UpdatePostResponsePartialSchema
>;
