import { test, expect } from "@jsonplaceholder/fixtures/index";
import { RandomDataGenerator } from "@jsonplaceholder/utils/random-data-generator";
import { JsonPlaceholderTestData } from "@jsonplaceholder/constants/json-placeholder.constants";

test.describe("JSONPlaceholder API - PUT Partial Update", () => {
  test("should update only provided fields (title) using PUT", async ({
    postSteps,
    jsonPlaceholderService,
    responseSteps,
  }) => {
    const postId = JsonPlaceholderTestData.POST.EXISTING_POST_ID;
    const newTitle = `Partial PUT Title ${RandomDataGenerator.postTitle()}`;
    const partialPayload = {
      title: newTitle,
    };

    // Use raw response to check status code
    const response = await jsonPlaceholderService.updatePost(
      postId,
      partialPayload,
      null,
    );
    await responseSteps.verifyStatusCode(response, 200);

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
