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
} from "../../models/schemas/post.schemas";
import {
  UpdatePostRequest,
  UpdatePostResponse,
  UpdatePostResponseSchema,
  UpdatePostResponsePartial,
  UpdatePostResponsePartialSchema,
} from "../../models/schemas/put.schemas";
import {
  Post,
  PostSchema,
  PostArraySchema,
} from "../../models/schemas/get.schemas";
import { DeletePostResponseSchema } from "../../models/schemas/delete.schemas";
import {
  User,
  UserSchema,
  UserArraySchema,
} from "../../models/schemas/common.schemas";
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
   * @param schema - Optional Zod schema for validation. If not provided, returns raw response
   * @returns Validated data or raw response
   */
  private async validateResponse<T>(
    response: APIResponse,
    schema?: z.ZodSchema<T>,
  ): Promise<T | APIResponse> {
    if (!schema) {
      return response;
    }
    const body = await response.json();
    return schema.parse(body);
  }

  // ==================== GET Methods ====================

  async getAllPosts(): Promise<Post[]> {
    const response = await this.get(`${this.baseUrl}${Routes.POSTS}`);
    return this.validateResponse(response, PostArraySchema) as Promise<Post[]>;
  }

  async getPostById(id: number, schema?: z.ZodSchema<Post>): Promise<Post> {
    const response = await this.get(`${this.baseUrl}${Routes.POSTS}/${id}`);
    return this.validateResponse(
      response,
      schema || PostSchema,
    ) as Promise<Post>;
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

  async getRawPostResponse(id: number): Promise<APIResponse> {
    return this.get(`${this.baseUrl}${Routes.POSTS}/${id}`);
  }

  // ==================== POST Methods ====================

  async createPost(
    payload: CreatePostRequest,
    schema: z.ZodSchema<CreatePostResponse> = CreatePostResponseSchema,
  ): Promise<CreatePostResponse> {
    const response = await this.post(`${this.baseUrl}${Routes.POSTS}`, {
      data: payload,
      headers: { "Content-Type": "application/json" },
    });
    return this.validateResponse(
      response,
      schema,
    ) as Promise<CreatePostResponse>;
  }

  async createPostWithPassthrough(
    payload: CreatePostRequest & Record<string, unknown>,
  ): Promise<CreatePostResponsePassthrough> {
    const response = await this.post(`${this.baseUrl}${Routes.POSTS}`, {
      data: payload,
      headers: { "Content-Type": "application/json" },
    });
    return this.validateResponse(
      response,
      CreatePostResponsePassthroughSchema,
    ) as Promise<CreatePostResponsePassthrough>;
  }

  async createPostWithPartialValidation(
    payload: Partial<CreatePostRequest>,
  ): Promise<CreatePostResponsePartial> {
    const response = await this.post(`${this.baseUrl}${Routes.POSTS}`, {
      data: payload,
      headers: { "Content-Type": "application/json" },
    });
    return this.validateResponse(
      response,
      CreatePostResponsePartialSchema,
    ) as Promise<CreatePostResponsePartial>;
  }

  async createPostRaw(payload: unknown): Promise<APIResponse> {
    return this.post(`${this.baseUrl}${Routes.POSTS}`, {
      data: payload,
      headers: { "Content-Type": "application/json" },
    });
  }

  // ==================== PUT Methods ====================

  async updatePost<T = UpdatePostResponse>(
    id: number,
    payload: UpdatePostRequest,
    schema?: z.ZodSchema<T>,
  ): Promise<T | UpdatePostResponse | UpdatePostResponsePartial | APIResponse> {
    const response = await this.put(`${this.baseUrl}${Routes.POSTS}/${id}`, {
      data: payload,
      headers: { "Content-Type": "application/json" },
    });

    if (!schema) {
      // Try full schema first, fallback to partial
      const body = await response.json();
      try {
        return UpdatePostResponseSchema.parse(body);
      } catch {
        return UpdatePostResponsePartialSchema.parse(body);
      }
    }

    return this.validateResponse(response, schema) as Promise<T>;
  }

  async updatePostRaw(id: number, payload: unknown): Promise<APIResponse> {
    return this.put(`${this.baseUrl}${Routes.POSTS}/${id}`, {
      data: payload,
      headers: { "Content-Type": "application/json" },
    });
  }

  // ==================== DELETE Methods ====================

  async deletePost<T = Record<string, never>>(
    id: number,
    schema?: z.ZodSchema<T>,
  ): Promise<T | APIResponse> {
    const response = await this.delete(`${this.baseUrl}${Routes.POSTS}/${id}`);
    return this.validateResponse(
      response,
      schema || DeletePostResponseSchema,
    ) as Promise<T | APIResponse>;
  }

  async deletePostRaw(id: number): Promise<APIResponse> {
    return this.delete(`${this.baseUrl}${Routes.POSTS}/${id}`);
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
