import { test, expect } from "@jsonplaceholder/fixtures/index";
import { RandomDataGenerator } from "@jsonplaceholder/utils/random-data-generator";
import { JsonPlaceholderTestData } from "@jsonplaceholder/constants/json-placeholder.constants";
import { buildCreatePostRequest } from "@jsonplaceholder/models/builders";

test.describe("JSONPlaceholder API - Negative Tests", () => {
  test.describe("POST Create - Negative Scenarios", () => {
    test("TC 6.1: Boundary - Handle extremely long title and body", async ({
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

      const response = await jsonPlaceholderService.createPost(
        {
          title: longTitle,
          body: longBody,
          userId,
        },
        null,
      );

      await responseSteps.verifyStatusCode(response, 201);

      const request = buildCreatePostRequest({
        title: longTitle,
        body: longBody,
        userId,
      });
      const post = await postSteps.createPost(request);
      expect(post.title.length).toBe(titleLength);
      expect(post.body.length).toBeGreaterThan(
        JsonPlaceholderTestData.NEGATIVE_TESTS.BODY_LENGTHS.MINIMUM_EXPECTED,
      );
    });

    test("TC 6.2: Negative - Handle invalid userIds", async ({ postSteps }) => {
      // Test negative userId
      const negativeRequest = buildCreatePostRequest({
        userId: JsonPlaceholderTestData.NEGATIVE_TESTS.USER_IDS.NEGATIVE,
      });
      const negativeUserPost = await postSteps.createPost(negativeRequest);
      expect(negativeUserPost.userId).toBe(
        JsonPlaceholderTestData.NEGATIVE_TESTS.USER_IDS.NEGATIVE,
      );

      // Test zero userId
      const zeroRequest = buildCreatePostRequest({
        userId: JsonPlaceholderTestData.NEGATIVE_TESTS.USER_IDS.ZERO,
      });
      const zeroUserPost = await postSteps.createPost(zeroRequest);
      expect(zeroUserPost.userId).toBe(
        JsonPlaceholderTestData.NEGATIVE_TESTS.USER_IDS.ZERO,
      );

      const nonExistentRequest = buildCreatePostRequest({
        userId: JsonPlaceholderTestData.NEGATIVE_TESTS.USER_IDS.NON_EXISTENT,
      });
      const nonExistentUserPost =
        await postSteps.createPost(nonExistentRequest);
      expect(nonExistentUserPost.userId).toBe(
        JsonPlaceholderTestData.NEGATIVE_TESTS.USER_IDS.NON_EXISTENT,
      );
    });

    test("TC 6.3: Negative - Handle post with empty strings", async ({
      postSteps,
    }) => {
      const emptyString =
        JsonPlaceholderTestData.NEGATIVE_TESTS.SPECIAL_STRINGS.EMPTY;

      // Empty title
      const emptyTitleRequest = buildCreatePostRequest({ title: emptyString });
      const emptyTitlePost = await postSteps.createPost(emptyTitleRequest);
      expect(emptyTitlePost.title).toBe(emptyString);

      // Empty body
      const emptyBodyRequest = buildCreatePostRequest({ body: emptyString });
      const emptyBodyPost = await postSteps.createPost(emptyBodyRequest);
      expect(emptyBodyPost.body).toBe(emptyString);
    });

    test("TC 6.4: Security - Handle special characters and security payloads", async ({
      postSteps,
    }) => {
      // XSS attempt
      const xssRequest = buildCreatePostRequest({
        title:
          JsonPlaceholderTestData.NEGATIVE_TESTS.SPECIAL_STRINGS.XSS_ATTEMPT,
      });
      const xssPost = await postSteps.createPost(xssRequest);
      expect(xssPost.title).toBe(
        JsonPlaceholderTestData.NEGATIVE_TESTS.SPECIAL_STRINGS.XSS_ATTEMPT,
      );

      // SQL injection attempt
      const sqlRequest = buildCreatePostRequest({
        title:
          JsonPlaceholderTestData.NEGATIVE_TESTS.SPECIAL_STRINGS.SQL_INJECTION,
      });
      const sqlPost = await postSteps.createPost(sqlRequest);
      expect(sqlPost.title).toBe(
        JsonPlaceholderTestData.NEGATIVE_TESTS.SPECIAL_STRINGS.SQL_INJECTION,
      );

      // Unicode characters
      const unicodeRequest = buildCreatePostRequest({
        title: JsonPlaceholderTestData.NEGATIVE_TESTS.SPECIAL_STRINGS.UNICODE,
      });
      const unicodePost = await postSteps.createPost(unicodeRequest);
      expect(unicodePost.title).toBe(
        JsonPlaceholderTestData.NEGATIVE_TESTS.SPECIAL_STRINGS.UNICODE,
      );
    });
  });

  test.describe("PUT Update - Negative Scenarios", () => {
    test("TC 6.5: Negative - Handle updating with invalid post IDs", async ({
      jsonPlaceholderService,
      responseSteps,
    }) => {
      const title = RandomDataGenerator.postTitle();
      const body = RandomDataGenerator.postBody();
      const userId = RandomDataGenerator.userId();

      // Non-existent ID returns 500
      const nonExistentResponse = await jsonPlaceholderService.updatePost(
        JsonPlaceholderTestData.NEGATIVE_TESTS.POST_IDS.NON_EXISTENT_MEDIUM,
        { title, body, userId },
        null,
      );
      await responseSteps.verifyStatusCode(nonExistentResponse, 500);

      // Negative ID returns 500
      const negativeResponse = await jsonPlaceholderService.updatePost(
        JsonPlaceholderTestData.NEGATIVE_TESTS.POST_IDS.NEGATIVE,
        { title, body, userId },
        null,
      );
      await responseSteps.verifyStatusCode(negativeResponse, 500);
    });

    test("TC 6.6: Boundary - Handle partial update with empty payload", async ({
      jsonPlaceholderService,
      responseSteps,
    }) => {
      const postId = JsonPlaceholderTestData.POST.EXISTING_POST_ID;

      const response = await jsonPlaceholderService.updatePost(
        postId,
        {},
        null,
      );

      await responseSteps.verifyStatusCode(response, 200);
    });
  });

  test.describe("DELETE - Negative Scenarios", () => {
    test("TC 6.7: Negative - Handle deleting non-existent and already deleted posts", async ({
      jsonPlaceholderService,
      responseSteps,
    }) => {
      const nonExistentId =
        JsonPlaceholderTestData.NEGATIVE_TESTS.POST_IDS.NON_EXISTENT_MEDIUM;

      const deleteResponse = await jsonPlaceholderService.deletePost(
        nonExistentId,
        null,
      );
      await responseSteps.verifyStatusCodeIsOneOf(deleteResponse, [200, 204]);

      const secondDeleteResponse = await jsonPlaceholderService.deletePost(
        nonExistentId,
        null,
      );
      await responseSteps.verifyStatusCodeIsOneOf(
        secondDeleteResponse,
        [200, 204],
      );
    });
  });

  test.describe("GET - Negative Scenarios", () => {
    test("TC 6.8: Negative - Handle getting posts with invalid IDs", async ({
      jsonPlaceholderService,
      responseSteps,
    }) => {
      // Very large ID returns 404
      const largeIdResponse = await jsonPlaceholderService.getPostById(
        JsonPlaceholderTestData.NEGATIVE_TESTS.POST_IDS.NON_EXISTENT_LARGE,
        null,
      );
      await responseSteps.verifyStatusCode(largeIdResponse, 404);
      await responseSteps.verifyEmptyBody(largeIdResponse);

      // Zero ID returns 404
      const zeroIdResponse = await jsonPlaceholderService.getPostById(
        JsonPlaceholderTestData.NEGATIVE_TESTS.POST_IDS.ZERO,
        null,
      );
      await responseSteps.verifyStatusCode(zeroIdResponse, 404);

      const stringIdResponse = await jsonPlaceholderService.getPostByStringId(
        JsonPlaceholderTestData.GET_POSTS.INVALID_POST_ID,
      );
      await responseSteps.verifyStatusCodeIsOneOf(stringIdResponse, [400, 404]);
    });

    test("TC 6.9: Negative - Handle getting posts with invalid query parameter", async ({
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
    test("TC 6.10: Negative - Handle POST with missing or wrong Content-Type", async ({
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
      const wrongHeaderResponse = await jsonPlaceholderService.createPost(
        payload,
        null,
      );
      await responseSteps.verifyStatusCode(wrongHeaderResponse, 201);
    });
  });

  test.describe("Boundary Value Testing", () => {
    test("TC 6.11: Boundary - Handle boundary values for userId and special whitespace", async ({
      postSteps,
    }) => {
      // Maximum 32-bit integer userId
      const maxUserIdRequest = buildCreatePostRequest({
        userId:
          JsonPlaceholderTestData.NEGATIVE_TESTS.USER_IDS.MAX_32_BIT_INTEGER,
      });
      const maxUserIdPost = await postSteps.createPost(maxUserIdRequest);
      expect(maxUserIdPost.userId).toBe(
        JsonPlaceholderTestData.NEGATIVE_TESTS.USER_IDS.MAX_32_BIT_INTEGER,
      );

      // Whitespace-only title
      const whitespaceRequest = buildCreatePostRequest({
        title:
          JsonPlaceholderTestData.NEGATIVE_TESTS.SPECIAL_STRINGS
            .WHITESPACE_ONLY,
      });
      const whitespacePost = await postSteps.createPost(whitespaceRequest);
      expect(whitespacePost.title).toBe(
        JsonPlaceholderTestData.NEGATIVE_TESTS.SPECIAL_STRINGS.WHITESPACE_ONLY,
      );

      // Title with newlines and tabs
      const newlineTabRequest = buildCreatePostRequest({
        title:
          JsonPlaceholderTestData.NEGATIVE_TESTS.SPECIAL_STRINGS
            .WITH_NEWLINES_TABS,
      });
      const newlineTabPost = await postSteps.createPost(newlineTabRequest);
      expect(newlineTabPost.title).toContain("\n");
      expect(newlineTabPost.title).toContain("\t");
    });
  });
});
