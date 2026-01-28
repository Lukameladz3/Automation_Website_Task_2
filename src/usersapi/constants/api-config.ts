/**
 * Users API configuration constants
 */
export const UsersApiConfig = {
  STATUS_CODES: {
    OK: 200,
    NOT_FOUND: 404,
    BAD_REQUEST: 400,
    INTERNAL_SERVER_ERROR: 500,
  },

  RESPONSE_TIME_THRESHOLDS: {
    GET_ALL_USERS: 1000,
    GET_USER_BY_ID: 500,
  },

  CONTENT_TYPES: {
    JSON: "application/json; charset=utf-8",
    JSON_BASE: "application/json",
  },

  ERROR_MESSAGES: {
    USER_NOT_FOUND: "User not found",
    INTERNAL_ERROR: "Internal error",
  },
} as const;
