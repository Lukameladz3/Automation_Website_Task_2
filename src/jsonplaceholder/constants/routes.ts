export const Routes = {
  BASE_URL:
    process.env.JSONPLACEHOLDER_BASE_URL ||
    "https://jsonplaceholder.typicode.com",
  POSTS: "/posts",
  USERS: "/users",
} as const;
