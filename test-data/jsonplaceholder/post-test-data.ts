/**
 * Test data for JSONPlaceholder Posts API
 */
export const PostTestData = {
  USER_ID: 1,
  EXPECTED_CREATED_POST_ID: 101,
  EXISTING_POST_ID: 1,
  SECURITY_TEST_EXTRA_FIELD: { admin: true },

  GET_POSTS: {
    TOTAL_POSTS_COUNT: 100,
    USER_1_POSTS_COUNT: 10,
    VALID_POST_ID: 99,
    VALID_POST_USER_ID: 10,
    NON_EXISTENT_POST_ID: 150,
    INVALID_POST_ID: "abc",
    MAX_RESPONSE_TIME_MS: 800,
  },
} as const;
