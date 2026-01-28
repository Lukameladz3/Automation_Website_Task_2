import { test, expect } from "@usersapi/fixtures/index";
import { type APIResponse } from "@playwright/test";
import { UsersApiConfig } from "@usersapi/constants/index";
import * as UserSchemas from "@usersapi/models/schemas";

test.describe("GET /api/users - Get All Users", () => {
  test("should return 200 status with valid response time", async ({
    usersSteps,
    responseSteps,
  }) => {
    const { response, responseTime } = await responseSteps.measureResponseTime(
      async () => {
        const result = await usersSteps.getAllUsers(null);
        return result as APIResponse;
      },
    );

    expect(response.status()).toBe(200);
    const contentType = response.headers()["content-type"];
    expect(contentType).toContain("application/json");
    expect(responseTime).toBeLessThanOrEqual(
      UsersApiConfig.RESPONSE_TIME_THRESHOLDS.GET_ALL_USERS,
    );
  });

  test("should return all users with valid schema", async ({ usersSteps }) => {
    await usersSteps.getAllUsers(UserSchemas.UsersListSchema);
  });

  test("should have valid data types for all fields", async ({
    usersSteps,
  }) => {
    await usersSteps.verifyAllUsersHaveValidDataTypes();
  });

  test("FAIL: all user IDs should be unique @bug", async ({ usersSteps }) => {
    // This test will FAIL because there are duplicate user IDs in the response
    await usersSteps.verifyNoDuplicateIds();
  });

  test("should identify users without age field", async ({ usersSteps }) => {
    await usersSteps.identifyUsersWithoutAge();
  });

  test("should successfully return users without age field without errors", async ({
    usersSteps,
  }) => {
    await usersSteps.verifyUsersWithoutAgeAreValid();
  });

  test.describe("Response Structure Validation", () => {
    test("should return array for get all users endpoint", async ({
      usersSteps,
    }) => {
      await usersSteps.verifyGetAllUsersReturnsArray();
    });

    test("should not return malformed data structure", async ({
      usersSteps,
    }) => {
      await usersSteps.verifyValidArrayStructure();
    });
  });

  test.describe("Data Integrity", () => {
    test("should have all user IDs as positive integers", async ({
      usersSteps,
    }) => {
      await usersSteps.verifyAllIdsArePositiveIntegers();
    });

    test("should have all names as valid strings with content", async ({
      usersSteps,
    }) => {
      await usersSteps.verifyAllNamesAreValidStrings();
    });

    test("should not have null or undefined values for required fields", async ({
      usersSteps,
    }) => {
      await usersSteps.verifyNoNullOrUndefinedFields();
    });

    test("should not have empty strings for name field", async ({
      usersSteps,
    }) => {
      await usersSteps.verifyNoEmptyNames();
    });
  });
});
