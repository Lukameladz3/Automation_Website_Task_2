import { test, expect } from "@usersapi/fixtures/index";
import { type APIResponse } from "@playwright/test";
import { UsersApiConfig } from "@usersapi/constants/index";
import { UserIdsTestData } from "@test-data/usersapi";
import * as UserSchemas from "@usersapi/models/schemas";

test.describe("GET /api/users/:id - Get User By ID", () => {
  test.describe("Valid User IDs", () => {
    test("should return valid response for all valid IDs", async ({
      usersSteps,
    }) => {
      await usersSteps.verifyAllValidUserIds(
        UserIdsTestData.VALID,
        UsersApiConfig.RESPONSE_TIME_THRESHOLDS.GET_USER_BY_ID,
      );
    });
  });

  test.describe("Invalid User IDs", () => {
    test("should return 404 for non-existent user", async ({ usersSteps }) => {
      // Dynamically find a guaranteed non-existent user ID
      const nonExistentId = await usersSteps.getNonExistentUserId();

      const result = await usersSteps.getUserById(nonExistentId, null);
      const response = result as APIResponse;
      expect(response.status()).toBe(404);

      const body = await response.json();
      expect(body.message).toBe(UsersApiConfig.ERROR_MESSAGES.USER_NOT_FOUND);
    });

    test("should handle invalid ID formats", async ({ usersSteps }) => {
      await usersSteps.verifyInvalidIdFormats(UserIdsTestData.INVALID_FORMATS);
    });
  });

  test("FAIL: should not return internal errors for any valid user ID @bug", async ({
    usersSteps,
  }) => {
    // Test that no valid user ID returns an internal server error
    // This will fail and report which IDs are problematic (currently IDs 3 and 5)
    await usersSteps.verifyNoInternalServerErrors();
  });

  test("should return same user data on multiple requests", async ({
    usersSteps,
  }) => {
    const result1 = await usersSteps.getUserById(
      UserIdsTestData.CONSISTENT_TEST_USER,
    );
    const result2 = await usersSteps.getUserById(
      UserIdsTestData.CONSISTENT_TEST_USER,
    );
    const user1 = result1 as UserSchemas.User;
    const user2 = result2 as UserSchemas.User;

    expect(user1.id).toBe(user2.id);
    expect(user1.name).toBe(user2.name);
    expect(user1.age).toBe(user2.age);
  });
});
