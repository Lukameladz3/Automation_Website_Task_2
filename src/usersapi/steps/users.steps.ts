import { expect, APIResponse } from "@playwright/test";
import { z } from "zod";
import { UsersApiService } from "../api/services";
import * as UserSchemas from "../models/schemas";
import { UsersApiConfig } from "../constants";
import { step } from "../utils";

/**
 * Step class for Users API operations
 * Encapsulates business logic for user-related test scenarios
 */
export class UsersSteps {
  constructor(private readonly usersApiService: UsersApiService) {}

  @step("API: Get all users")
  async getAllUsers(
    schema?: z.ZodSchema<UserSchemas.UsersList> | null,
  ): Promise<UserSchemas.UsersList | APIResponse> {
    return this.usersApiService.getAllUsers(schema);
  }

  @step("API: Get user by ID")
  async getUserById(
    id: number | string,
    schema?: z.ZodSchema<UserSchemas.User> | null,
  ): Promise<UserSchemas.User | APIResponse> {
    return this.usersApiService.getUserById(id, schema);
  }

  @step("API: Verify user not found error")
  async verifyUserNotFoundError(
    id: number | string,
  ): Promise<UserSchemas.ErrorResponse> {
    const response = (await this.usersApiService.getUserById(
      id,
      null,
    )) as APIResponse;
    const body = await response.json();
    const errorResponse = UserSchemas.ErrorResponseSchema.parse(body);
    expect(errorResponse.message).toBeDefined();
    return errorResponse;
  }

  @step("API: Verify all users have required fields")
  async verifyAllUsersHaveRequiredFields(): Promise<UserSchemas.UsersList> {
    const users = (await this.usersApiService.getAllUsers(
      UserSchemas.UsersListSchema,
    )) as UserSchemas.UsersList;

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
  async verifyAllUsersHaveValidDataTypes(): Promise<UserSchemas.UsersList> {
    const users = (await this.usersApiService.getAllUsers(
      UserSchemas.UsersListSchema,
    )) as UserSchemas.UsersList;

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
      const response = (await this.usersApiService.getUserById(
        userId,
        null,
      )) as APIResponse;
      const responseTime = Date.now() - startTime;

      expect(response.status()).toBe(UsersApiConfig.STATUS_CODES.OK);
      expect(response.headers()["content-type"]).toBe(
        UsersApiConfig.CONTENT_TYPES.JSON,
      );
      expect(responseTime).toBeLessThanOrEqual(maxResponseTime);

      const user = (await this.usersApiService.getUserById(
        userId,
        UserSchemas.UserSchema,
      )) as UserSchemas.User;
      expect(user.id).toBe(userId);
      expect(user.name).toBeDefined();
    }
  }

  @step("API: Verify invalid ID formats return errors")
  async verifyInvalidIdFormats(
    invalidFormats: readonly string[],
  ): Promise<void> {
    for (const invalidId of invalidFormats) {
      const response = (await this.usersApiService.getUserById(
        invalidId,
        null,
      )) as APIResponse;
      const body = await response.json();
      expect(body).toHaveProperty("message");
      expect(body.message).toBe(UsersApiConfig.ERROR_MESSAGES.USER_NOT_FOUND);
    }
  }

  @step("API: Verify users list has no duplicates")
  async verifyNoDuplicateIds(): Promise<void> {
    const users = (await this.usersApiService.getAllUsers(
      UserSchemas.UsersListSchema,
    )) as UserSchemas.UsersList;
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
  async verifyAllUsersHaveAge(): Promise<UserSchemas.UsersList> {
    const users = (await this.usersApiService.getAllUsers(
      UserSchemas.UsersListSchema,
    )) as UserSchemas.UsersList;

    users.forEach((user: UserSchemas.User, index: number) => {
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
    const users = (await this.usersApiService.getAllUsers(
      UserSchemas.UsersListSchema,
    )) as UserSchemas.UsersList;
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
    const users = (await this.usersApiService.getAllUsers(
      UserSchemas.UsersListSchema,
    )) as UserSchemas.UsersList;
    const usersWithoutAge = users.filter((user) => user.age === undefined);

    for (const user of usersWithoutAge) {
      expect(user.id).toBeDefined();
      expect(user.name).toBeDefined();
      expect(typeof user.id).toBe("number");
      expect(typeof user.name).toBe("string");
    }
  }

  @step("API: Get a guaranteed non-existent user ID")
  async getNonExistentUserId(): Promise<number> {
    const users = (await this.usersApiService.getAllUsers(
      UserSchemas.UsersListSchema,
    )) as UserSchemas.UsersList;
    // what if IDs are random and they are not incremented by 1
    const maxId = Math.max(...users.map((user) => user.id));
    return maxId + 1;
  }

  @step("API: Verify response is valid array structure")
  async verifyValidArrayStructure(): Promise<void> {
    const users = (await this.usersApiService.getAllUsers(
      UserSchemas.UsersListSchema,
    )) as UserSchemas.UsersList;

    expect(Array.isArray(users)).toBeTruthy();

    for (let index = 0; index < users.length; index++) {
      const user = users[index];
      expect(user, `User at index ${index} should be an object`).toBeTruthy();
      expect(
        typeof user,
        `User at index ${index} should be of type 'object'`,
      ).toBe("object");
      expect(user, `User at index ${index} should not be null`).not.toBeNull();
      expect(
        user,
        `User at index ${index} should not be undefined`,
      ).not.toBeUndefined();
    }
  }

  @step("API: Verify no null or undefined values in required fields")
  async verifyNoNullOrUndefinedFields(): Promise<void> {
    const users = (await this.usersApiService.getAllUsers(
      UserSchemas.UsersListSchema,
    )) as UserSchemas.UsersList;

    for (let index = 0; index < users.length; index++) {
      const user = users[index];
      expect(
        user.id,
        `User at index ${index} has null/undefined id`,
      ).not.toBeNull();
      expect(
        user.id,
        `User at index ${index} has null/undefined id`,
      ).not.toBeUndefined();
      expect(
        user.name,
        `User at index ${index} has null/undefined name`,
      ).not.toBeNull();
      expect(
        user.name,
        `User at index ${index} has null/undefined name`,
      ).not.toBeUndefined();
    }
  }

  @step("API: Verify no empty name fields")
  async verifyNoEmptyNames(): Promise<void> {
    const users = (await this.usersApiService.getAllUsers(
      UserSchemas.UsersListSchema,
    )) as UserSchemas.UsersList;

    for (let index = 0; index < users.length; index++) {
      const user = users[index];
      expect(
        user.name.trim(),
        `User at index ${index} has empty name`,
      ).not.toBe("");
    }
  }

  @step("API: Verify security payload is rejected")
  async verifySecurityPayloadRejected(payload: string): Promise<void> {
    const response = (await this.usersApiService.getUserById(
      payload,
      null,
    )) as APIResponse;

    expect(response.status()).toBeGreaterThanOrEqual(
      UsersApiConfig.STATUS_CODES.BAD_REQUEST,
    );

    const body = await response.json();
    expect(body).toHaveProperty("message");
  }

  @step("API: Verify edge case ID is handled properly")
  async verifyEdgeCaseIdHandled(edgeCaseId: number | string): Promise<void> {
    const response = (await this.usersApiService.getUserById(
      edgeCaseId,
      null,
    )) as APIResponse;

    expect(response.status()).toBeGreaterThanOrEqual(
      UsersApiConfig.STATUS_CODES.BAD_REQUEST,
    );

    const body = await response.json();
    expect(body).toHaveProperty("message");
  }

  @step("API: Verify all user IDs are positive integers")
  async verifyAllIdsArePositiveIntegers(): Promise<void> {
    const users = (await this.usersApiService.getAllUsers(
      UserSchemas.UsersListSchema,
    )) as UserSchemas.UsersList;

    for (let index = 0; index < users.length; index++) {
      const user = users[index];
      expect(
        user.id,
        `User at index ${index} has non-positive id: ${user.id}`,
      ).toBeGreaterThan(0);
      expect(
        Number.isInteger(user.id),
        `User at index ${index} has non-integer id: ${user.id}`,
      ).toBeTruthy();
    }
  }

  @step("API: Verify all names are valid strings with content")
  async verifyAllNamesAreValidStrings(): Promise<void> {
    const users = (await this.usersApiService.getAllUsers(
      UserSchemas.UsersListSchema,
    )) as UserSchemas.UsersList;

    for (let index = 0; index < users.length; index++) {
      const user = users[index];
      expect(
        typeof user.name,
        `User at index ${index} name is not a string`,
      ).toBe("string");
      expect(
        user.name.length,
        `User at index ${index} name is empty`,
      ).toBeGreaterThan(0);
      expect(
        user.name.trim().length,
        `User at index ${index} name contains only whitespace`,
      ).toBeGreaterThan(0);
    }
  }

  @step("API: Verify response has array format for get all users")
  async verifyGetAllUsersReturnsArray(): Promise<void> {
    const response = (await this.usersApiService.getAllUsers(
      null,
    )) as APIResponse;
    const body = await response.json();

    expect(Array.isArray(body), "Response should be an array").toBeTruthy();
  }

  @step("API: Verify user by ID returns object not array")
  async verifyGetUserByIdReturnsObject(userId: number): Promise<void> {
    const response = (await this.usersApiService.getUserById(
      userId,
      null,
    )) as APIResponse;
    const body = await response.json();

    expect(typeof body, "Response should be an object").toBe("object");
    expect(Array.isArray(body), "Response should not be an array").toBeFalsy();
  }

  @step("API: Verify no internal server errors for any user")
  async verifyNoInternalServerErrors(): Promise<void> {
    // First, get all users to know what valid IDs exist
    const users = (await this.usersApiService.getAllUsers(
      UserSchemas.UsersListSchema,
    )) as UserSchemas.UsersList;
    const failedUsers: Array<{ id: number; error: string }> = [];

    // Test each user ID to ensure none return internal errors
    for (const user of users) {
      const response = (await this.usersApiService.getUserById(
        user.id,
        null,
      )) as APIResponse;
      const body = await response.json();

      // If we get an internal error, collect it for reporting
      if (body.message === UsersApiConfig.ERROR_MESSAGES.INTERNAL_ERROR) {
        failedUsers.push({ id: user.id, error: body.message });
      }
    }

    // Assert that NO users returned internal errors
    expect(
      failedUsers,
      `Expected no internal server errors, but found ${failedUsers.length} user(s) returning internal errors: ${failedUsers.map((f) => `ID ${f.id}`).join(", ")}`,
    ).toHaveLength(0);
  }
}
