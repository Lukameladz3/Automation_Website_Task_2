# Schema Organization

## Structure

Schemas are organized by **entity/resource** rather than HTTP method for better scalability and maintainability.

```
models/schemas/
├── base.schemas.ts      # Common/shared types
├── post.schemas.ts      # All Post-related schemas
├── user.schemas.ts      # All User-related schemas  
├── error.schemas.ts     # Error response schemas
└── index.ts             # Central export point
```

## Files

### `base.schemas.ts`
Common types used across multiple resources:
- `Geo` - Geographic coordinates (lat, lng)
- `Address` - Address with nested Geo
- `Company` - Company information  
- `EmptyResponse` - Empty object response

### `post.schemas.ts`
All Post entity schemas grouped together:

**Base:**
- `Post` - Base post model
- `PostArraySchema` - Array of posts

**GET Operations:**
- `GetPostResponseSchema`
- `GetPostsResponseSchema`
- `GetPostsByUserIdResponseSchema`

**POST (Create) Operations:**
- `CreatePostRequest` / `CreatePostRequestSchema`
- `CreatePostResponse` / `CreatePostResponseSchema`
- `CreatePostResponsePassthrough` - Allows extra fields
- `CreatePostResponsePartial` - Optional fields

**PUT (Update) Operations:**
- `UpdatePostRequest` / `UpdatePostRequestSchema`
- `UpdatePostResponse` / `UpdatePostResponseSchema`
- `UpdatePostResponsePartial` - Partial response

**DELETE Operations:**
- `DeletePostResponse` / `DeletePostResponseSchema`

### `user.schemas.ts`
All User entity schemas:
- `User` / `UserSchema`
- `UserArraySchema`
- `GetUserResponseSchema`
- `GetUsersResponseSchema`

### `error.schemas.ts`
Error and exceptional response schemas:
- `ErrorResponse` - Standard error response
- `NotFoundResponse` - 404 responses

## Benefits of Entity-Based Organization

### ✅ Scales with Growth
```
// Adding comments feature?
models/schemas/
├── comment.schemas.ts  # Just add one file!
```

### ✅ Related Schemas Together
All post-related schemas (create, update, delete, list) in one place.

### ✅ Easy to Find
Looking for user validation? Check `user.schemas.ts`.  
Looking for error handling? Check `error.schemas.ts`.

### ✅ Clear Boundaries
Each file has a clear responsibility based on the entity it represents.

### ✅ Import Simplicity
```typescript
// Everything post-related from one place
import { 
  Post, 
  CreatePostRequest,
  UpdatePostResponse 
} from "./models/schemas/post.schemas";
```

## Previous Structure (❌ Don't Do This)

```
models/schemas/
├── get.schemas.ts      # All GET response schemas
├── post.schemas.ts     # All POST request/response schemas  
├── put.schemas.ts      # All PUT schemas
└── delete.schemas.ts   # All DELETE schemas
```

**Problems:**
- With 20 endpoints, schemas scattered everywhere
- Hard to find which file has what
- No clear entity boundaries
- Doesn't scale

## Usage Examples

```typescript
// Import everything related to posts
import {
  Post,
  CreatePostRequest,
  CreatePostResponse,
  UpdatePostRequest,
} from "@jsonplaceholder/models/schemas/post.schemas";

// Import base types
import { Address, Geo } from "@jsonplaceholder/models/schemas/base.schemas";

// Import users
import { User } from "@jsonplaceholder/models/schemas/user.schemas";

// Import errors
import { ErrorResponse } from "@jsonplaceholder/models/schemas/error.schemas";
```

## Adding New Schemas

### For Existing Entity
Add to the appropriate entity file:

```typescript
// In post.schemas.ts
export const ArchivePostResponseSchema = z.object({...});
```

### For New Entity
Create a new file following the pattern:

```typescript
// comment.schemas.ts
import { z } from "zod";

export const CommentSchema = z.object({
  id: z.number(),
  postId: z.number(),
  body: z.string(),
  email: z.string().email(),
});

export type Comment = z.infer<typeof CommentSchema>;
// ... add all CRUD schemas for comments
```

Then export from `index.ts`:
```typescript
export * from "./comment.schemas";
```

## Best Practices

1. **Group by Entity**: All schemas for an entity in one file
2. **Use Base for Shared Types**: Common types go in `base.schemas.ts`
3. **Document Sections**: Use comments to separate CRUD operations
4. **Consistent Naming**: `{Entity}{Operation}{Request|Response}Schema`
5. **Export Types**: Always export both schema and inferred type
