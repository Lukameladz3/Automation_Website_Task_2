/**
 * API route constants
 */
export const UsersApiRoutes = {
  BASE_URL: process.env.USERS_API_BASE_URL || "http://localhost:3100",
  USERS: "/api/users",
  USER_BY_ID: (id: number | string) => `/api/users/${id}`,
} as const;
