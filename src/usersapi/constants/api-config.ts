/**
 * Users API configuration constants
 */
export const UsersApiConfig = {
  RESPONSE_TIME_THRESHOLDS: {
    GET_ALL_USERS: 1000,
    GET_USER_BY_ID: 500,
  },

  CONTENT_TYPES: {
    JSON: "application/json; charset=utf-8",
  },

  ERROR_MESSAGES: {
    USER_NOT_FOUND: "User not found",
    INTERNAL_ERROR: "Internal error",
  },
} as const;
