import { test, expect } from "@jsonplaceholder/fixtures/index";
import { RandomDataGenerator } from "@jsonplaceholder/utils/random-data-generator";
import { JsonPlaceholderTestData } from "@jsonplaceholder/constants/json-placeholder.constants";
import {
  buildCreatePostRequest,
  buildUpdatePostRequest,
  buildLongPostRequest,
  buildSpecialCharPostRequest,
} from "@jsonplaceholder/models/builders";

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

    // CREATE - Use raw response to check status code
    const createResponse = await jsonPlaceholderService.createPost(
      {
        title: newTitle,
        body: newBody,
        userId,
      },
      null,
    );
    await responseSteps.verifyStatusCode(createResponse, 201);

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
    await postSteps.verifyCreatedPostId(createdPost);

    // READ - Use validated method
    const existingPostId = JsonPlaceholderTestData.POST.EXISTING_POST_ID;
    const readPost = await postSteps.getPost(existingPostId);
    await postSteps.verifyPost(readPost, { id: existingPostId });
    await postSteps.verifyPostHasContent(readPost);

    // UPDATE - Use raw response to check status code
    const updateResponse = await jsonPlaceholderService.updatePost(
      existingPostId,
      { title: updatedTitle, body: newBody, userId },
      null,
    );
    await responseSteps.verifyStatusCode(updateResponse, 200);

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
    const deleteResponse = await jsonPlaceholderService.deletePost(
      existingPostId,
      null,
    );
    await responseSteps.verifyStatusCodeIsOneOf(deleteResponse, [200, 204]);

    // Verify post still exists (JSONPlaceholder doesn't actually delete)
    const verifyPost = await postSteps.getPost(existingPostId);
    expect(verifyPost).toBeDefined();
  });
});
