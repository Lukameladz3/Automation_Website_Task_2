/**
 * Test data constants for Users API testing
 */
export const UsersApiTestData = {
  VALID_USER_IDS: [1, 2, 7, 8],
  INVALID_USER_IDS: [0, -1, 4, 999, 10000],
  INTERNAL_ERROR_IDS: [3, 5], // These IDs cause internal server errors
  INVALID_ID_FORMATS: ["abc", "test", "!@#$", "1.5", "null", "undefined"],

  // Test user ID for consistency checks
  TEST_USER_ID: 1,

  // Non-existent user ID for 404 testing
  NON_EXISTENT_USER_ID: 999,

  // HTTP Status Codes
  STATUS_CODES: {
    OK: 200,
    NOT_FOUND: 404,
  },

  EXPECTED_RESPONSE_TIME: {
    GET_ALL_USERS: 1000,
    GET_USER_BY_ID: 500,
  },

  ERROR_MESSAGES: {
    USER_NOT_FOUND: "User not found",
    INTERNAL_ERROR: "Internal error",
  },

  CONTENT_TYPES: {
    JSON: "application/json; charset=utf-8",
  },

  // Expected user data for validation
  EXPECTED_USERS: {
    USER_1: {
      id: 1,
      name: "John Doe",
      age: 12,
    },
  },

  // Known issues for bug testing
  KNOWN_ISSUES: {
    DUPLICATE_USER_ID: 5,
    USERS_WITHOUT_AGE: [3, 5],
  },
} as const;
