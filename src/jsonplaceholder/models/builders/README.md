# Request Builders

## Purpose

Request builders provide a clean, maintainable way to create request payloads for API tests with smart defaults and easy overrides.

## Benefits

### ❌ Before (Manual Construction)
```typescript
// Repetitive, error-prone
const title = RandomDataGenerator.postTitle();
const body = RandomDataGenerator.postBody();
const userId = RandomDataGenerator.userId();
const post = await postSteps.createPost(title, body, userId);
```

**Problems:**
- 3-4 lines of boilerplate for every test
- Easy to forget a required field
- Hard to see what's being tested
- Difficult to maintain if schema changes

### ✅ After (Builder Pattern)
```typescript
// Clean, intentional
const request = buildCreatePostRequest({ userId: 5 });
const post = await postSteps.createPost(request);
```

**Benefits:**
- 1 line instead of 4
- Clear intent: "I only care about userId: 5"
- Defaults handled automatically
- Schema changes in one place

## Available Builders

### `buildCreatePostRequest()`

Creates a complete `CreatePostRequest` with smart defaults.

```typescript
// All defaults
const request = buildCreatePostRequest();
// { title: "Random Title...", body: "Random Body...", userId: 1 }

// Override specific field
const request = buildCreatePostRequest({ userId: 5 });
// { title: "Random Title...", body: "Random Body...", userId: 5 }

// Override multiple fields
const request = buildCreatePostRequest({ 
  title: "My Title",
  userId: 10
});
// { title: "My Title", body: "Random Body...", userId: 10 }
```

### `buildUpdatePostRequest()`

Creates an `UpdatePostRequest` for updates.

```typescript
// Partial update - only title
const request = buildUpdatePostRequest({ title: "New Title" });

// Full update
const request = buildUpdatePostRequest({ 
  title: "Title",
  body: "Body",
  userId: 5
});
```

### `buildMinimalPostRequest()`

Creates minimal valid data (useful for edge cases).

```typescript
const request = buildMinimalPostRequest();
// { title: "a", body: "a", userId: 1 }
```

### `buildEmptyPostRequest()`

Creates empty payload (useful for testing API strictness).

```typescript
const request = buildEmptyPostRequest();
// {}
```

### `buildLongPostRequest()`

Creates request with very long strings (boundary testing).

```typescript
const request = buildLongPostRequest();        // 10,000 chars
const request = buildLongPostRequest(5000);    // 5,000 chars
```

### `buildSpecialCharPostRequest()`

Creates request with special characters (security testing).

```typescript
const request = buildSpecialCharPostRequest();
// { title: "<script>alert('xss')</script>", body: "'; DROP TABLE...", userId: 1 }
```

## Usage Examples

### Basic CRUD Test

```typescript
test("should create and retrieve post", async ({ postSteps }) => {
  // Create with defaults
  const request = buildCreatePostRequest();
  const created = await postSteps.createPost(request);
  
  // Verify
  await postSteps.verifyPost(created, request);
});
```

### Testing Specific User ID

```typescript
test("should create post for user 5", async ({ postSteps }) => {
  // Only override what matters for this test
  const request = buildCreatePostRequest({ userId: 5 });
  const post = await postSteps.createPost(request);
  
  expect(post.userId).toBe(5);
});
```

### Testing Edge Cases

```typescript
test("should handle minimal data", async ({ postSteps }) => {
  const request = buildMinimalPostRequest();
  const post = await postSteps.createPost(request);
  
  expect(post.title).toBe("a");
});

test("should handle empty payload", async ({ postSteps }) => {
  const request = buildEmptyPostRequest();
  const post = await postSteps.createPostWithPartialValidation(request);
  
  expect(post.id).toBeDefined();
});
```

### Testing Boundary Values

```typescript
test("should handle long content", async ({ postSteps }) => {
  const request = buildLongPostRequest(10000);
  const post = await postSteps.createPost(request);
  
  expect(post.title.length).toBe(10000);
});
```

### Security Testing

```typescript
test("should handle special characters", async ({ postSteps }) => {
  const request = buildSpecialCharPostRequest();
  const post = await postSteps.createPost(request);
  
  expect(post.title).toContain("<script>");
});
```

### Combining with Extra Fields

```typescript
test("should echo extra fields", async ({ postSteps }) => {
  const request = { 
    ...buildCreatePostRequest(), 
    admin: true  // Extra field
  };
  
  const post = await postSteps.createPostWithPassthrough(request);
  expect(post.admin).toBe(true);
});
```

## Best Practices

### ✅ Do

```typescript
// Override only what matters for the test
const request = buildCreatePostRequest({ userId: 5 });

// Use semantic builders for edge cases
const request = buildMinimalPostRequest();

// Combine builders with spread
const request = { ...buildCreatePostRequest(), admin: true };
```

### ❌ Don't

```typescript
// Don't manually create full objects when builder exists
const request = {
  title: RandomDataGenerator.postTitle(),
  body: RandomDataGenerator.postBody(),
  userId: RandomDataGenerator.userId()
};

// Don't override all fields (just create manually)
const request = buildCreatePostRequest({ 
  title: "My Title",
  body: "My Body", 
  userId: 5 
});
// Better: { title: "My Title", body: "My Body", userId: 5 }
```

## Adding New Builders

When adding a new entity (e.g., comments):

1. Create `comment-request.builder.ts`
2. Follow the naming pattern: `build{Operation}{Entity}Request`
3. Provide sensible defaults using `RandomDataGenerator`
4. Export from `index.ts`

```typescript
// comment-request.builder.ts
export function buildCreateCommentRequest(
  overrides: Partial<CreateCommentRequest> = {}
): CreateCommentRequest {
  return {
    postId: overrides.postId ?? RandomDataGenerator.postId(),
    body: overrides.body ?? RandomDataGenerator.commentBody(),
    email: overrides.email ?? RandomDataGenerator.email(),
  };
}
```

## Comparison

### Before: Verbose and Repetitive

```typescript
test("TC1", async ({ postSteps }) => {
  const title = RandomDataGenerator.postTitle();
  const body = RandomDataGenerator.postBody();
  const userId = 5;  // Only this matters
  const post = await postSteps.createPost(title, body, userId);
});

test("TC2", async ({ postSteps }) => {
  const title = RandomDataGenerator.postTitle();
  const body = RandomDataGenerator.postBody();
  const userId = 10;  // Only this matters
  const post = await postSteps.createPost(title, body, userId);
});
```

### After: Clean and Clear

```typescript
test("TC1", async ({ postSteps }) => {
  const request = buildCreatePostRequest({ userId: 5 });
  const post = await postSteps.createPost(request);
});

test("TC2", async ({ postSteps }) => {
  const request = buildCreatePostRequest({ userId: 10 });
  const post = await postSteps.createPost(request);
});
```

**Result:** Reduced from 4 lines to 2 lines per test, with clearer intent!
