import { z } from "zod";

export const DeletePostResponseSchema = z.object({}).strict();

export type DeletePostResponse = z.infer<typeof DeletePostResponseSchema>;
