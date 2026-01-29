import { test, expect } from "@jsonplaceholder/fixtures/index";
import { type APIResponse } from "@playwright/test";
import { RandomDataGenerator } from "@jsonplaceholder/utils/random-data-generator";
import { PostTestData, NegativeTestData } from "@test-data/jsonplaceholder";
import { buildCreatePostRequest } from "@jsonplaceholder/models/builders";
import * as PostTypes from "@jsonplaceholder/models/schemas/post.schemas";
import { StatusCode } from "@automationexercise/constants/StatusCode";

test.describe("JSONPlaceholder API - Negative Tests", () => {
  test.describe("POST Create - Negative Scenarios", () => {
    test("TC 6.1: Boundary - Handle extremely long title and body", async ({
      postSteps,
      jsonPlaceholderService,
    }) => {
      const titleLength = NegativeTestData.TITLE_LENGTHS.EXTREMELY_LONG;
      const longTitle =
        NegativeTestData.REPEAT_STRINGS.TITLE_CHAR.repeat(titleLength);
      const longBody = NegativeTestData.REPEAT_STRINGS.BODY_TEXT.repeat(
        NegativeTestData.REPEAT_STRINGS.BODY_REPEAT_COUNT,
      );
      const userId = RandomDataGenerator.userId();

      const result = await jsonPlaceholderService.createPost(
        {
          title: longTitle,
          body: longBody,
          userId,
        },
        { schema: null },
      );
      const response = result as APIResponse;

      expect(response).toHaveStatusCode(StatusCode.CREATED);

      const request = buildCreatePostRequest({
        title: longTitle,
        body: longBody,
        userId,
      });
      const post = await postSteps.createPost(request);
      expect(post.title.length).toBe(titleLength);
      expect(post.body.length).toBeGreaterThan(
        NegativeTestData.BODY_LENGTHS.MINIMUM_EXPECTED,
      );
    });

    test("TC 6.2: Negative - Handle invalid userIds", async ({ postSteps }) => {
      // Test negative userId
      const negativeRequest = buildCreatePostRequest({
        userId: NegativeTestData.USER_IDS.NEGATIVE,
      });
      const negativeUserPost = await postSteps.createPost(negativeRequest);
      expect(negativeUserPost.userId).toBe(NegativeTestData.USER_IDS.NEGATIVE);

      // Test zero userId
      const zeroRequest = buildCreatePostRequest({
        userId: NegativeTestData.USER_IDS.ZERO,
      });
      const zeroUserPost = await postSteps.createPost(zeroRequest);
      expect(zeroUserPost.userId).toBe(NegativeTestData.USER_IDS.ZERO);

      const nonExistentRequest = buildCreatePostRequest({
        userId: NegativeTestData.USER_IDS.NON_EXISTENT,
      });
      const nonExistentUserPost =
        await postSteps.createPost(nonExistentRequest);
      expect(nonExistentUserPost.userId).toBe(
        NegativeTestData.USER_IDS.NON_EXISTENT,
      );
    });

    test("TC 6.3: Negative - Handle post with empty strings", async ({
      postSteps,
    }) => {
      const emptyString = NegativeTestData.SPECIAL_STRINGS.EMPTY;

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
        title: NegativeTestData.SPECIAL_STRINGS.XSS_ATTEMPT,
      });
      const xssPost = await postSteps.createPost(xssRequest);
      expect(xssPost.title).toBe(NegativeTestData.SPECIAL_STRINGS.XSS_ATTEMPT);

      // SQL injection attempt
      const sqlRequest = buildCreatePostRequest({
        title: NegativeTestData.SPECIAL_STRINGS.SQL_INJECTION,
      });
      const sqlPost = await postSteps.createPost(sqlRequest);
      expect(sqlPost.title).toBe(
        NegativeTestData.SPECIAL_STRINGS.SQL_INJECTION,
      );

      // Unicode characters
      const unicodeRequest = buildCreatePostRequest({
        title: NegativeTestData.SPECIAL_STRINGS.UNICODE,
      });
      const unicodePost = await postSteps.createPost(unicodeRequest);
      expect(unicodePost.title).toBe(NegativeTestData.SPECIAL_STRINGS.UNICODE);
    });
  });

  test.describe("PUT Update - Negative Scenarios", () => {
    test("TC 6.5: Negative - Handle updating with invalid post IDs", async ({
      jsonPlaceholderService,
    }) => {
      const title = RandomDataGenerator.postTitle();
      const body = RandomDataGenerator.postBody();
      const userId = RandomDataGenerator.userId();

      // Non-existent ID returns 500
      const nonExistentResult = await jsonPlaceholderService.updatePost(
        NegativeTestData.POST_IDS.NON_EXISTENT_MEDIUM,
        { title, body, userId },
        { schema: null },
      );
      const nonExistentResponse = nonExistentResult as APIResponse;
      expect(nonExistentResponse).toHaveStatusCode(
        StatusCode.INTERNAL_SERVER_ERROR,
      );

      // Negative ID returns 500
      const negativeResult = await jsonPlaceholderService.updatePost(
        NegativeTestData.POST_IDS.NEGATIVE,
        { title, body, userId },
        { schema: null },
      );
      const negativeResponse = negativeResult as APIResponse;
      expect(negativeResponse).toHaveStatusCode(
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    });

    test("TC 6.6: Boundary - Handle partial update with empty payload", async ({
      jsonPlaceholderService,
    }) => {
      const postId = PostTestData.EXISTING_POST_ID;

      const result = await jsonPlaceholderService.updatePost(
        postId,
        {},
        { schema: null },
      );
      const response = result as APIResponse;

      expect(response.status()).toBe(StatusCode.OK);
    });
  });

  test.describe("DELETE - Negative Scenarios", () => {
    test("TC 6.7: Negative - Handle deleting non-existent and already deleted posts", async ({
      jsonPlaceholderService,
      responseSteps,
    }) => {
      const nonExistentId = NegativeTestData.POST_IDS.NON_EXISTENT_MEDIUM;

      const deleteResult = await jsonPlaceholderService.deletePost(
        nonExistentId,
        { schema: null },
      );
      const deleteResponse = deleteResult as APIResponse;
      await responseSteps.verifyStatusCodeIsOneOf(deleteResponse, [
        StatusCode.OK,
        StatusCode.NO_CONTENT,
      ]);

      const secondDeleteResult = await jsonPlaceholderService.deletePost(
        nonExistentId,
        { schema: null },
      );
      const secondDeleteResponse = secondDeleteResult as APIResponse;
      await responseSteps.verifyStatusCodeIsOneOf(secondDeleteResponse, [
        StatusCode.OK,
        StatusCode.NO_CONTENT,
      ]);
    });
  });

  test.describe("GET - Negative Scenarios", () => {
    test("TC 6.8: Negative - Handle getting posts with invalid IDs", async ({
      jsonPlaceholderService,
      responseSteps,
    }) => {
      // Very large ID returns 404
      const largeIdResult = await jsonPlaceholderService.getPostById(
        NegativeTestData.POST_IDS.NON_EXISTENT_LARGE,
        { schema: null },
      );
      const largeIdResponse = largeIdResult as APIResponse;
      expect(largeIdResponse).toHaveStatusCode(StatusCode.NOT_FOUND);
      const body = await largeIdResponse.json();
      expect(Object.keys(body).length).toBe(0);

      // Zero ID returns 404
      const zeroIdResult = await jsonPlaceholderService.getPostById(
        NegativeTestData.POST_IDS.ZERO,
        { schema: null },
      );
      const zeroIdResponse = zeroIdResult as APIResponse;
      expect(zeroIdResponse).toHaveStatusCode(StatusCode.NOT_FOUND);

      const stringIdResponse = await jsonPlaceholderService.getPostByStringId(
        PostTestData.GET_POSTS.INVALID_POST_ID,
      );
      await responseSteps.verifyStatusCodeIsOneOf(stringIdResponse, [400, 404]);
    });

    test("TC 6.9: Negative - Handle getting posts with invalid query parameter", async ({
      jsonPlaceholderService,
    }) => {
      // Invalid userId query returns empty array
      const posts = (await jsonPlaceholderService.getAllPosts({
        params: { userId: "abc" },
      })) as PostTypes.Post[];
      expect(Array.isArray(posts)).toBe(true);
      expect(posts.length).toBe(NegativeTestData.USER_IDS.ZERO);
    });
  });

  test.describe("Content-Type and Headers - Negative Scenarios", () => {
    test("TC 6.10: Negative - Handle POST with missing or wrong Content-Type", async ({
      jsonPlaceholderService,
    }) => {
      const payload = {
        title: RandomDataGenerator.postTitle(),
        body: RandomDataGenerator.postBody(),
        userId: RandomDataGenerator.userId(),
      };

      // Without Content-Type header
      const postWithoutHeader = (await jsonPlaceholderService.createPost(
        payload,
        { headers: {} },
      )) as PostTypes.CreatePostResponse;
      expect(postWithoutHeader.id).toBe(PostTestData.EXPECTED_CREATED_POST_ID);

      // With wrong Content-Type
      const wrongHeaderResult = await jsonPlaceholderService.createPost(
        payload,
        { headers: { "Content-Type": "text/plain" }, schema: null },
      );
      const wrongHeaderResponse = wrongHeaderResult as APIResponse;
      expect(wrongHeaderResponse).toHaveStatusCode(StatusCode.CREATED);
    });
  });

  test.describe("Boundary Value Testing", () => {
    test("TC 6.11: Boundary - Handle boundary values for userId and special whitespace", async ({
      postSteps,
    }) => {
      // Maximum 32-bit integer userId
      const maxUserIdRequest = buildCreatePostRequest({
        userId: NegativeTestData.USER_IDS.MAX_32_BIT_INTEGER,
      });
      const maxUserIdPost = await postSteps.createPost(maxUserIdRequest);
      expect(maxUserIdPost.userId).toBe(
        NegativeTestData.USER_IDS.MAX_32_BIT_INTEGER,
      );

      // Whitespace-only title
      const whitespaceRequest = buildCreatePostRequest({
        title: NegativeTestData.SPECIAL_STRINGS.WHITESPACE_ONLY,
      });
      const whitespacePost = await postSteps.createPost(whitespaceRequest);
      expect(whitespacePost.title).toBe(
        NegativeTestData.SPECIAL_STRINGS.WHITESPACE_ONLY,
      );

      // Title with newlines and tabs
      const newlineTabRequest = buildCreatePostRequest({
        title: NegativeTestData.SPECIAL_STRINGS.WITH_NEWLINES_TABS,
      });
      const newlineTabPost = await postSteps.createPost(newlineTabRequest);
      expect(newlineTabPost.title).toContain("\n");
      expect(newlineTabPost.title).toContain("\t");
    });
  });
});
