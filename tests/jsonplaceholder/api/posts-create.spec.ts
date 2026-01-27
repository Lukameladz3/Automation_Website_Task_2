import { test, expect } from "@jsonplaceholder/fixtures/index";
import { type APIResponse } from "@playwright/test";
import {
  buildCreatePostRequest,
} from "@jsonplaceholder/models/builders";
import { PostTestData } from "@test-data/jsonplaceholder";

test.describe("JSONPlaceholder API - POST Create Post", () => {
  test("TC 3.1: Create Post - Status 201, echo check, id=101", async ({
    postSteps,
    jsonPlaceholderService,
  }) => {
    const request = buildCreatePostRequest();

    // Use raw response to check status code
    const result = await jsonPlaceholderService.createPost(request, {
      schema: null,
    });
    const response = result as APIResponse;
    expect(response.status()).toBe(201);

    // Now create with validated method
    const post = await postSteps.createPost(request);
    await postSteps.verifyPost(post, request);
    expect(post.id).toBe(PostTestData.EXPECTED_CREATED_POST_ID);
  });

  test("TC 3.2: Empty Payload - Test API strictness", async ({
    postSteps,
    jsonPlaceholderService,
  }) => {
    const request = {};

    // Use raw response to check status code
    const result = await jsonPlaceholderService.createPost(request, {
      schema: null,
    });
    const response = result as APIResponse;
    expect(response.status()).toBe(201);

    // Use partial validation method
    const post = await postSteps.createPostWithPartialValidation(request);
    expect(post.id).toBe(PostTestData.EXPECTED_CREATED_POST_ID);
  });

  test("TC 3.3: Field Echo Check - Extra field (admin: true) echoed back", async ({
    postSteps,
    jsonPlaceholderService,
  }) => {
    const extraFields = PostTestData.SECURITY_TEST_EXTRA_FIELD;
    const request = { ...buildCreatePostRequest(), ...extraFields };

    const result = await jsonPlaceholderService.createPost(request, {
      schema: null,
    });
    const response = result as APIResponse;
    expect(response.status()).toBe(201);

    // Use passthrough method for validation
    const post = await postSteps.createPostWithPassthrough(request);
    expect((post as any)["admin"]).toBe(true);
    await postSteps.verifyPost(post, request);
    expect(post.id).toBe(PostTestData.EXPECTED_CREATED_POST_ID);
  });
});
