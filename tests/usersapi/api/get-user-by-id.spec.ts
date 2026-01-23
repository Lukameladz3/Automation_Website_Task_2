import { test, expect } from "../../../src/usersapi/fixtures";
import { UsersApiTestData } from "../../../src/usersapi/constants";

test.describe("GET /api/users/:id - Get User By ID", () => {
  test.describe("Valid User IDs", () => {
    test("should return valid response for all valid IDs", async ({
      usersSteps,
    }) => {
      await usersSteps.verifyAllValidUserIds(
        UsersApiTestData.VALID_USER_IDS,
        UsersApiTestData.EXPECTED_RESPONSE_TIME.GET_USER_BY_ID,
      );
    });
  });

  test.describe("Invalid User IDs", () => {
    test("should return 404 for non-existent user", async ({
      usersSteps,
      responseSteps,
    }) => {
      const response = await usersSteps.getUserById(
        UsersApiTestData.NON_EXISTENT_USER_ID,
        null,
      );
      await responseSteps.verifyStatusCode(
        response,
        404,
      );

      const body = await response.json();
      expect(body.message).toBe(UsersApiTestData.ERROR_MESSAGES.USER_NOT_FOUND);
    });

    test("should return error for invalid user IDs", async ({ usersSteps }) => {
      await usersSteps.verifyErrorForInvalidUserIds(
        UsersApiTestData.INVALID_USER_IDS,
        UsersApiTestData.ERROR_MESSAGES.USER_NOT_FOUND,
      );
    });

    test("should handle invalid ID formats", async ({ usersSteps }) => {
      await usersSteps.verifyInvalidIdFormats(
        UsersApiTestData.INVALID_ID_FORMATS,
      );
    });
  });

  
  test("FAIL: should not return internal errors for user IDs 3 and 5 @bug", async ({
    usersSteps,
  }) => {
    // Document the bug: API returns "Internal error" for user IDs 3 and 5
    await usersSteps.verifyInternalServerErrors(
      UsersApiTestData.INTERNAL_ERROR_IDS,
    );
  });

  test("should return same user data on multiple requests", async ({
    usersSteps,
  }) => {
    const user1 = await usersSteps.getUserById(UsersApiTestData.TEST_USER_ID);
    const user2 = await usersSteps.getUserById(UsersApiTestData.TEST_USER_ID);

    expect(user1).toEqual(user2);
  });
});
