import { APIRequestContext, APIResponse } from "@playwright/test";
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

  // ==================== GET Methods with Zod Validation ====================

  async getAllPosts(): Promise<Post[]> {
    const response = await this.get(`${this.baseUrl}${Routes.POSTS}`);
    const body = await response.json();
    return PostArraySchema.parse(body);
  }

  async getPostById(id: number): Promise<Post> {
    const response = await this.get(`${this.baseUrl}${Routes.POSTS}/${id}`);
    const body = await response.json();
    return PostSchema.parse(body);
  }

  async getPostByStringId(id: string): Promise<APIResponse> {
    // Returns raw response for error testing
    return this.get(`${this.baseUrl}${Routes.POSTS}/${id}`);
  }

  async getPostsByUserId(userId: number): Promise<Post[]> {
    const response = await this.get(`${this.baseUrl}${Routes.POSTS}`, {
      params: { userId: userId.toString() },
    });
    const body = await response.json();
    return PostArraySchema.parse(body);
  }

  // ==================== POST Methods with Zod Validation ====================

  async createPost(payload: CreatePostRequest): Promise<CreatePostResponse> {
    const response = await this.post(`${this.baseUrl}${Routes.POSTS}`, {
      data: payload,
      headers: { "Content-Type": "application/json" },
    });
    const body = await response.json();
    return CreatePostResponseSchema.parse(body);
  }

  async createPostWithPassthrough(
    payload: CreatePostRequest & Record<string, unknown>,
  ): Promise<CreatePostResponsePassthrough> {
    const response = await this.post(`${this.baseUrl}${Routes.POSTS}`, {
      data: payload,
      headers: { "Content-Type": "application/json" },
    });
    const body = await response.json();
    return CreatePostResponsePassthroughSchema.parse(body);
  }

  async createPostWithPartialValidation(
    payload: Partial<CreatePostRequest>,
  ): Promise<CreatePostResponsePartial> {
    const response = await this.post(`${this.baseUrl}${Routes.POSTS}`, {
      data: payload,
      headers: { "Content-Type": "application/json" },
    });
    const body = await response.json();
    return CreatePostResponsePartialSchema.parse(body);
  }

  // ==================== PUT Methods with Zod Validation ====================

  async updatePost(
    id: number,
    payload: UpdatePostRequest,
  ): Promise<UpdatePostResponse | UpdatePostResponsePartial> {
    const response = await this.put(`${this.baseUrl}${Routes.POSTS}/${id}`, {
      data: payload,
      headers: { "Content-Type": "application/json" },
    });
    const body = await response.json();

    // Try full schema first, fallback to partial
    try {
      return UpdatePostResponseSchema.parse(body);
    } catch {
      return UpdatePostResponsePartialSchema.parse(body);
    }
  }

  // ==================== DELETE Methods with Zod Validation ====================

  async deletePost(id: number): Promise<Record<string, never>> {
    const response = await this.delete(`${this.baseUrl}${Routes.POSTS}/${id}`);
    const body = await response.json();
    return DeletePostResponseSchema.parse(body);
  }

  // ==================== User Methods with Zod Validation ====================

  async getAllUsers(): Promise<User[]> {
    const response = await this.get(`${this.baseUrl}${Routes.USERS}`);
    const body = await response.json();
    return UserArraySchema.parse(body);
  }

  async getUserById(id: number): Promise<User> {
    const response = await this.get(`${this.baseUrl}${Routes.USERS}/${id}`);
    const body = await response.json();
    return UserSchema.parse(body);
  }

  // ==================== Special Test Methods ====================

  async getPostsWithInvalidQuery(): Promise<Post[]> {
    const response = await this.get(`${this.baseUrl}${Routes.POSTS}`, {
      params: { userId: "abc" },
    });
    const body = await response.json();
    return PostArraySchema.parse(body);
  }

  async createPostWithoutContentType(
    payload: CreatePostRequest,
  ): Promise<CreatePostResponse> {
    const response = await this.post(`${this.baseUrl}${Routes.POSTS}`, {
      data: payload,
    });
    const body = await response.json();
    return CreatePostResponseSchema.parse(body);
  }

  async createPostWithWrongContentType(
    payload: CreatePostRequest,
  ): Promise<APIResponse> {
    return this.post(`${this.baseUrl}${Routes.POSTS}`, {
      data: payload,
      headers: { "Content-Type": "text/plain" },
    });
  }

  // ==================== Raw Response Methods for Error Testing ====================

  async getRawPostResponse(id: number): Promise<APIResponse> {
    return this.get(`${this.baseUrl}${Routes.POSTS}/${id}`);
  }

  async createPostRaw(payload: unknown): Promise<APIResponse> {
    return this.post(`${this.baseUrl}${Routes.POSTS}`, {
      data: payload,
      headers: { "Content-Type": "application/json" },
    });
  }

  async updatePostRaw(id: number, payload: unknown): Promise<APIResponse> {
    return this.put(`${this.baseUrl}${Routes.POSTS}/${id}`, {
      data: payload,
      headers: { "Content-Type": "application/json" },
    });
  }

  async deletePostRaw(id: number): Promise<APIResponse> {
    return this.delete(`${this.baseUrl}${Routes.POSTS}/${id}`);
  }
}
