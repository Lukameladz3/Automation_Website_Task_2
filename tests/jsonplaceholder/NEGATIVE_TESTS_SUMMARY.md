# JSONPlaceholder API - Negative Tests Summary

## Overview
This document describes the essential negative test scenarios implemented for the JSONPlaceholder API to validate error handling, boundary conditions, and edge cases.

## Test File
`tests/jsonplaceholder/api/posts-negative.spec.ts`

## Test Coverage (11 Consolidated Tests)

The negative tests have been carefully consolidated to focus on the most critical edge cases and security scenarios, eliminating redundancy while maintaining comprehensive coverage.

### 1. POST Create - Negative Scenarios (4 consolidated tests)

#### Test 1: Extremely Long Title and Body
- Validates API accepts extremely long strings (1000+ chars for title, 5000+ for body)
- Tests boundary conditions for string length limits
- **Verifies**: No length validation enforced by API

#### Test 2: Invalid UserIds (Negative, Zero, Non-Existent)
- Single test covering multiple invalid userId scenarios
- Tests negative (-1), zero (0), and non-existent (999) userIds
- **Verifies**: API accepts any userId without validation

#### Test 3: Empty Strings
- Tests empty title and empty body in a single consolidated test
- **Verifies**: API accepts empty strings without validation

#### Test 4: Special Characters and Security Payloads
- Consolidated test for XSS attempts, SQL injection, and Unicode
- Tests: `<script>alert('XSS')</script>`, `'; DROP TABLE posts; --`, Unicode characters
- **Verifies**: API treats all input as plain text (no sanitization)

### 2. PUT Update - Negative Scenarios (2 consolidated tests)

#### Test 5: Updating with Invalid Post IDs
- Consolidated test for non-existent and negative IDs
- Tests ID 9999 (non-existent) and -1 (negative)
- **Verifies**: Both return 500 error

#### Test 6: Partial Update with Empty Payload
- Tests updating with completely empty payload `{}`
- **Verifies**: API accepts empty payload with 200 status

### 3. DELETE - Negative Scenarios (1 consolidated test)

#### Test 7: Deleting Non-Existent and Already Deleted Posts
- Tests deleting same non-existent post twice
- **Verifies**: Idempotency - both operations return 200/204

### 4. GET - Negative Scenarios (2 consolidated tests)

#### Test 8: Getting Posts with Invalid IDs
- Consolidated test for large ID (999999999), zero ID (0), and string ID ("abc")
- **Verifies**: All return 404 with empty body or error codes

#### Test 9: Getting Posts with Invalid Query Parameter
- Tests `?userId=abc` (non-numeric)
- **Verifies**: Returns empty array with 200 status

### 5. Content-Type and Headers - Negative Scenarios (1 consolidated test)

#### Test 10: POST with Missing or Wrong Content-Type
- Tests POST without Content-Type header and with wrong Content-Type
- **Verifies**: API is lenient and accepts both with 201 status

### 6. Boundary Value Testing (1 consolidated test)

#### Test 11: Boundary Values and Special Whitespace
- Consolidated test for max 32-bit integer userId, whitespace-only strings, and newlines/tabs
- Tests: userId=2147483647, title="     ", title with \n and \t
- **Verifies**: API accepts all boundary values without validation

## Key Findings

### API Behavior Characteristics

1. **Lenient Validation**: JSONPlaceholder API is very permissive and accepts most invalid data
2. **No Referential Integrity**: Accepts non-existent user IDs without validation
3. **Idempotent Deletes**: DELETE operations succeed even for non-existent resources
4. **ID Assignment**: Ignores client-provided IDs and assigns its own (always 101 for new posts)
5. **Error Responses**:
   - 500: Negative IDs and very large non-existent IDs
   - 404: Moderately large non-existent IDs, zero IDs, invalid string IDs
   - 200/201: Most other invalid scenarios

### Security Observations

1. **No Input Sanitization**: XSS and SQL injection attempts are stored as-is
2. **No Length Validation**: Accepts extremely long strings without limits
3. **Flexible Content-Type**: Doesn't enforce strict Content-Type headers
4. **Echo Extra Fields**: Unknown fields are echoed back in POST responses

## Zod Validation Coverage

All negative tests that expect successful responses (201, 200) use Zod schemas for response validation:
- `CreatePostResponseSchema` - For valid POST responses
- `UpdatePostResponseSchema` / `UpdatePostResponsePartialSchema` - For PUT responses
- Validation ensures type safety even when API accepts invalid input

## Consolidation Benefits

1. **Reduced Test Execution Time** - 11 tests instead of 27 (59% reduction)
2. **Easier Maintenance** - Fewer tests to update when API changes
3. **Better Coverage** - Each test validates multiple related scenarios
4. **Less Redundancy** - Eliminated duplicate coverage areas
5. **Clearer Intent** - Each test has a focused purpose

## Usage

Run all negative tests:
```bash
npx playwright test tests/jsonplaceholder/api/posts-negative.spec.ts
```

Run specific test categories:
```bash
# POST negative tests only (4 tests)
npx playwright test tests/jsonplaceholder/api/posts-negative.spec.ts -g "POST Create"

# PUT negative tests only (2 tests)
npx playwright test tests/jsonplaceholder/api/posts-negative.spec.ts -g "PUT Update"

# GET negative tests only (2 tests)
npx playwright test tests/jsonplaceholder/api/posts-negative.spec.ts -g "GET"

# Boundary value tests only (1 test)
npx playwright test tests/jsonplaceholder/api/posts-negative.spec.ts -g "Boundary Value"
```

## Future Enhancements

Potential additional negative test scenarios:
- Rate limiting tests (if API enforces limits)
- Concurrent modification tests
- Very large payload tests (MB size)
- Invalid JSON syntax tests
- CORS and authentication edge cases
- Network timeout simulation
