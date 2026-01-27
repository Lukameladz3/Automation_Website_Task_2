/**
 * Negative test data for JSONPlaceholder API
 */
export const NegativeTestData = {
  TITLE_LENGTHS: {
    EXTREMELY_LONG: 1000,
    VERY_LONG: 2000,
  },

  BODY_LENGTHS: {
    EXTREMELY_LONG: 5000,
    MINIMUM_EXPECTED: 4000,
  },

  USER_IDS: {
    NEGATIVE: -1,
    ZERO: 0,
    NON_EXISTENT: 999,
    MAX_32_BIT_INTEGER: 2147483647,
  },

  POST_IDS: {
    NEGATIVE: -1,
    ZERO: 0,
    NON_EXISTENT_MEDIUM: 9999,
    NON_EXISTENT_LARGE: 999999999,
  },

  SPECIAL_STRINGS: {
    EMPTY: "",
    WHITESPACE_ONLY: "     ",
    XSS_ATTEMPT: "Test <script>alert('XSS')</script> & special © ™",
    SQL_INJECTION: "'; DROP TABLE posts; --",
    UNICODE: "Test 你好 мир 🚀 emoji",
    WITH_NEWLINES_TABS: "Line 1\nLine 2\tTabbed",
  },

  REPEAT_STRINGS: {
    TITLE_CHAR: "A",
    BODY_TEXT: "Lorem ipsum ",
    BODY_REPEAT_COUNT: 500,
    TITLE_UPDATE_CHAR: "B",
  },
} as const;
