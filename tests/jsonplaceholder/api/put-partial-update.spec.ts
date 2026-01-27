import { test, expect } from "@jsonplaceholder/fixtures/index";
import { type APIResponse } from "@playwright/test";
import { RandomDataGenerator } from "@jsonplaceholder/utils/random-data-generator";
import { PostTestData } from "@test-data/jsonplaceholder";

test.describe("JSONPlaceholder API - PUT Partial Update", () => {
  test("should update only provided fields (title) using PUT", async ({
    postSteps,
    jsonPlaceholderService,
  }) => {
    const postId = PostTestData.EXISTING_POST_ID;
    const newTitle = `Partial PUT Title ${RandomDataGenerator.postTitle()}`;
    const partialPayload = {
      title: newTitle,
    };

    // Use raw response to check status code
    const result = await jsonPlaceholderService.updatePost(
      postId,
      partialPayload,
      { schema: null },
    );
    const response = result as APIResponse;
    expect(response.status()).toBe(200);

    // Use validated method
    const validated = await postSteps.updatePost(
      postId,
      newTitle,
      "", // Empty body for partial update
      0, // userId 0 for partial update
    );

    expect(validated.id).toBe(postId);
    expect(validated.title).toBe(newTitle);
  });
});
