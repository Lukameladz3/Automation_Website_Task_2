import { APIRequestContext, APIResponse, expect } from "@playwright/test";
import { z } from "zod";
import { Routes } from "@jsonplaceholder/constants/routes";
import * as PostTypes from "@jsonplaceholder/models/schemas/post.schemas";
import * as UserTypes from "@jsonplaceholder/models/schemas/user.schemas";
import { ApiClient } from "@jsonplaceholder/api/api-client";
import { ResponseValidator } from "../../../utils/response-validator";

export class JsonPlaceholderService extends ApiClient {
  private readonly baseUrl: string;

  constructor(request: APIRequestContext) {
    super(request);
    this.baseUrl = Routes.BASE_URL;
  }

  // ==================== GET Methods ====================

  async getAllPosts(options?: {
    params?: Record<string, string | number>;
    schema?: z.ZodSchema<PostTypes.Post[]> | null;
  }): Promise<PostTypes.Post[] | APIResponse> {
    const response = await this.get(`${this.baseUrl}${Routes.POSTS}`, {
      params: options?.params,
    });

    if (options?.schema === null) {
      return ResponseValidator.validate(response, null);
    }
    return ResponseValidator.validate(
      response,
      options?.schema ?? PostTypes.PostArraySchema,
    );
  }

  async getPostById(
    id: number,
    options?: {
      schema?: z.ZodSchema<PostTypes.Post> | null;
    },
  ): Promise<PostTypes.Post | APIResponse> {
    const response = await this.get(`${this.baseUrl}${Routes.POSTS}/${id}`);

    if (options?.schema === null) {
      return ResponseValidator.validate(response, null);
    }
    return ResponseValidator.validate(
      response,
      options?.schema ?? PostTypes.PostSchema,
    );
  }

  async getPostByStringId(id: string): Promise<APIResponse> {
    return this.get(`${this.baseUrl}${Routes.POSTS}/${id}`);
  }

  // ==================== POST Methods ====================

  /**
   * Create a new post
   * @param payload - Post data to create
   * @param options - Optional configuration (headers, schema)
   * @returns Validated post data or raw APIResponse
   *
   * @example
   * // Standard validation (with default Content-Type: application/json)
   * const post = await createPost({ title, body, userId });
   *
   * // Custom schema
   * const post = await createPost(payload, { schema: CreatePostResponsePartialSchema });
   *
   * // No validation (for error testing)
   * const response = await createPost(invalidPayload, { schema: null });
   *
   * // Custom headers (e.g., wrong content type)
   * const response = await createPost(payload, { headers: { "Content-Type": "text/plain" }, schema: null });
   *
   * // No Content-Type header
   * const response = await createPost(payload, { headers: {}, schema: null });
   */
  async createPost<T = PostTypes.CreatePostResponse>(
    payload: unknown,
    options?: {
      headers?: Record<string, string>;
      schema?: z.ZodSchema<T> | null;
    },
  ): Promise<T | PostTypes.CreatePostResponse | APIResponse> {
    const headers = options?.headers ?? { "Content-Type": "application/json" };
    const response = await this.post(`${this.baseUrl}${Routes.POSTS}`, {
      data: payload,
      headers,
    });

    if (options?.schema === null) {
      return ResponseValidator.validate(response, null);
    }
    return ResponseValidator.validate(
      response,
      options?.schema ??
        (PostTypes.CreatePostResponseSchema as unknown as z.ZodSchema<T>),
    );
  }

  // ==================== PUT Methods ====================

  /**
   * Update an existing post
   * @param id - Post ID to update
   * @param payload - Updated post data
   * @param options - Optional configuration (schema)
   * @returns Validated post data or raw APIResponse
   *
   * @example
   * // Auto-detect validation (tries full, falls back to partial)
   * const post = await updatePost(1, { title, body, userId });
   *
   * // Custom schema
   * const post = await updatePost(1, payload, { schema: UpdatePostResponsePartialSchema });
   *
   * // No validation (for error testing)
   * const response = await updatePost(1, invalidPayload, { schema: null });
   */
  async updatePost<
    T = PostTypes.UpdatePostResponse | PostTypes.UpdatePostResponsePartial,
  >(
    id: number,
    payload: unknown,
    options?: {
      schema?: z.ZodSchema<T> | null;
    },
  ): Promise<
    | T
    | PostTypes.UpdatePostResponse
    | PostTypes.UpdatePostResponsePartial
    | APIResponse
  > {
    const response = await this.put(`${this.baseUrl}${Routes.POSTS}/${id}`, {
      data: payload,
      headers: { "Content-Type": "application/json" },
    });

    if (options?.schema === null) {
      return response;
    }
    return ResponseValidator.validate(
      response,
      options?.schema ??
        (PostTypes.UpdatePostResponseUnionSchema as z.ZodSchema<T>),
    );
  }

  // ==================== DELETE Methods ====================

  async deletePost<T = Record<string, never>>(
    id: number,
    options?: {
      schema?: z.ZodSchema<T> | null;
    },
  ): Promise<T | Record<string, never> | APIResponse> {
    const response = await this.delete(`${this.baseUrl}${Routes.POSTS}/${id}`);

    if (options?.schema === null) {
      return ResponseValidator.validate(response, null);
    }
    return ResponseValidator.validate(
      response,
      options?.schema ?? (PostTypes.DeletePostResponseSchema as z.ZodSchema<T>),
    );
  }

  // ==================== User Methods ====================

  async getAllUsers(): Promise<UserTypes.User[]> {
    const response = await this.get(`${this.baseUrl}${Routes.USERS}`);
    expect(response).toHaveStatusCode(200);
    return ResponseValidator.validate(
      response,
      UserTypes.UserArraySchema,
    ) as Promise<UserTypes.User[]>;
  }

  async getUserById(id: number): Promise<UserTypes.User> {
    const response = await this.get(`${this.baseUrl}${Routes.USERS}/${id}`);
    return ResponseValidator.validate(
      response,
      UserTypes.UserSchema,
    ) as Promise<UserTypes.User>;
  }
}
