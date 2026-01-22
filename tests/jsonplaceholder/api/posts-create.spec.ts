import { test } from "@jsonplaceholder/fixtures/index";
import {
  buildCreatePostRequest,
  buildEmptyPostRequest,
} from "@jsonplaceholder/models/builders";
import { JsonPlaceholderTestData } from "@jsonplaceholder/constants/json-placeholder.constants";

test.describe("JSONPlaceholder API - POST Create Post", () => {
  test("TC 3.1: Create Post - Status 201, echo check, id=101", async ({
    postSteps,
    jsonPlaceholderService,
    responseSteps,
  }) => {
    const request = buildCreatePostRequest();

    // Use raw method to check status code
    const response = await jsonPlaceholderService.createPostRaw(request);
    await responseSteps.verifyStatusCode(response, 201);

    // Now create with validated method
    const post = await postSteps.createPost(request);
    await postSteps.verifyPost(post, request);
    await postSteps.verifyCreatedPostId(post);
  });

  test("TC 3.2: Empty Payload - Test API strictness", async ({
    postSteps,
    jsonPlaceholderService,
    responseSteps,
  }) => {
    const request = buildEmptyPostRequest();

    // Use raw method to check status code
    const response = await jsonPlaceholderService.createPostRaw(request);
    await responseSteps.verifyStatusCode(response, 201);

    // Use partial validation method
    const post = await postSteps.createPostWithPartialValidation(request);
    await postSteps.verifyCreatedPostId(post);
  });

  test("TC 3.3: Field Echo Check - Extra field (admin: true) echoed back", async ({
    postSteps,
    jsonPlaceholderService,
    responseSteps,
  }) => {
    const extraFields = JsonPlaceholderTestData.POST.SECURITY_TEST_EXTRA_FIELD;
    const request = { ...buildCreatePostRequest(), ...extraFields };

    // Use raw method to check status code
    const response = await jsonPlaceholderService.createPostRaw(request);
    await responseSteps.verifyStatusCode(response, 201);

    // Use passthrough method for validation
    const post = await postSteps.createPostWithPassthrough(request);
    await postSteps.verifyPassthroughField(post, "admin", true);
    await postSteps.verifyPost(post, request);
    await postSteps.verifyCreatedPostId(post);
  });
});
