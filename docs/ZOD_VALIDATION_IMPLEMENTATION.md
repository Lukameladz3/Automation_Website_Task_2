# Zod Validation Implementation for JSONPlaceholder API Tests

## Overview

This document describes how Zod validation was implemented for all JSONPlaceholder API test responses to ensure type safety, runtime validation, and data integrity.

## Table of Contents

1. [What is Zod?](#what-is-zod)
2. [Architecture Overview](#architecture-overview)
3. [Implementation Details](#implementation-details)
4. [Usage Examples](#usage-examples)
5. [Benefits](#benefits)
6. [Testing](#testing)

---

## What is Zod?

Zod is a TypeScript-first schema validation library that provides:
- Runtime type validation
- Type inference for TypeScript
- Detailed error messages
- Zero dependencies

```typescript
import { z } from 'zod';

// Define a schema
const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
});

// Infer TypeScript type from schema
type User = z.infer<typeof UserSchema>;

// Validate data at runtime
const user = UserSchema.parse(apiResponse); // Throws if invalid
```

---

## Architecture Overview

### Directory Structure

```
src/jsonplaceholder/
├── models/
│   └── JsonPlaceholderModels.ts    # Zod schemas defined here
├── steps/
│   └── JsonPlaceholderSteps.ts     # Validation methods implemented here
└── api/
    └── services/
        └── JsonPlaceholderService.ts  # Raw API calls (no validation)

tests/jsonplaceholder/
└── api/
    ├── posts-get.spec.ts           # Tests use validated responses
    ├── posts-create.spec.ts
    ├── post-lifecycle.spec.ts
    └── users.spec.ts
```

### Data Flow

```
API Response → Service → Steps (Zod Validation) → Test
```

---

## Implementation Details

### Step 1: Define Zod Schemas

**File:** `src/jsonplaceholder/models/JsonPlaceholderModels.ts`

#### Post Schemas

```typescript
import { z } from 'zod';

// Basic Post Schema
export const PostSchema = z.object({
    body: z.string(),
    id: z.number(),
    title: z.string(),
    userId: z.number(),
}).strict();  // .strict() rejects unknown fields

export type Post = z.infer<typeof PostSchema>;

// Array of Posts
export const PostArraySchema = z.array(PostSchema);

// Create Post Request Schema
export const CreatePostRequestSchema = z.object({
    body: z.string(),
    title: z.string(),
    userId: z.number(),
}).strict();

export type CreatePostRequest = z.infer<typeof CreatePostRequestSchema>;

// Create Post Response Schema
export const CreatePostResponseSchema = z.object({
    body: z.string(),
    id: z.number(),
    title: z.string(),
    userId: z.number(),
}).strict();

export type CreatePostResponse = z.infer<typeof CreatePostResponseSchema>;
```

#### User Schemas (with nested structures)

```typescript
// Geo Schema (nested in Address)
export const GeoSchema = z.object({
    lat: z.string(),
    lng: z.string(),
}).strict();

export type Geo = z.infer<typeof GeoSchema>;

// Address Schema
export const AddressSchema = z.object({
    city: z.string(),
    geo: GeoSchema,          // Nested schema
    street: z.string(),
    suite: z.string(),
    zipcode: z.string(),
}).strict();

export type Address = z.infer<typeof AddressSchema>;

// Company Schema
export const CompanySchema = z.object({
    bs: z.string(),
    catchPhrase: z.string(),
    name: z.string(),
}).strict();

export type Company = z.infer<typeof CompanySchema>;

// User Schema (with nested Address and Company)
export const UserSchema = z.object({
    address: AddressSchema,  // Nested schema
    company: CompanySchema,  // Nested schema
    email: z.string().email(), // Email validation
    id: z.number(),
    name: z.string(),
    phone: z.string(),
    username: z.string(),
    website: z.string(),
}).strict();

export type User = z.infer<typeof UserSchema>;

// Array of Users
export const UserArraySchema = z.array(UserSchema);
```

### Step 2: Create Validation Methods in Steps

**File:** `src/jsonplaceholder/steps/JsonPlaceholderSteps.ts`

#### Parse Methods with Zod Validation

```typescript
import { expect } from "@playwright/test";
import type { APIResponse } from "@playwright/test";
import {
  PostSchema,
  PostArraySchema,
  CreatePostResponseSchema,
  UserSchema,
  UserArraySchema,
  type Post,
  type CreatePostResponse,
  type User,
} from "@jsonplaceholder/models/JsonPlaceholderModels";
import { step } from "@jsonplaceholder/utils/StepDecorator";

export class JsonPlaceholderSteps {
  constructor(private jsonPlaceholderService: JsonPlaceholderService) {}

  // ==================== Post Parsing with Zod Validation ====================

  @step("Parse post response")
  async parsePost(response: APIResponse): Promise<Post> {
    const body = await response.json();
    return PostSchema.parse(body);  // ✅ Zod validation here
  }

  @step("Parse posts array response")
  async parsePostsArray(response: APIResponse): Promise<Post[]> {
    const body = await response.json();
    return PostArraySchema.parse(body);  // ✅ Zod validation here
  }

  @step("Parse created post response")
  async parseCreatedPost(response: APIResponse): Promise<CreatePostResponse> {
    const body = await response.json();
    return CreatePostResponseSchema.parse(body);  // ✅ Zod validation here
  }

  // ==================== User Parsing with Zod Validation ====================

  @step("Parse user response with Zod validation")
  async parseUser(response: APIResponse): Promise<User> {
    const body = await response.json();
    return UserSchema.parse(body);  // ✅ Zod validation here
  }

  @step("Parse users array response with Zod validation")
  async parseUsersArray(response: APIResponse): Promise<User[]> {
    const body = await response.json();
    return UserArraySchema.parse(body);  // ✅ Zod validation here
  }

  // ==================== API Request Methods ====================

  @step("Send get all posts request")
  async sendGetAllPostsRequest(): Promise<APIResponse> {
    return await this.jsonPlaceholderService.getAllPosts();
  }

  @step("Send get post request")
  async sendGetPostRequest(postId: number): Promise<APIResponse> {
    return await this.jsonPlaceholderService.getPostById(postId);
  }

  @step("Send get all users request")
  async sendGetAllUsersRequest(): Promise<APIResponse> {
    return await this.jsonPlaceholderService.getAllUsers();
  }

  @step("Send get user by ID request")
  async sendGetUserByIdRequest(userId: number): Promise<APIResponse> {
    return await this.jsonPlaceholderService.getUserById(userId);
  }

  // ==================== Verification Methods ====================

  @step("Verify users count")
  async verifyUsersCount(users: User[], expectedCount: number): Promise<void> {
    expect(users.length).toBe(expectedCount);
  }

  @step("Verify user ID")
  async verifyUserId(user: User, expectedId: number): Promise<void> {
    expect(user.id).toBe(expectedId);
  }

  @step("Verify user name")
  async verifyUserName(user: User, expectedName: string): Promise<void> {
    expect(user.name).toBe(expectedName);
  }

  // ... more verification methods
}
```

### Step 3: Use in Tests

**File:** `tests/jsonplaceholder/api/posts-get.spec.ts`

#### Example 1: Get All Posts with Validation

```typescript
import { expect, isolatedTest as test } from "@automationexercise/fixtures/index";
import { JsonPlaceholderTestData } from "@jsonplaceholder/constants/JsonPlaceholderTestData";

test.describe("JSONPlaceholder API - GET Posts", () => {
  test("TC 1.1: Get All Posts - Status 200, verify count", async ({
    jsonPlaceholderSteps,
  }) => {
    // Step 1: Send API request
    const response = await jsonPlaceholderSteps.sendGetAllPostsRequest();

    // Step 2: Verify status code
    await jsonPlaceholderSteps.verifyStatusCode(response, 200);

    // Step 3: Parse and validate response with Zod
    const posts = await jsonPlaceholderSteps.parsePostsArray(response);
    // ✅ At this point, posts are validated against PostArraySchema
    // ✅ TypeScript knows posts is Post[]
    // ✅ If API returns invalid data, Zod will throw detailed error

    // Step 4: Perform business logic assertions
    await jsonPlaceholderSteps.verifyPostsCount(
      posts,
      JsonPlaceholderTestData.GET_POSTS.TOTAL_POSTS_COUNT,
    );
  });
});
```

**File:** `tests/jsonplaceholder/api/users.spec.ts`

#### Example 2: Get User with Nested Validation

```typescript
test.describe("JSONPlaceholder API - GET Users", () => {
  test("TC 4.2: Verify User 5 nested structure", async ({
    jsonPlaceholderSteps,
  }) => {
    const testUserId = 5;
    const userData = JsonPlaceholderTestData.USERS.USER_5;

    // Step 1: Send API request
    const response = await jsonPlaceholderSteps.sendGetUserByIdRequest(testUserId);

    // Step 2: Verify status code
    await jsonPlaceholderSteps.verifyStatusCode(response, 200);

    // Step 3: Parse and validate response with Zod (including nested objects)
    const user = await jsonPlaceholderSteps.parseUser(response);
    // ✅ Validates entire user object
    // ✅ Validates nested address object
    // ✅ Validates nested geo object (inside address)
    // ✅ Validates nested company object
    // ✅ Validates email format

    // Step 4: Verify user data using type-safe properties
    await jsonPlaceholderSteps.verifyUserId(user, userData.ID);
    await jsonPlaceholderSteps.verifyUserName(user, userData.NAME);
    await jsonPlaceholderSteps.verifyUserEmail(user, userData.EMAIL);

    // Step 5: Verify nested structures
    await jsonPlaceholderSteps.verifyUserAddressStreet(user, userData.ADDRESS.STREET);
    await jsonPlaceholderSteps.verifyUserGeoLat(user, userData.ADDRESS.GEO.LAT);
    await jsonPlaceholderSteps.verifyUserCompanyName(user, userData.COMPANY.NAME);
  });
});
```

#### Example 3: Create Post with Validation

```typescript
test.describe("JSONPlaceholder API - POST Create Post", () => {
  test("TC 3.1: Create Post - Verify response", async ({
    jsonPlaceholderSteps,
  }) => {
    const title = "Test Post";
    const body = "Test Body";
    const userId = 1;

    // Step 1: Send create request
    const response = await jsonPlaceholderSteps.sendCreatePostRequest(
      title,
      body,
      userId,
    );

    // Step 2: Verify status code
    await jsonPlaceholderSteps.verifyStatusCode(response, 201);

    // Step 3: Parse and validate created post with Zod
    const post = await jsonPlaceholderSteps.parseCreatedPost(response);
    // ✅ Validates response has correct structure
    // ✅ Validates id is number
    // ✅ Validates title, body, userId are correct types

    // Step 4: Verify response data
    await jsonPlaceholderSteps.verifyPostTitle(post, title);
    await jsonPlaceholderSteps.verifyPostBody(post, body);
    await jsonPlaceholderSteps.verifyPostUserId(post, userId);
    await jsonPlaceholderSteps.verifyCreatedPostId(post);
  });
});
```

---

## Usage Examples

### Before Zod Implementation

```typescript
test("Get user - OLD WAY", async ({ jsonPlaceholderService }) => {
  const response = await jsonPlaceholderService.getUserById(5);
  
  // No validation - just trust the API
  const user = await response.json();
  
  // TypeScript thinks user is 'any'
  expect(user.id).toBe(5);  // No type safety
  expect(user.name).toBe("Chelsey Dietrich");  // Could be undefined!
});
```

### After Zod Implementation

```typescript
test("Get user - NEW WAY", async ({ jsonPlaceholderSteps }) => {
  const response = await jsonPlaceholderSteps.sendGetUserByIdRequest(5);
  
  // ✅ Validated at runtime with Zod
  const user = await jsonPlaceholderSteps.parseUser(response);
  
  // ✅ TypeScript knows exact type: User
  // ✅ If API returns invalid data, test fails with detailed error
  await jsonPlaceholderSteps.verifyUserId(user, 5);
  await jsonPlaceholderSteps.verifyUserName(user, "Chelsey Dietrich");
});
```

---

## Benefits

### 1. **Runtime Type Safety**

```typescript
// If API returns this invalid data:
{
  id: "5",  // ❌ Should be number, not string
  name: "John",
  email: "invalid-email"  // ❌ Not a valid email format
}

// Zod will throw detailed error:
// ZodError: [
//   { path: ["id"], message: "Expected number, received string" },
//   { path: ["email"], message: "Invalid email" }
// ]
```

### 2. **TypeScript Inference**

```typescript
// Type is automatically inferred from schema
const user = await jsonPlaceholderSteps.parseUser(response);

// TypeScript knows:
user.id          // number
user.name        // string
user.email       // string
user.address     // Address
user.address.geo // Geo
```

### 3. **Nested Structure Validation**

```typescript
// Validates entire nested structure in one call
const user = await jsonPlaceholderSteps.parseUser(response);

// ✅ Validates user object
// ✅ Validates user.address object
// ✅ Validates user.address.geo object
// ✅ Validates user.company object
// ✅ Validates email format
```

### 4. **Early Error Detection**

```typescript
// Without Zod: Test fails later with cryptic error
const user = await response.json();
expect(user.address.geo.lat).toBe("-37.3159");  // Undefined error!

// With Zod: Test fails immediately with clear error
const user = await jsonPlaceholderSteps.parseUser(response);
// ZodError: { path: ["address", "geo"], message: "Required" }
```

### 5. **Self-Documenting Code**

```typescript
// Schema serves as documentation
export const UserSchema = z.object({
  id: z.number(),              // id must be number
  name: z.string(),            // name must be string
  email: z.string().email(),   // email must be valid format
  address: AddressSchema,      // address has specific structure
});
```

### 6. **Contract Testing**

Zod schemas act as API contracts:
- If API changes structure, tests fail immediately
- Documents expected API response format
- Catches breaking changes early

---

## Testing

### Run Tests

```bash
# Run all JSONPlaceholder tests
npx playwright test --project=jsonplaceholder-api

# Run specific test file
npx playwright test tests/jsonplaceholder/api/users.spec.ts

# Run single test
npx playwright test --project=jsonplaceholder-api --grep "TC 4.1"
```

### Test Results

```
✅ All 16 JSONPlaceholder API tests passed
✅ All responses validated with Zod
✅ No runtime type errors
✅ Full type safety in TypeScript
```

### Example Test Output

```
Running 16 tests using 4 workers

✓ TC 1.1: Get All Posts - Status 200, JSON content-type, response time < 800ms (78ms)
✓ TC 3.1: Create Post - Status 201, echo check, id=101 (369ms)
✓ TC 4.1: Get All Users - Status 200, exactly 10 users (88ms)
✓ TC 4.2: Deep Data User 5 - Verify nested Address, Geo, Company structure (472ms)
✓ TC 5.2: Relational Check - Verify User 5's posts exist and belong to User 5 (841ms)

16 passed (4.7s)
```

---

## Error Handling

### Example: Invalid Response Structure

```typescript
// API returns invalid data:
{
  id: 5,
  name: "John",
  // ❌ Missing required fields: email, address, company, etc.
}

// Zod throws detailed error:
ZodError: [
  {
    code: "invalid_type",
    expected: "string",
    received: "undefined",
    path: ["email"],
    message: "Required"
  },
  {
    code: "invalid_type",
    expected: "object",
    received: "undefined",
    path: ["address"],
    message: "Required"
  }
]
```

### Example: Invalid Data Type

```typescript
// API returns wrong type:
{
  id: "5",  // ❌ String instead of number
  userId: "10"  // ❌ String instead of number
}

// Zod throws:
ZodError: [
  {
    code: "invalid_type",
    expected: "number",
    received: "string",
    path: ["id"],
    message: "Expected number, received string"
  }
]
```

---

## Best Practices

### 1. Always Use Parse Methods

```typescript
// ❌ BAD: Direct JSON parsing (no validation)
const user = await response.json();

// ✅ GOOD: Parse through Zod validation
const user = await jsonPlaceholderSteps.parseUser(response);
```

### 2. Use `.strict()` for Schemas

```typescript
// ✅ GOOD: Rejects unknown fields
export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
}).strict();

// If API returns: { id: 1, name: "John", extra: "field" }
// Zod will throw error about unknown field "extra"
```

### 3. Create Specific Schemas

```typescript
// ✅ GOOD: Separate schemas for request and response
export const CreatePostRequestSchema = z.object({
  title: z.string(),
  body: z.string(),
  userId: z.number(),
});

export const CreatePostResponseSchema = z.object({
  id: z.number(),      // Response has id
  title: z.string(),
  body: z.string(),
  userId: z.number(),
});
```

### 4. Leverage Type Inference

```typescript
// ✅ GOOD: Infer TypeScript types from Zod schemas
export type User = z.infer<typeof UserSchema>;

// Don't manually define types that duplicate the schema
```

---

## Conclusion

Zod validation provides:
- ✅ Runtime type safety
- ✅ Compile-time type inference
- ✅ Detailed error messages
- ✅ Self-documenting schemas
- ✅ Contract testing
- ✅ Early error detection
- ✅ Nested structure validation

All JSONPlaceholder API responses now flow through Zod validation, ensuring data integrity and type safety throughout the test suite.
