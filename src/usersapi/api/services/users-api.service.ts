import { APIRequestContext, APIResponse } from "@playwright/test";
import { z } from "zod";
import { ApiClient } from "@usersapi/api/api-client";
import { UsersApiRoutes } from "@usersapi/constants/index";
import * as UserSchemas from "@usersapi/models/schemas";
import { ResponseValidator } from "../../../utils/response-validator";

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

  // ==================== GET Methods ====================

  /**
   * GET /api/users - Get all users
   * @param schema - Optional Zod schema for validation. Pass null for raw response. Defaults to UsersListSchema.
   * @returns Validated users list or raw APIResponse
   */
  async getAllUsers(
    schema?: z.ZodSchema<UserSchemas.UsersList> | null,
  ): Promise<UserSchemas.UsersList | APIResponse> {
    const response = await this.get(`${this.baseUrl}${UsersApiRoutes.USERS}`);

    if (schema === null) {
      return ResponseValidator.validate(response, null);
    }
    return ResponseValidator.validate(
      response,
      schema ?? UserSchemas.UsersListSchema,
    );
  }

  /**
   * GET /api/users/:id - Get user by ID
   * @param id - User ID (can be number or string for testing invalid formats)
   * @param schema - Optional Zod schema for validation. Pass null for raw response. Defaults to GetUserByIdResponseSchema.
   * @returns Validated user or raw APIResponse
   */
  async getUserById(
    id: number | string,
    schema?: z.ZodSchema<UserSchemas.User> | null,
  ): Promise<UserSchemas.User | APIResponse> {
    const response = await this.get(
      `${this.baseUrl}${UsersApiRoutes.USER_BY_ID(id)}`,
    );

    if (schema === null) {
      return ResponseValidator.validate(response, null);
    }
    return ResponseValidator.validate(
      response,
      schema ?? UserSchemas.GetUserByIdResponseSchema,
    );
  }
}
