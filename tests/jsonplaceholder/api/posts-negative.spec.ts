import { test, expect } from "@jsonplaceholder/fixtures/index";
import { RandomDataGenerator } from "@jsonplaceholder/utils/random-data-generator";
import { JsonPlaceholderTestData } from "@jsonplaceholder/constants/json-placeholder.constants";

test.describe("JSONPlaceholder API - Negative Tests", () => {
  test.describe("POST Create - Negative Scenarios", () => {
    test("should handle post with extremely long title and body", async ({
      postSteps,
      jsonPlaceholderService,
      responseSteps,
    }) => {
      const titleLength =
        JsonPlaceholderTestData.NEGATIVE_TESTS.TITLE_LENGTHS.EXTREMELY_LONG;
      const longTitle =
        JsonPlaceholderTestData.NEGATIVE_TESTS.REPEAT_STRINGS.TITLE_CHAR.repeat(
          titleLength,
        );
      const longBody =
        JsonPlaceholderTestData.NEGATIVE_TESTS.REPEAT_STRINGS.BODY_TEXT.repeat(
          JsonPlaceholderTestData.NEGATIVE_TESTS.REPEAT_STRINGS
            .BODY_REPEAT_COUNT,
        );
      const userId = RandomDataGenerator.userId();

      const response = await jsonPlaceholderService.createPostRaw({
        title: longTitle,
        body: longBody,
        userId,
      });

      await responseSteps.verifyStatusCode(
        response,
        JsonPlaceholderTestData.STATUS_CODES.SUCCESS_CREATED,
      );

      const post = await postSteps.createPost(longTitle, longBody, userId);
      expect(post.title.length).toBe(titleLength);
      expect(post.body.length).toBeGreaterThan(
        JsonPlaceholderTestData.NEGATIVE_TESTS.BODY_LENGTHS.MINIMUM_EXPECTED,
      );
    });

    test("should handle post with invalid userIds (negative, zero, non-existent)", async ({
      postSteps,
    }) => {
      const title = RandomDataGenerator.postTitle();
      const body = RandomDataGenerator.postBody();

      // Test negative userId
      const negativeUserPost = await postSteps.createPost(
        title,
        body,
        JsonPlaceholderTestData.NEGATIVE_TESTS.USER_IDS.NEGATIVE,
      );
      expect(negativeUserPost.userId).toBe(
        JsonPlaceholderTestData.NEGATIVE_TESTS.USER_IDS.NEGATIVE,
      );

      // Test zero userId
      const zeroUserPost = await postSteps.createPost(
        title,
        body,
        JsonPlaceholderTestData.NEGATIVE_TESTS.USER_IDS.ZERO,
      );
      expect(zeroUserPost.userId).toBe(
        JsonPlaceholderTestData.NEGATIVE_TESTS.USER_IDS.ZERO,
      );

      const nonExistentUserPost = await postSteps.createPost(
        title,
        body,
        JsonPlaceholderTestData.NEGATIVE_TESTS.USER_IDS.NON_EXISTENT,
      );
      expect(nonExistentUserPost.userId).toBe(
        JsonPlaceholderTestData.NEGATIVE_TESTS.USER_IDS.NON_EXISTENT,
      );
    });

    test("should handle post with empty strings", async ({ postSteps }) => {
      const emptyString =
        JsonPlaceholderTestData.NEGATIVE_TESTS.SPECIAL_STRINGS.EMPTY;

      // Empty title
      const emptyTitlePost = await postSteps.createPost(
        emptyString,
        RandomDataGenerator.postBody(),
        RandomDataGenerator.userId(),
      );
      expect(emptyTitlePost.title).toBe(emptyString);

      // Empty body
      const emptyBodyPost = await postSteps.createPost(
        RandomDataGenerator.postTitle(),
        emptyString,
        RandomDataGenerator.userId(),
      );
      expect(emptyBodyPost.body).toBe(emptyString);
    });

    test("should handle post with special characters and security payloads", async ({
      postSteps,
    }) => {
      const body = RandomDataGenerator.postBody();
      const userId = RandomDataGenerator.userId();

      // XSS attempt
      const xssPost = await postSteps.createPost(
        JsonPlaceholderTestData.NEGATIVE_TESTS.SPECIAL_STRINGS.XSS_ATTEMPT,
        body,
        userId,
      );
      expect(xssPost.title).toBe(
        JsonPlaceholderTestData.NEGATIVE_TESTS.SPECIAL_STRINGS.XSS_ATTEMPT,
      );

      // SQL injection attempt
      const sqlPost = await postSteps.createPost(
        JsonPlaceholderTestData.NEGATIVE_TESTS.SPECIAL_STRINGS.SQL_INJECTION,
        body,
        userId,
      );
      expect(sqlPost.title).toBe(
        JsonPlaceholderTestData.NEGATIVE_TESTS.SPECIAL_STRINGS.SQL_INJECTION,
      );

      // Unicode characters
      const unicodePost = await postSteps.createPost(
        JsonPlaceholderTestData.NEGATIVE_TESTS.SPECIAL_STRINGS.UNICODE,
        body,
        userId,
      );
      expect(unicodePost.title).toBe(
        JsonPlaceholderTestData.NEGATIVE_TESTS.SPECIAL_STRINGS.UNICODE,
      );
    });
  });

  test.describe("PUT Update - Negative Scenarios", () => {
    test("should handle updating with invalid post IDs", async ({
      jsonPlaceholderService,
      responseSteps,
    }) => {
      const title = RandomDataGenerator.postTitle();
      const body = RandomDataGenerator.postBody();
      const userId = RandomDataGenerator.userId();

      // Non-existent ID returns 500
      const nonExistentResponse = await jsonPlaceholderService.updatePostRaw(
        JsonPlaceholderTestData.NEGATIVE_TESTS.POST_IDS.NON_EXISTENT_MEDIUM,
        { title, body, userId },
      );
      await responseSteps.verifyStatusCode(
        nonExistentResponse,
        JsonPlaceholderTestData.STATUS_CODES.ERROR_SERVER,
      );

      // Negative ID returns 500
      const negativeResponse = await jsonPlaceholderService.updatePostRaw(
        JsonPlaceholderTestData.NEGATIVE_TESTS.POST_IDS.NEGATIVE,
        { title, body, userId },
      );
      await responseSteps.verifyStatusCode(
        negativeResponse,
        JsonPlaceholderTestData.STATUS_CODES.ERROR_SERVER,
      );
    });

    test("should handle partial update with empty payload", async ({
      jsonPlaceholderService,
      responseSteps,
    }) => {
      const postId = JsonPlaceholderTestData.POST.EXISTING_POST_ID;

      const response = await jsonPlaceholderService.updatePostRaw(
        postId,
        {},
      );

      await responseSteps.verifyStatusCode(
        response,
        JsonPlaceholderTestData.STATUS_CODES.SUCCESS_OK,
      );
    });
  });

  test.describe("DELETE - Negative Scenarios", () => {
    test("should handle deleting non-existent and already deleted posts", async ({
      jsonPlaceholderService,
      responseSteps,
    }) => {
      const nonExistentId =
        JsonPlaceholderTestData.NEGATIVE_TESTS.POST_IDS.NON_EXISTENT_MEDIUM;

      const deleteResponse =
        await jsonPlaceholderService.deletePostRaw(nonExistentId);
      await responseSteps.verifyStatusCodeIsOneOf(
        deleteResponse,
        JsonPlaceholderTestData.STATUS_CODES.SUCCESS_DELETE_CODES,
      );

      const secondDeleteResponse =
        await jsonPlaceholderService.deletePostRaw(nonExistentId);
      await responseSteps.verifyStatusCodeIsOneOf(
        secondDeleteResponse,
        JsonPlaceholderTestData.STATUS_CODES.SUCCESS_DELETE_CODES,
      );
    });
  });

  test.describe("GET - Negative Scenarios", () => {
    test("should handle getting posts with invalid IDs", async ({
      postSteps,
      responseSteps,
    }) => {
      // Very large ID returns 404
      const largeIdResponse = await postSteps.getRawPostResponse(
        JsonPlaceholderTestData.NEGATIVE_TESTS.POST_IDS.NON_EXISTENT_LARGE,
      );
      await responseSteps.verifyStatusCode(
        largeIdResponse,
        JsonPlaceholderTestData.STATUS_CODES.ERROR_NOT_FOUND,
      );
      await responseSteps.verifyEmptyBody(largeIdResponse);

      // Zero ID returns 404
      const zeroIdResponse = await postSteps.getRawPostResponse(
        JsonPlaceholderTestData.NEGATIVE_TESTS.POST_IDS.ZERO,
      );
      await responseSteps.verifyStatusCode(
        zeroIdResponse,
        JsonPlaceholderTestData.STATUS_CODES.ERROR_NOT_FOUND,
      );

      // String ID returns 404
      const stringIdResponse = await postSteps.getPostByStringId(
        JsonPlaceholderTestData.GET_POSTS.INVALID_POST_ID,
      );
      await responseSteps.verifyStatusCodeIsOneOf(
        stringIdResponse,
        JsonPlaceholderTestData.STATUS_CODES.ERROR_CODES,
      );
    });

    test("should handle getting posts with invalid query parameter", async ({
      jsonPlaceholderService,
    }) => {
      // Invalid userId query returns empty array
      const posts = await jsonPlaceholderService.getPostsWithInvalidQuery();
      expect(Array.isArray(posts)).toBe(true);
      expect(posts.length).toBe(
        JsonPlaceholderTestData.NEGATIVE_TESTS.USER_IDS.ZERO,
      );
    });
  });

  test.describe("Content-Type and Headers - Negative Scenarios", () => {
    test("should handle POST with missing or wrong Content-Type", async ({
      jsonPlaceholderService,
      responseSteps,
    }) => {
      const payload = {
        title: RandomDataGenerator.postTitle(),
        body: RandomDataGenerator.postBody(),
        userId: RandomDataGenerator.userId(),
      };

      // Without Content-Type header
      const postWithoutHeader =
        await jsonPlaceholderService.createPostWithoutContentType(payload);
      expect(postWithoutHeader.id).toBe(
        JsonPlaceholderTestData.POST.EXPECTED_CREATED_POST_ID,
      );

      // With wrong Content-Type
      const wrongHeaderResponse =
        await jsonPlaceholderService.createPostRaw(payload);
      await responseSteps.verifyStatusCode(
        wrongHeaderResponse,
        JsonPlaceholderTestData.STATUS_CODES.SUCCESS_CREATED,
      );
    });
  });

  test.describe("Boundary Value Testing", () => {
    test("should handle boundary values for userId and special whitespace", async ({
      postSteps,
    }) => {
      const title = RandomDataGenerator.postTitle();
      const body = RandomDataGenerator.postBody();

      // Maximum 32-bit integer userId
      const maxUserIdPost = await postSteps.createPost(
        title,
        body,
        JsonPlaceholderTestData.NEGATIVE_TESTS.USER_IDS.MAX_32_BIT_INTEGER,
      );
      expect(maxUserIdPost.userId).toBe(
        JsonPlaceholderTestData.NEGATIVE_TESTS.USER_IDS.MAX_32_BIT_INTEGER,
      );

      // Whitespace-only title
      const whitespacePost = await postSteps.createPost(
        JsonPlaceholderTestData.NEGATIVE_TESTS.SPECIAL_STRINGS.WHITESPACE_ONLY,
        body,
        RandomDataGenerator.userId(),
      );
      expect(whitespacePost.title).toBe(
        JsonPlaceholderTestData.NEGATIVE_TESTS.SPECIAL_STRINGS.WHITESPACE_ONLY,
      );

      // Title with newlines and tabs
      const newlineTabPost = await postSteps.createPost(
        JsonPlaceholderTestData.NEGATIVE_TESTS.SPECIAL_STRINGS
          .WITH_NEWLINES_TABS,
        body,
        RandomDataGenerator.userId(),
      );
      expect(newlineTabPost.title).toContain("\n");
      expect(newlineTabPost.title).toContain("\t");
    });
  });
});
