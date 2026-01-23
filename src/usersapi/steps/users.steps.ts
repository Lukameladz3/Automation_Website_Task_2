import { expect, APIResponse } from "@playwright/test";
import { z } from "zod";
import { UsersApiService } from "../api/services";
import {
  User,
  UsersList,
  UsersListSchema,
  StrictUsersListSchema,
  UniqueUsersListSchema,
  ErrorResponse,
  ErrorResponseSchema,
} from "../models/schemas";
import { UsersApiTestData } from "../constants";
import { step } from "../utils";

/**
 * Step class for Users API operations
 * Encapsulates business logic for user-related test scenarios
 */
export class UsersSteps {
  constructor(private readonly usersApiService: UsersApiService) {}

  async getAllUsers(): Promise<UsersList>;
  async getAllUsers<T>(schema: z.ZodSchema<T>): Promise<T>;
  async getAllUsers(schema: null): Promise<APIResponse>;
  @step("API: Get all users")
  async getAllUsers<T>(
    schema?: z.ZodSchema<T> | null,
  ): Promise<UsersList | T | APIResponse> {
    if (schema === undefined) {
      return this.usersApiService.getAllUsers();
    }

    if (schema === null) {
      return this.usersApiService.getAllUsers(null);
    }

    return (await this.usersApiService.getAllUsers(
      schema as z.ZodSchema<UsersList>,
    )) as T;
  }

  async getUserById(id: number): Promise<User>;
  async getUserById<T>(id: number | string, schema: z.ZodSchema<T>): Promise<T>;
  async getUserById(id: number | string, schema: null): Promise<APIResponse>;
  @step("API: Get user by ID")
  async getUserById<T>(
    id: number | string,
    schema?: z.ZodSchema<T> | null,
  ): Promise<User | T | APIResponse> {
    if (schema === undefined) {
      return this.usersApiService.getUserById(id as number);
    }

    if (schema === null) {
      return this.usersApiService.getUserById(id, null);
    }

    return (await this.usersApiService.getUserById(
      id,
      schema as z.ZodSchema<User>,
    )) as T;
  }

  @step("API: Verify user not found error")
  async verifyUserNotFoundError(id: number | string): Promise<ErrorResponse> {
    const response = await this.usersApiService.getUserById(id, null);
    const body = await response.json();
    const errorResponse = ErrorResponseSchema.parse(body);
    expect(errorResponse.message).toBeDefined();
    return errorResponse;
  }

  @step("API: Verify all users have required fields")
  async verifyAllUsersHaveRequiredFields(): Promise<UsersList> {
    const users = await this.usersApiService.getAllUsers();

    for (let index = 0; index < users.length; index++) {
      const user = users[index];
      expect(user.id, `User at index ${index} missing id`).toBeDefined();
      expect(user.name, `User at index ${index} missing name`).toBeDefined();
      expect(typeof user.id, `User at index ${index} id is not a number`).toBe(
        "number",
      );
      expect(
        typeof user.name,
        `User at index ${index} name is not a string`,
      ).toBe("string");
    }

    return users;
  }

  @step("API: Verify all users have valid data types")
  async verifyAllUsersHaveValidDataTypes(): Promise<UsersList> {
    const users = await this.usersApiService.getAllUsers();

    for (let index = 0; index < users.length; index++) {
      const user = users[index];
      expect(user.id, `User at index ${index} missing id`).toBeDefined();
      expect(user.name, `User at index ${index} missing name`).toBeDefined();
      expect(
        typeof user.id,
        `User at index ${index}: id should be number`,
      ).toBe("number");
      expect(
        typeof user.name,
        `User at index ${index}: name should be string`,
      ).toBe("string");
      expect(
        user.id,
        `User at index ${index}: id must be positive`,
      ).toBeGreaterThan(0);
    }

    return users;
  }

  @step("API: Verify all users for invalid user IDs")
  async verifyErrorForInvalidUserIds(
    invalidIds: readonly number[],
    expectedMessage: string,
  ): Promise<void> {
    for (const userId of invalidIds) {
      const errorResponse = await this.verifyUserNotFoundError(userId);
      expect(errorResponse.message).toBe(expectedMessage);
    }
  }

  @step("API: Verify all valid user IDs return proper responses")
  async verifyAllValidUserIds(
    validIds: readonly number[],
    maxResponseTime: number,
  ): Promise<void> {
    for (const userId of validIds) {
      const startTime = Date.now();
      const response = await this.usersApiService.getUserById(userId, null);
      const responseTime = Date.now() - startTime;

      expect(response.status()).toBe(UsersApiTestData.STATUS_CODES.OK);
      expect(response.headers()["content-type"]).toBe(
        UsersApiTestData.CONTENT_TYPES.JSON,
      );
      expect(responseTime).toBeLessThanOrEqual(maxResponseTime);

      const user = await this.usersApiService.getUserById(userId);
      expect(user.id).toBe(userId);
      expect(user.name).toBeDefined();
    }
  }

  @step("API: Verify invalid ID formats return errors")
  async verifyInvalidIdFormats(
    invalidFormats: readonly string[],
  ): Promise<void> {
    for (const invalidId of invalidFormats) {
      const response = await this.usersApiService.getUserById(invalidId, null);
      const body = await response.json();
      expect(body).toHaveProperty("message");
      expect(body.message).toBe(UsersApiTestData.ERROR_MESSAGES.USER_NOT_FOUND);
    }
  }

  @step("API: Verify users list has no duplicates")
  async verifyNoDuplicateIds(): Promise<void> {
    const users = await this.usersApiService.getAllUsers();
    const ids = users.map((user) => user.id);
    const uniqueIds = new Set(ids);

    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    const uniqueDuplicates = [...new Set(duplicates)];

    expect(
      ids.length,
      `Expected all user IDs to be unique, but found ${uniqueDuplicates.length} duplicate ID(s): ${uniqueDuplicates.join(", ")}. Total users: ${ids.length}, Unique IDs: ${uniqueIds.size}`,
    ).toBe(uniqueIds.size);
  }

  @step("API: Verify all users have age field")
  async verifyAllUsersHaveAge(): Promise<UsersList> {
    const users = await this.usersApiService.getAllUsers(StrictUsersListSchema);

    users.forEach((user, index) => {
      expect(
        user.age,
        `User at index ${index} missing age field`,
      ).toBeDefined();
      expect(
        typeof user.age,
        `User at index ${index} age is not a number`,
      ).toBe("number");
      expect(
        user.age,
        `User at index ${index} age must be positive`,
      ).toBeGreaterThan(0);
    });

    return users;
  }

  @step("API: Identify users without age field")
  async identifyUsersWithoutAge(): Promise<void> {
    const users = await this.usersApiService.getAllUsers();
    const usersWithoutAge = users.filter((user) => user.age === undefined);

    expect(
      usersWithoutAge.length,
      `Found ${usersWithoutAge.length} users without age field: ${usersWithoutAge.map((u) => u.id).join(", ")}`,
    ).toBeGreaterThan(0);

    console.log(
      "Users missing age field:",
      usersWithoutAge.map((u) => ({ id: u.id, name: u.name })),
    );
  }

  @step("API: Verify users without age field are valid")
  async verifyUsersWithoutAgeAreValid(): Promise<void> {
    const users = await this.usersApiService.getAllUsers();
    const usersWithoutAge = users.filter((user) => user.age === undefined);

    for (const user of usersWithoutAge) {
      expect(user.id).toBeDefined();
      expect(user.name).toBeDefined();
      expect(typeof user.id).toBe("number");
      expect(typeof user.name).toBe("string");
    }
  }

  @step("API: Verify user exists by ID")
  async verifyUserExists(id: number): Promise<User> {
    const user = await this.getUserById(id);
    expect(user).toBeDefined();
    expect(user.id).toBe(id);
    return user;
  }

  @step("API: Verify user has all expected properties")
  async verifyUserProperties(user: User) {
    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("name");
    expect(user.id).toBeGreaterThan(0);
    expect(user.name).toBeTruthy();
  }

  @step("API: Verify internal server errors for specific user IDs")
  async verifyInternalServerErrors(userIds: readonly number[]): Promise<void> {
    for (const userId of userIds) {
      const response = await this.usersApiService.getUserById(userId, null);
      const body = await response.json();

      // This test should FAIL because the API incorrectly returns internal errors
      // We expect valid user data but get an error instead
      expect(
        body.message,
        `User ID ${userId} should return valid user data, but returns internal error: ${body.message}`,
      ).not.toBe(UsersApiTestData.ERROR_MESSAGES.INTERNAL_ERROR);
    }
  }
}
