import { test, expect } from "@usersapi/fixtures/index";
import { type APIResponse } from "@playwright/test";
import { UsersApiConfig } from "@usersapi/constants/index";
import { UserIdsTestData, SecurityTestPayloads } from "@test-data/usersapi";

test.describe("Negative Scenarios", () => {
  test.describe("Invalid User IDs", () => {
    test("should return 404 for non-existent user @negative", async ({
      usersSteps,
    }) => {
      // Dynamically find a guaranteed non-existent user ID
      const nonExistentId = await usersSteps.getNonExistentUserId();

      const result = await usersSteps.getUserById(nonExistentId, null);
      const response = result as APIResponse;
      expect(response.status()).toBe(404);

      const body = await response.json();
      expect(body.message).toBe(UsersApiConfig.ERROR_MESSAGES.USER_NOT_FOUND);
    });

    test("should handle invalid ID formats @negative", async ({
      usersSteps,
    }) => {
      await usersSteps.verifyInvalidIdFormats(UserIdsTestData.INVALID_FORMATS);
    });

    test("should handle extremely large ID numbers @negative", async ({
      usersSteps,
    }) => {
      await usersSteps.verifyEdgeCaseIdHandled(
        UserIdsTestData.EDGE_CASES.VERY_LARGE,
      );
    });

    test("should handle float ID values @negative", async ({
      usersSteps,
    }) => {
      await usersSteps.verifyEdgeCaseIdHandled(
        UserIdsTestData.EDGE_CASES.FLOAT,
      );
    });

    test("should handle large negative ID values @negative", async ({
      usersSteps,
    }) => {
      await usersSteps.verifyEdgeCaseIdHandled(
        UserIdsTestData.EDGE_CASES.NEGATIVE_LARGE,
      );
    });
  });

  test.describe("Security Tests", () => {
    test("should reject SQL injection attempts @negative @security", async ({
      usersSteps,
    }) => {
      await usersSteps.verifySecurityPayloadRejected(
        SecurityTestPayloads.SQL_INJECTION,
      );
    });

    test("should reject XSS attempts @negative @security", async ({
      usersSteps,
    }) => {
      await usersSteps.verifySecurityPayloadRejected(
        SecurityTestPayloads.XSS_ATTEMPT,
      );
    });

    test("should reject path traversal attempts @negative @security", async ({
      usersSteps,
    }) => {
      await usersSteps.verifySecurityPayloadRejected(
        SecurityTestPayloads.PATH_TRAVERSAL,
      );
    });

    test("should reject null byte injection @negative @security", async ({
      usersSteps,
    }) => {
      await usersSteps.verifySecurityPayloadRejected(
        SecurityTestPayloads.NULL_BYTE,
      );
    });

    test("should reject unicode overflow attempts @negative @security", async ({
      usersSteps,
    }) => {
      await usersSteps.verifySecurityPayloadRejected(
        SecurityTestPayloads.UNICODE_OVERFLOW,
      );
    });
  });
});
