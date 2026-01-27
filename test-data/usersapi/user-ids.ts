/**
 * Test user IDs for Users API testing
 */
export const UserIdsTestData = {
  VALID: [1, 2, 7, 8],
  INVALID_NUMERIC: [0, -1, 4, 999, 10000],
  INVALID_FORMATS: ["abc", "test", "!@#$", "1.5", "null", "undefined"],

  // Specific test user for consistency checks
  CONSISTENT_TEST_USER: 1,

  EDGE_CASES: {
    VERY_LARGE: 999999999999,
    FLOAT: 1.5,
    NEGATIVE_LARGE: -999999,
  },
} as const;
