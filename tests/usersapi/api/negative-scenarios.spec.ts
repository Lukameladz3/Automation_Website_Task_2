import { test } from "../../../src/usersapi/fixtures";
import { UsersApiTestData } from "../../../src/usersapi/constants";

test.describe("Negative Scenarios - Edge Cases", () => {
  test.describe("Security Tests", () => {
    test("should reject SQL injection attempts", async ({ usersSteps }) => {
      await usersSteps.verifySecurityPayloadRejected(
        UsersApiTestData.SECURITY_TEST_PAYLOADS.SQL_INJECTION,
      );
    });

    test("should reject XSS attempts", async ({ usersSteps }) => {
      await usersSteps.verifySecurityPayloadRejected(
        UsersApiTestData.SECURITY_TEST_PAYLOADS.XSS_ATTEMPT,
      );
    });

    test("should reject path traversal attempts", async ({ usersSteps }) => {
      await usersSteps.verifySecurityPayloadRejected(
        UsersApiTestData.SECURITY_TEST_PAYLOADS.PATH_TRAVERSAL,
      );
    });

    test("should reject null byte injection", async ({ usersSteps }) => {
      await usersSteps.verifySecurityPayloadRejected(
        UsersApiTestData.SECURITY_TEST_PAYLOADS.NULL_BYTE,
      );
    });

    test("should reject unicode overflow attempts", async ({ usersSteps }) => {
      await usersSteps.verifySecurityPayloadRejected(
        UsersApiTestData.SECURITY_TEST_PAYLOADS.UNICODE_OVERFLOW,
      );
    });
  });

  test.describe("Edge Case IDs", () => {
    test("should handle extremely large ID numbers", async ({ usersSteps }) => {
      await usersSteps.verifyEdgeCaseIdHandled(
        UsersApiTestData.EDGE_CASE_IDS.VERY_LARGE,
      );
    });

    test("should handle float ID values", async ({ usersSteps }) => {
      await usersSteps.verifyEdgeCaseIdHandled(
        UsersApiTestData.EDGE_CASE_IDS.FLOAT,
      );
    });

    test("should handle large negative ID values", async ({ usersSteps }) => {
      await usersSteps.verifyEdgeCaseIdHandled(
        UsersApiTestData.EDGE_CASE_IDS.NEGATIVE_LARGE,
      );
    });
  });

  test.describe("Response Structure Validation", () => {
    test("should return array for get all users endpoint", async ({
      usersSteps,
    }) => {
      await usersSteps.verifyGetAllUsersReturnsArray();
    });

    test("should return object not array for get user by ID", async ({
      usersSteps,
    }) => {
      await usersSteps.verifyGetUserByIdReturnsObject(
        UsersApiTestData.TEST_USER_ID,
      );
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
