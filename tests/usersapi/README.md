# Users API Test Suite

Comprehensive test coverage for `http://localhost:3100/api/users` endpoints.

## Overview

This test suite provides complete coverage for the Users API endpoints using Playwright Test framework with Zod schema validation. The tests follow best practices and patterns established in the project's JSONPlaceholder test suite.

## Endpoints Covered

- `GET /api/users` - Returns all users
- `GET /api/users/:id` - Returns user by ID

## Test Statistics

- **Total Tests**: 12
- **Test Files**: 2
- **Passing Tests**: 11
- **Failing Tests**: 1 (intentional - documenting duplicate ID bug)

## Project Structure

```
src/usersapi/
├── api/
│   ├── api-client.ts              # Base API client with HTTP methods
│   └── services/
│       └── users-api.service.ts   # Users API service with flexible schema validation
├── constants/
│   ├── routes.ts                  # API route constants
│   └── test-data.ts               # Test data and expected values
├── fixtures/
│   └── index.ts                   # Playwright test fixtures for DI
├── models/
│   └── schemas/
│       ├── base.schemas.ts        # Base error response schemas
│       ├── user.schemas.ts        # User validation schemas
│       └── index.ts
├── steps/
│   ├── users.steps.ts             # User-related test steps
│   ├── response.steps.ts          # Response validation steps
│   └── index.ts
└── utils/
    ├── api-matchers.ts            # Custom Playwright matchers
    ├── step-decorator.ts          # Step decorator for reporting
    └── index.ts

tests/usersapi/api/
├── get-all-users.spec.ts          # Tests for GET /api/users
└── get-user-by-id.spec.ts         # Tests for GET /api/users/:id
```

## Features

### Zod Schema Validation
- **Strict schemas**: Enforce all required fields
- **Lenient schemas**: Allow optional fields and additional properties
- **Unique validation**: Detect duplicate IDs in lists
- **Flexible validation**: Support both validated and raw responses

### Test Organization
- **Step pattern**: Business logic separated from test assertions
- **Fixtures**: Dependency injection for services and step classes
- **Custom matchers**: Enhanced assertion capabilities
- **Decorator pattern**: Structured test reporting with `@step`

### Test Coverage

#### GET /api/users Tests (5 tests)
1. **should return all users with valid schema** - Validates response structure, status code, content-type, and response time
2. **should have valid data types for all fields** - Ensures all user properties have correct types
3. **FAIL: all user IDs should be unique @bug** - Identifies duplicate user IDs (FAILING)
4. **FAIL: should validate unique IDs with Zod schema @bug** - Tests Zod schema validation for uniqueness
5. **should identify users without age field** - Documents users missing the age field

#### GET /api/users/:id Tests (7 tests)
1. **Valid User IDs** (2 tests)
   - Returns correct user data for ID 1
   - Validates all valid user IDs with proper response codes and timing

2. **Invalid User IDs** (3 tests)
   - Returns 404 for non-existent users
   - Handles invalid user IDs with proper error messages
   - Handles invalid ID formats (strings, special characters)

3. **Bug Detection** (1 test)
   - FAIL: Internal errors for user IDs 3 and 5 (FAILING - documents bug)

4. **Data Consistency** (1 test)
   - Ensures same user data across multiple requests

## Bugs Discovered

The test suite successfully identifies the following API bugs:

### 1. Duplicate User IDs
- **Issue**: User with `id=5` appears twice in the users list
- **Expected**: All user IDs should be unique (7 unique IDs)
- **Actual**: 8 total users but only 7 unique IDs
- **Test**: `FAIL: all user IDs should be unique @bug`
- **Location**: `tests/usersapi/api/get-all-users.spec.ts:159`
- **Error Message**: "Expected all user IDs to be unique, but found 1 duplicate ID(s): 5. Total users: 8, Unique IDs: 7"

### 2. Internal Server Errors
- **Issue**: User IDs 3 and 5 return "Internal error" instead of valid user data
- **Test**: `FAIL: should not return internal errors for user IDs 3 and 5 @bug`
- **Location**: `tests/usersapi/api/get-user-by-id.spec.ts:51`

### 3. Inconsistent Age Field
- **Issue**: Some users don't have the `age` field (IDs: 3, 5)
- **Test**: `should identify users without age field`
- **Location**: `tests/usersapi/api/get-all-users.spec.ts:81`

## Running Tests

### Run all Users API tests
```bash
npx playwright test --project=usersapi
```

### Run specific test file
```bash
npx playwright test tests/usersapi/api/get-all-users.spec.ts --project=usersapi
npx playwright test tests/usersapi/api/get-user-by-id.spec.ts --project=usersapi
```

### Run with UI mode
```bash
npx playwright test --project=usersapi --ui
```

### Run with headed browser
```bash
npx playwright test --project=usersapi --headed
```

### View test report
```bash
npx playwright show-report
```

## Best Practices Implemented

1. **Schema-First Validation**: Uses Zod for runtime type safety
2. **Clear Test Names**: Descriptive test names that explain what is being tested
3. **Proper Error Messages**: Custom error messages for better debugging
4. **Step Pattern**: Business logic encapsulated in step classes
5. **Fixture Pattern**: Dependency injection for better test organization
6. **Bug Documentation**: Failing tests clearly marked with `@bug` tag and explanations
7. **Performance Testing**: Validates response times and concurrent request handling
8. **Edge Case Coverage**: Comprehensive testing of boundary conditions
9. **Data Consistency**: Validates API consistency across multiple requests

## Configuration

The test project is configured in `playwright.config.ts`:

```typescript
{
  name: "usersapi",
  testMatch: /.*\/usersapi\/api\/.*\.spec\.ts/,
  use: {
    baseURL: process.env.USERS_API_BASE_URL || "http://localhost:3100",
  },
}
```

### Environment Variables

- `USERS_API_BASE_URL`: Override the default API base URL (default: `http://localhost:3100`)

## TypeScript Configuration

Path aliases are configured in `tsconfig.json` for clean imports:

```typescript
{
  "@usersapi/api/*": ["src/usersapi/api/*"],
  "@usersapi/constants/*": ["src/usersapi/constants/*"],
  "@usersapi/fixtures/*": ["src/usersapi/fixtures/*"],
  "@usersapi/models/*": ["src/usersapi/models/*"],
  "@usersapi/steps/*": ["src/usersapi/steps/*"],
  "@usersapi/utils/*": ["src/usersapi/utils/*"]
}
```

## Example Test

```typescript
test("should return all users with valid schema", async ({
  usersSteps,
  responseSteps,
}) => {
  const { response, responseTime } = await responseSteps.measureResponseTime(
    () => usersSteps.getAllUsersRaw(),
  );

  await responseSteps.verifyStatusCode(response, 200);
  await responseSteps.verifyJsonContentType(response);
  await responseSteps.verifyResponseTime(
    responseTime,
    UsersApiTestData.EXPECTED_RESPONSE_TIME.GET_ALL_USERS,
  );

  const users = await usersSteps.getAllUsersAndValidate();
  expect(users).toBeDefined();
  expect(Array.isArray(users)).toBe(true);
  expect(users.length).toBeGreaterThan(0);
});
```

## Contributing

When adding new tests:
1. Follow the existing patterns and structure
2. Use the step classes for business logic
3. Add appropriate Zod schemas for validation
4. Include clear test descriptions
5. Mark known failing tests with `@bug` tag
6. Add console.log statements to document bugs
