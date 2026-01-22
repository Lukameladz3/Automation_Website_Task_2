# Code Review: JSONPlaceholder API Test Project

**Scope**: `src/jsonplaceholder/` + `tests/jsonplaceholder/`  
**Review Date**: 2026-01-20  
**Reviewer**: Claude Code

---

## 🔴 Blockers

### 1. Cross-project fixture coupling is a critical architectural flaw

| File:Line | Issue |
|-----------|-------|
| `tests/jsonplaceholder/api/*.spec.ts:1-4` | All test files import from `@automationexercise/fixtures/index` |
| `src/automationexercise/fixtures/api.fixture.ts:5` | JsonPlaceholderService imported into automationexercise fixtures |
| `src/automationexercise/fixtures/steps.fixture.ts:7` | JsonPlaceholderSteps imported into automationexercise fixtures |

**Why this is critical:**
- JSONPlaceholder is a **separate API project** but is coupled to `automationexercise` (a web testing project)
- Running JSONPlaceholder tests requires loading web page fixtures, auth fixtures, cart steps, etc.
- Circular dependency waiting to happen
- Can't run JSONPlaceholder tests independently without the other project

**Fix:** Create `src/jsonplaceholder/fixtures/` with its own `api.fixture.ts`:

```typescript
// src/jsonplaceholder/fixtures/index.ts
import { test as base } from "@playwright/test";
import { JsonPlaceholderService } from "../api/services/JsonPlaceholderService";
import { JsonPlaceholderSteps } from "../steps/JsonPlaceholderSteps";

type JsonPlaceholderFixtures = {
  jsonPlaceholderService: JsonPlaceholderService;
  jsonPlaceholderSteps: JsonPlaceholderSteps;
};

export const test = base.extend<JsonPlaceholderFixtures>({
  jsonPlaceholderService: async ({ request }, use) => {
    await use(new JsonPlaceholderService(request));
  },
  jsonPlaceholderSteps: async ({ jsonPlaceholderService }, use) => {
    await use(new JsonPlaceholderSteps(jsonPlaceholderService));
  },
});

export { expect } from "@playwright/test";
```

---

## ⚠️ Issues

| File:Line | Issue | Suggestion |
|-----------|-------|------------|
| `JsonPlaceholderSteps.ts:1-400` | **Massive god class** - 400+ lines, 50+ methods, violates SRP | Split into domain-specific step classes: `PostSteps`, `UserSteps`, `ResponseSteps` |
| `JsonPlaceholderSteps.ts:187-210` | **Redundant verification methods** - `verifyPostTitle`, `verifyPostBody`, `verifyPostUserId` are just wrappers around `expect().toBe()` | These add no value; use `expect()` directly in tests |
| `JsonPlaceholderSteps.ts:260-340` | **20 nearly identical user verification methods** | Create `verifyUserField(user, path, expected)` or use object comparison |
| `RandomDataGenerator.ts` | **Over-engineered for API tests** - includes `creditCardNumber()`, `creditCardCVV()`, `orderComment()`, web-specific methods | Either move to shared utils or create API-specific slim version |
| `posts-get.spec.ts:12-13` | **Manual response time calculation** - `Date.now()` before/after is inaccurate | Use Playwright's built-in timing or response headers |
| `post-lifecycle.spec.ts:41-46` | **Commented-out code** - `// await jsonPlaceholderSteps.verifyPostTitle(...)` | Remove dead code or explain why it's there |
| `post-lifecycle.spec.ts:28-58` | **Test logic is confusing** - creates a post but then reads a DIFFERENT post (id=1), updates id=1, not the created one | Either test the created post lifecycle OR test existing post - not both mixed |
| `JsonPlaceholderService.ts:12` | **Hardcoded baseUrl in service** - `private readonly baseUrl = Routes.BASE_URL` | Inject via constructor for environment flexibility |
| `Routes.ts` | **Constants without environment support** | Should use `process.env.BASE_URL \|\| 'https://...'` |
| `posts-get.spec.ts:67-72` | **Type coercion smell** - `as unknown as number` | Create separate method `getPostByStringId(id: string)` for negative testing |
| `ApiMatchers.ts:16-24` | **Overly complex type handling** - `StatusLike = APIResponse \| number` | Just accept `APIResponse` - when would you pass raw number? |
| `JsonPlaceholderTestData.ts:3-4` | **Test data constants smell** - `ORIGINAL_TITLE`, `ORIGINAL_BODY` are never used | Remove unused constants |

---

## 👀 For Your Review

Design decisions that may be intentional - verify they fit your context:

- **`@step()` on every single method** at `JsonPlaceholderSteps.ts` - Is this intentional? Creates verbose test reports. Consider grouping into higher-level steps.

- **Zod `.strict()` on all schemas** at `JsonPlaceholderModels.ts` - Good for production APIs but may cause false failures if JSONPlaceholder adds fields. Consider using non-strict for read operations.

- **`expect.soft()` usage** at `post-lifecycle.spec.ts:43-46` - Inconsistent with the rest of the codebase. Why soft here but not elsewhere?

- **Passthrough schema for security testing** at `JsonPlaceholderModels.ts:37-47` - Clever approach, but the test name says "Security Check" when it's really just "Field Echo Check". JSONPlaceholder is a mock API - there's no real security concern.

---

## 💡 Discussion Points

### 1. Step class vs direct assertions

Current approach creates dozens of thin wrapper methods:

```typescript
@step("Verify post title")
async verifyPostTitle(post, expected) {
  expect(post.title).toBe(expected);
}
```

| Option | Pros | Cons |
|--------|------|------|
| **A: Keep wrappers** | Allure/report readability | Bloated step class, maintenance overhead |
| **B: Delete wrappers, use `expect()` directly** | Tests 50% shorter, less indirection | Less readable reports |

**Recommendation**: Keep only high-level composite steps, remove single-assertion wrappers.

### 2. Folder structure naming

| Current | Guidelines Say |
|---------|----------------|
| `src/jsonplaceholder/api/services/` (lowercase) | Fine |
| `JsonPlaceholderService.ts` (PascalCase) | Should be `json-placeholder.service.ts` (kebab-case) |

### 3. Test data types location

Current: Types in `JsonPlaceholderModels.ts`, constants in `JsonPlaceholderTestData.ts` - separate files.

Your guideline says: "Derived types stay with constants."

The `JsonPlaceholderTestData` uses `as const` but doesn't derive types from it. Consider:

```typescript
export type TestUserId = typeof JsonPlaceholderTestData.USERS.TEST_USER_ID;
```

---

## 📝 Specific Code Smells

### 1. The lifecycle test doesn't test a lifecycle

`post-lifecycle.spec.ts` claims to test Create → Read → Update → Delete but:

| Step | What it claims | What it actually does |
|------|----------------|----------------------|
| Create | Creates a post | Creates post ID 101 (fake, not persisted) |
| Read | Reads created post | Reads post ID 1 (completely different post!) |
| Update | Updates created post | Updates post ID 1 |
| Delete | Deletes created post | Deletes post ID 1 |
| Final | Verifies deletion | Shows delete didn't work (expected for mock API) |

This isn't a lifecycle test - it's a hodgepodge. Either:
- Accept JSONPlaceholder limitations and test only what's possible
- OR rename to "CRUD Operations Demo" not "Lifecycle"

### 2. Redundant Zod validation + manual type checks

```typescript
// In test:
const posts = await jsonPlaceholderSteps.parsePostsArray(response); // Zod validates types
await jsonPlaceholderSteps.verifyPostDataTypes(posts[0]); // Manual type check AGAIN
```

If Zod parsing succeeds, the types are already validated. `verifyPostDataTypes` is redundant.

### 3. Response time testing is flaky

```typescript
const startTime = Date.now();
const response = await jsonPlaceholderSteps.sendGetAllPostsRequest();
const responseTime = Date.now() - startTime;
```

This measures total JS execution time, not actual network latency. Use:

```typescript
const response = await request.get(url);
// Access timing from response or use performance.now() for better precision
```

---

## 📂 File Naming Violations

Per your guidelines (kebab-case, suffix indicates purpose):

| Current | Should Be |
|---------|-----------|
| `ApiClient.ts` | `api-client.ts` (no suffix - utility) |
| `JsonPlaceholderService.ts` | `json-placeholder.service.ts` |
| `JsonPlaceholderModels.ts` | `json-placeholder.types.ts` |
| `JsonPlaceholderTestData.ts` | `json-placeholder.constants.ts` |
| `JsonPlaceholderSteps.ts` | `json-placeholder.steps.ts` |
| `ApiMatchers.ts` | `api-matchers.ts` |
| `RandomDataGenerator.ts` | `random-data-generator.ts` |
| `StepDecorator.ts` | `step-decorator.ts` |
| `Routes.ts` | `routes.ts` |

---

## 🕳️ Missing Test Coverage

### Negative scenarios not covered

- [ ] Network timeout handling
- [ ] Malformed JSON response handling
- [ ] Rate limiting behavior
- [ ] Large payload handling
- [ ] Concurrent request behavior

### Edge cases not covered

- [ ] Empty array response (`/posts?userId=999`)
- [ ] Boundary values (`userId=0`, `userId=-1`, very long title/body)
- [ ] Unicode/special characters in post content

---

## ✅ What's Good

- Zod schema validation approach
- Separation of service/steps layers
- Custom matchers concept
- `as const` for type-safe constants
- Test organization by feature

---

## Verdict: Changes Requested

The core architecture is sound but:

1. **Cross-project coupling is a blocking issue** - JSONPlaceholder tests should be independent
2. **Step class is over-engineered** - Too many single-assertion wrappers
3. **File naming doesn't follow your own guidelines** - PascalCase vs kebab-case
4. **Lifecycle test is misleading** - Doesn't actually test what it claims

---

*Generated with [Claude Code](https://claude.ai/code)*
