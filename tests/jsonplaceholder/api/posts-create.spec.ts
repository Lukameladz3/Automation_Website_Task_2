import { test } from "@jsonplaceholder/fixtures/index";
import { RandomDataGenerator } from "@jsonplaceholder/utils/random-data-generator";
import { JsonPlaceholderTestData } from "@jsonplaceholder/constants/json-placeholder.constants";

test.describe("JSONPlaceholder API - POST Create Post", () => {
  test("TC 3.1: Create Post - Status 201, echo check, id=101", async ({
    postSteps,
    jsonPlaceholderService,
    responseSteps,
  }) => {
    const title = RandomDataGenerator.postTitle();
    const body = RandomDataGenerator.postBody();
    const userId = RandomDataGenerator.userId();

    // Use raw method to check status code
    const response = await jsonPlaceholderService.createPostRaw({
      title,
      body,
      userId,
    });
    await responseSteps.verifyStatusCode(response, 201);

    // Now create with validated method
    const post = await postSteps.createPost(title, body, userId);
    await postSteps.verifyPost(post, { title, body, userId });
    await postSteps.verifyCreatedPostId(post);
  });

  test("TC 3.2: Empty Payload - Test API strictness", async ({
    postSteps,
    jsonPlaceholderService,
    responseSteps,
  }) => {
    // Use raw method to check status code
    const response = await jsonPlaceholderService.createPostRaw({});
    await responseSteps.verifyStatusCode(response, 201);

    // Use partial validation method
    const post = await postSteps.createPostWithPartialValidation({});
    await postSteps.verifyCreatedPostId(post);
  });

  test("TC 3.3: Field Echo Check - Extra field (admin: true) echoed back", async ({
    postSteps,
    jsonPlaceholderService,
    responseSteps,
  }) => {
    const title = RandomDataGenerator.postTitle();
    const body = RandomDataGenerator.postBody();
    const userId = RandomDataGenerator.userId();
    const extraFields = JsonPlaceholderTestData.POST.SECURITY_TEST_EXTRA_FIELD;

    const payload = { title, body, userId, ...extraFields };

    // Use raw method to check status code
    const response = await jsonPlaceholderService.createPostRaw(payload);
    await responseSteps.verifyStatusCode(response, 201);

    // Use passthrough method for validation
    const post = await postSteps.createPostWithPassthrough(payload);
    await postSteps.verifyPassthroughField(post, "admin", true);
    await postSteps.verifyPost(post, { title, body, userId });
    await postSteps.verifyCreatedPostId(post);
  });
});
