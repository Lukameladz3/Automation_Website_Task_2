import { APIRequestContext, APIResponse } from "@playwright/test";
import { z } from "zod";
import { Routes } from "../../constants/routes";
import {
  CreatePostRequest,
  CreatePostResponse,
  CreatePostResponseSchema,
  CreatePostResponsePassthrough,
  CreatePostResponsePassthroughSchema,
  CreatePostResponsePartial,
  CreatePostResponsePartialSchema,
  UpdatePostRequest,
  UpdatePostResponse,
  UpdatePostResponseSchema,
  UpdatePostResponsePartial,
  UpdatePostResponsePartialSchema,
  UpdatePostResponseUnionSchema,
  DeletePostResponseSchema,
  Post,
  PostSchema,
  PostArraySchema,
} from "../../models/schemas/post.schemas";
import {
  User,
  UserSchema,
  UserArraySchema,
} from "../../models/schemas/user.schemas";
import { ApiClient } from "../api-client";

export class JsonPlaceholderService extends ApiClient {
  private readonly baseUrl: string;

  constructor(request: APIRequestContext) {
    super(request);
    this.baseUrl = Routes.BASE_URL;
  }

  // ==================== Generic Validation Helper ====================

  /**
   * Generic method to validate API response with Zod schema
   * @param response - The API response to validate
   * @param schema - Zod schema for validation. Pass null to return raw APIResponse
   * @returns Validated data of type T, or raw APIResponse if schema is null
   *
   * @example
   * // Validated response
   * const post = await validateResponse(response, PostSchema);
   *
   * // Raw response (for error testing)
   * const rawResponse = await validateResponse(response, null);
   */
  private async validateResponse<T>(
    response: APIResponse,
    schema: z.ZodSchema<T>,
  ): Promise<T>;
  private async validateResponse(
    response: APIResponse,
    schema: null,
  ): Promise<APIResponse>;
  private async validateResponse<T>(
    response: APIResponse,
    schema: z.ZodSchema<T> | null,
  ): Promise<T | APIResponse> {
    if (schema === null) {
      return response;
    }
    const body = await response.json();
    return schema.parse(body);
  }

  // ==================== GET Methods ====================

  async getAllPosts(schema: z.ZodSchema<Post[]>): Promise<Post[]>;
  async getAllPosts(schema: null): Promise<APIResponse>;
  async getAllPosts(): Promise<Post[]>;
  async getAllPosts(
    schema?: z.ZodSchema<Post[]> | null,
  ): Promise<Post[] | APIResponse> {
    const response = await this.get(`${this.baseUrl}${Routes.POSTS}`);

    if (schema === undefined) {
      return this.validateResponse(response, PostArraySchema);
    }

    if (schema === null) {
      return this.validateResponse(response, null);
    }

    return this.validateResponse(response, schema);
  }

  async getPostById(id: number, schema: z.ZodSchema<Post>): Promise<Post>;
  async getPostById(id: number, schema: null): Promise<APIResponse>;
  async getPostById(id: number): Promise<Post>;
  async getPostById(
    id: number,
    schema?: z.ZodSchema<Post> | null,
  ): Promise<Post | APIResponse> {
    const response = await this.get(`${this.baseUrl}${Routes.POSTS}/${id}`);

    if (schema === undefined) {
      return this.validateResponse(response, PostSchema);
    }

    if (schema === null) {
      return this.validateResponse(response, null);
    }

    return this.validateResponse(response, schema);
  }

  async getPostByStringId(id: string): Promise<APIResponse> {
    return this.get(`${this.baseUrl}${Routes.POSTS}/${id}`);
  }

  async getPostsByUserId(userId: number): Promise<Post[]> {
    const response = await this.get(`${this.baseUrl}${Routes.POSTS}`, {
      params: { userId: userId.toString() },
    });
    return this.validateResponse(response, PostArraySchema) as Promise<Post[]>;
  }

  // ==================== POST Methods ====================

  /**
   * Create a new post
   * @param payload - Post data to create
   * @param schema - Validation schema (default: CreatePostResponseSchema). Pass null for raw response
   * @returns Validated post data or raw APIResponse
   *
   * @example
   * // Standard validation
   * const post = await createPost({ title, body, userId });
   *
   * // Custom partial schema
   * const post = await createPost(payload, CreatePostResponsePartialSchema);
   *
   * // Passthrough schema (extra fields)
   * const post = await createPost(payload, CreatePostResponsePassthroughSchema);
   *
   * // No validation (for error testing)
   * const response = await createPost(invalidPayload, null);
   */
  async createPost<T>(payload: unknown, schema: z.ZodSchema<T>): Promise<T>;
  async createPost(payload: unknown, schema: null): Promise<APIResponse>;
  async createPost(payload: CreatePostRequest): Promise<CreatePostResponse>;
  async createPost<T>(
    payload: unknown,
    schema?: z.ZodSchema<T> | null,
  ): Promise<T | CreatePostResponse | APIResponse> {
    const response = await this.post(`${this.baseUrl}${Routes.POSTS}`, {
      data: payload,
      headers: { "Content-Type": "application/json" },
    });

    if (schema === undefined) {
      return this.validateResponse(response, CreatePostResponseSchema);
    }

    if (schema === null) {
      return this.validateResponse(response, null);
    }

    return this.validateResponse(response, schema);
  }

  // ==================== PUT Methods ====================

  /**
   * Update an existing post
   * @param id - Post ID to update
   * @param payload - Updated post data
   * @param schema - Validation schema (default: auto-detect). Pass null for raw response
   * @returns Validated post data or raw APIResponse
   *
   * @example
   * // Auto-detect validation (tries full, falls back to partial)
   * const post = await updatePost(1, { title, body, userId });
   *
   * // Custom schema
   * const post = await updatePost(1, payload, UpdatePostResponsePartialSchema);
   *
   * // No validation (for error testing)
   * const response = await updatePost(1, invalidPayload, null);
   */
  async updatePost<T>(
    id: number,
    payload: unknown,
    schema: z.ZodSchema<T>,
  ): Promise<T>;
  async updatePost(
    id: number,
    payload: unknown,
    schema: null,
  ): Promise<APIResponse>;
  async updatePost(
    id: number,
    payload: UpdatePostRequest,
  ): Promise<UpdatePostResponse | UpdatePostResponsePartial>;
  async updatePost<T>(
    id: number,
    payload: unknown,
    schema?: z.ZodSchema<T> | null,
  ): Promise<T | UpdatePostResponse | UpdatePostResponsePartial | APIResponse> {
    const response = await this.put(`${this.baseUrl}${Routes.POSTS}/${id}`, {
      data: payload,
      headers: { "Content-Type": "application/json" },
    });

    if (schema === null) {
      return response;
    }

    if (schema === undefined) {
      return this.validateResponse(response, UpdatePostResponseUnionSchema);
    }

    return this.validateResponse(response, schema);
  }

  // ==================== DELETE Methods ====================

  async deletePost<T>(id: number, schema: z.ZodSchema<T>): Promise<T>;
  async deletePost(id: number, schema: null): Promise<APIResponse>;
  async deletePost(id: number): Promise<Record<string, never>>;
  async deletePost<T>(
    id: number,
    schema?: z.ZodSchema<T> | null,
  ): Promise<T | Record<string, never> | APIResponse> {
    const response = await this.delete(`${this.baseUrl}${Routes.POSTS}/${id}`);

    if (schema === undefined) {
      return this.validateResponse(response, DeletePostResponseSchema);
    }

    if (schema === null) {
      return this.validateResponse(response, null);
    }

    return this.validateResponse(response, schema);
  }

  // ==================== User Methods ====================

  async getAllUsers(): Promise<User[]> {
    const response = await this.get(`${this.baseUrl}${Routes.USERS}`);
    return this.validateResponse(response, UserArraySchema) as Promise<User[]>;
  }

  async getUserById(id: number): Promise<User> {
    const response = await this.get(`${this.baseUrl}${Routes.USERS}/${id}`);
    return this.validateResponse(response, UserSchema) as Promise<User>;
  }

  // ==================== Special Test Methods ====================

  async getPostsWithInvalidQuery(): Promise<Post[]> {
    const response = await this.get(`${this.baseUrl}${Routes.POSTS}`, {
      params: { userId: "abc" },
    });
    return this.validateResponse(response, PostArraySchema) as Promise<Post[]>;
  }

  async createPostWithoutContentType(
    payload: CreatePostRequest,
  ): Promise<CreatePostResponse> {
    const response = await this.post(`${this.baseUrl}${Routes.POSTS}`, {
      data: payload,
    });
    return this.validateResponse(
      response,
      CreatePostResponseSchema,
    ) as Promise<CreatePostResponse>;
  }

  async createPostWithWrongContentType(
    payload: CreatePostRequest,
  ): Promise<APIResponse> {
    return this.post(`${this.baseUrl}${Routes.POSTS}`, {
      data: payload,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
