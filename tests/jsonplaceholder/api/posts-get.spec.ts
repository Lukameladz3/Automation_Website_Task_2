import { test, expect } from "@jsonplaceholder/fixtures/index";
import { JsonPlaceholderTestData } from "@jsonplaceholder/constants/json-placeholder.constants";

test.describe("JSONPlaceholder API - GET Posts", () => {
  test("TC 1.1: Get All Posts - Status 200, JSON content-type, response time < 800ms", async ({
    jsonPlaceholderService,
    responseSteps,
  }) => {
    const startTime = performance.now();
    const response = await jsonPlaceholderService.getAllPosts(null);
    const responseTime = performance.now() - startTime;

    await responseSteps.verifyStatusCode(response, 200);
    await responseSteps.verifyJsonContentType(response);
    await responseSteps.verifyResponseTime(responseTime);

    // Verify the response body
    const posts = await response.json();
    expect(posts.length).toBe(
      JsonPlaceholderTestData.GET_POSTS.TOTAL_POSTS_COUNT,
    );
  });

  test("TC 1.2: Sort Order - Verify ascending ID order", async ({
    postSteps,
  }) => {
    // const all_post=``
    // Service returns validated data directly
    const posts = await postSteps.getAllPosts();
    await postSteps.verifyPostsSortedById(posts);
  });

  test("TC 1.3: Data Types - Zod schema validates id, userId are numbers; title, body are strings", async ({
    postSteps,
  }) => {
    // Service returns validated data directly - Zod ensures correct types
    const posts = await postSteps.getAllPosts();
    expect(posts.length).toBeGreaterThan(0);
  });

  test("TC 1.4: Filter Check - GET /posts?userId=1 returns 10 items with userId=1", async ({
    postSteps,
  }) => {
    const userId = JsonPlaceholderTestData.POST.USER_ID;

    // Service returns validated data directly
    const posts = await postSteps.getPostsByUserId(userId);

    await postSteps.verifyPostsCount(
      posts,
      JsonPlaceholderTestData.GET_POSTS.USER_1_POSTS_COUNT,
    );
    await postSteps.verifyAllPostsBelongToUser(posts, userId);
  });

  test("TC 2.1: Get Post 99 - Verify userId=10, id=99, non-empty title/body", async ({
    postSteps,
  }) => {
    const postId = JsonPlaceholderTestData.GET_POSTS.VALID_POST_ID;

    // Service returns validated data directly
    const post = await postSteps.getPost(postId);

    await postSteps.verifyPost(post, {
      id: postId,
      userId: JsonPlaceholderTestData.GET_POSTS.VALID_POST_USER_ID,
    });
    await postSteps.verifyPostHasContent(post);
  });

  test("TC 2.2: Negative - Not Found - GET /posts/150 returns 404 with empty object", async ({
    postSteps,
    jsonPlaceholderService,
    responseSteps,
  }) => {
    const postId = JsonPlaceholderTestData.GET_POSTS.NON_EXISTENT_POST_ID;

    // Use raw response for error testing
    const response = await jsonPlaceholderService.getPostById(postId, null);
    await responseSteps.verifyStatusCode(response, 404);
    await responseSteps.verifyEmptyBody(response);
  });

  test("TC 2.3: Negative - Invalid ID - GET /posts/abc returns 404 or 400", async ({
    postSteps,
    jsonPlaceholderService,
    responseSteps,
  }) => {
    // Use raw response for error testing
    const response = await jsonPlaceholderService.getPostByStringId(
      JsonPlaceholderTestData.GET_POSTS.INVALID_POST_ID,
    );
    await responseSteps.verifyStatusCodeIsOneOf(response, [400, 404]);
  });
});
