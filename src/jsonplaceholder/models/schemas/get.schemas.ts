import { PostSchema, PostArraySchema } from "./common.schemas";
export { PostSchema, PostArraySchema, type Post } from "./common.schemas";

export const GetPostsResponseSchema = PostArraySchema;

export const GetPostResponseSchema = PostSchema;

export const GetPostsByUserIdResponseSchema = PostArraySchema;
