import { test } from "@usersapi/fixtures/index";
import { UserIdsTestData, SecurityTestPayloads } from "@test-data/usersapi";

test.describe("Negative Scenarios - Edge Cases", () => {
  test.describe("Security Tests", () => {
    test("should reject SQL injection attempts", async ({ usersSteps }) => {
      await usersSteps.verifySecurityPayloadRejected(
        SecurityTestPayloads.SQL_INJECTION,
      );
    });

    test("should reject XSS attempts", async ({ usersSteps }) => {
      await usersSteps.verifySecurityPayloadRejected(
        SecurityTestPayloads.XSS_ATTEMPT,
      );
    });

    test("should reject path traversal attempts", async ({ usersSteps }) => {
      await usersSteps.verifySecurityPayloadRejected(
        SecurityTestPayloads.PATH_TRAVERSAL,
      );
    });

    test("should reject null byte injection", async ({ usersSteps }) => {
      await usersSteps.verifySecurityPayloadRejected(
        SecurityTestPayloads.NULL_BYTE,
      );
    });

    test("should reject unicode overflow attempts", async ({ usersSteps }) => {
      await usersSteps.verifySecurityPayloadRejected(
        SecurityTestPayloads.UNICODE_OVERFLOW,
      );
    });
  });

  test.describe("Edge Case IDs", () => {
    test("should handle extremely large ID numbers", async ({ usersSteps }) => {
      await usersSteps.verifyEdgeCaseIdHandled(
        UserIdsTestData.EDGE_CASES.VERY_LARGE,
      );
    });

    test("should handle float ID values", async ({ usersSteps }) => {
      await usersSteps.verifyEdgeCaseIdHandled(
        UserIdsTestData.EDGE_CASES.FLOAT,
      );
    });

    test("should handle large negative ID values", async ({ usersSteps }) => {
      await usersSteps.verifyEdgeCaseIdHandled(
        UserIdsTestData.EDGE_CASES.NEGATIVE_LARGE,
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
        UserIdsTestData.CONSISTENT_TEST_USER,
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
