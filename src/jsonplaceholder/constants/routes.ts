export const Routes = { // Paths or endpoints
  BASE_URL:
    process.env.JSONPLACEHOLDER_BASE_URL ||
    "https://jsonplaceholder.typicode.com",
  POSTS: "/posts",
  USERS: "/users",
} as const;
