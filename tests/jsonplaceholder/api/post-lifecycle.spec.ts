import { test, expect } from "@jsonplaceholder/fixtures/index";
import { type APIResponse } from "@playwright/test";
import { RandomDataGenerator } from "@jsonplaceholder/utils/random-data-generator";
import { PostTestData } from "@test-data/jsonplaceholder";
import { buildCreatePostRequest } from "@jsonplaceholder/models/builders";
import { StatusCode } from "@automationexercise/constants/StatusCode";

test.describe("JSONPlaceholder API - CRUD Operations Demo", () => {
  test("Create, Read, Update, Delete operations on existing post", async ({
    postSteps,
    jsonPlaceholderService,
    responseSteps,
  }) => {
    const newTitle = RandomDataGenerator.postTitle();
    const newBody = RandomDataGenerator.postBody();
    const updatedTitle = `Updated: ${RandomDataGenerator.postTitle()}`;
    const userId = RandomDataGenerator.userId();

    // Create with validated method
    const createRequest = buildCreatePostRequest({
      title: newTitle,
      body: newBody,
      userId,
    });
    const createdPost = await postSteps.createPost(createRequest);
    await postSteps.verifyPost(createdPost, {
      title: newTitle,
      body: newBody,
      userId,
    });
    expect(createdPost.id).toBe(PostTestData.EXPECTED_CREATED_POST_ID);

    // READ - Use validated method
    const existingPostId = PostTestData.EXISTING_POST_ID;
    const readPost = await postSteps.getPost(existingPostId);
    await postSteps.verifyPost(readPost, { id: existingPostId });
    await postSteps.verifyPostHasContent(readPost);

    // UPDATE - Use raw response to check status code
    const updateResult = await jsonPlaceholderService.updatePost(
      existingPostId,
      { title: updatedTitle, body: newBody, userId },
      { schema: null },
    );
    const updateResponse = updateResult as APIResponse;
    expect(updateResponse.status()).toBe(StatusCode.OK);

    // Update with validated method
    const updatedPost = await postSteps.updatePost(
      existingPostId,
      updatedTitle,
      newBody,
      userId,
    );
    expect(updatedPost.title).toBe(updatedTitle);
    expect(updatedPost.id).toBe(existingPostId);

    // DELETE - Use raw response to check status code
    const deleteResult = await jsonPlaceholderService.deletePost(
      existingPostId,
      { schema: null },
    );
    const deleteResponse = deleteResult as APIResponse;
    await responseSteps.verifyStatusCodeIsOneOf(deleteResponse, [200, 204]);

    // Verify post still exists (JSONPlaceholder doesn't actually delete)
    const verifyPost = await postSteps.getPost(existingPostId);
    expect(verifyPost).toBeDefined();
  });
});
