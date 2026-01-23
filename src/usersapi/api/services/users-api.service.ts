import { APIRequestContext, APIResponse } from "@playwright/test";
import { z } from "zod";
import { ApiClient } from "../api-client";
import { UsersApiRoutes } from "../../constants";
import {
  User,
  UsersList,
  UsersListSchema,
  GetUserByIdResponseSchema,
} from "../../models/schemas";

/**
 * Service class for Users API operations
 * Provides methods with flexible schema validation
 */
export class UsersApiService extends ApiClient {
  private readonly baseUrl: string;

  constructor(request: APIRequestContext) {
    super(request);
    this.baseUrl = UsersApiRoutes.BASE_URL;
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
   * const users = await validateResponse(response, UsersListSchema);
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

  /**
   * GET /api/users - Get all users
   * @param schema - Optional Zod schema for validation. Pass null for raw response.
   * @returns Validated users list or raw APIResponse
   *
   * @example
   * // Default validation
   * const users = await getAllUsers();
   *
   * // Custom schema
   * const users = await getAllUsers(UniqueUsersListSchema);
   *
   * // Raw response (for error testing)
   * const response = await getAllUsers(null);
   */
  async getAllUsers(schema: z.ZodSchema<UsersList>): Promise<UsersList>;
  async getAllUsers(schema: null): Promise<APIResponse>;
  async getAllUsers(): Promise<UsersList>;
  async getAllUsers(
    schema?: z.ZodSchema<UsersList> | null,
  ): Promise<UsersList | APIResponse> {
    const response = await this.get(`${this.baseUrl}${UsersApiRoutes.USERS}`);

    if (schema === undefined) {
      return this.validateResponse(response, UsersListSchema);
    }

    if (schema === null) {
      return this.validateResponse(response, null);
    }

    return this.validateResponse(response, schema);
  }

  /**
   * GET /api/users/:id - Get user by ID
   * @param id - User ID (can be number or string for testing invalid formats)
   * @param schema - Optional Zod schema for validation. Pass null for raw response.
   * @returns Validated user or raw APIResponse
   *
   * @example
   * // Default validation
   * const user = await getUserById(1);
   *
   * // Custom schema
   * const user = await getUserById(1, StrictUserSchema);
   *
   * // Raw response (for error testing)
   * const response = await getUserById("invalid", null);
   */
  async getUserById(
    id: number | string,
    schema: z.ZodSchema<User>,
  ): Promise<User>;
  async getUserById(id: number | string, schema: null): Promise<APIResponse>;
  async getUserById(id: number | string): Promise<User>;
  async getUserById(
    id: number | string,
    schema?: z.ZodSchema<User> | null,
  ): Promise<User | APIResponse> {
    const response = await this.get(
      `${this.baseUrl}${UsersApiRoutes.USER_BY_ID(id)}`,
    );

    if (schema === undefined) {
      return this.validateResponse(response, GetUserByIdResponseSchema);
    }

    if (schema === null) {
      return this.validateResponse(response, null);
    }

    return this.validateResponse(response, schema);
  }
}
