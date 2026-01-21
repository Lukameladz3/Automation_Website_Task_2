# Sort Utils Guide

## Overview
The `SortUtils` class provides reusable sorting and sort validation utilities for test data validation.

## Location
`src/jsonplaceholder/utils/sort.utils.ts`

## Features

### 1. Basic Sorting Functions

#### Sort Numbers
```typescript
// Ascending order
const sorted = SortUtils.sortNumbersAsc([5, 2, 8, 1]);
// [1, 2, 5, 8]

// Descending order
const sorted = SortUtils.sortNumbersDesc([5, 2, 8, 1]);
// [8, 5, 2, 1]
```

#### Sort Strings
```typescript
// Case-sensitive ascending
const sorted = SortUtils.sortStringsAsc(['banana', 'apple', 'cherry']);
// ['apple', 'banana', 'cherry']

// Case-insensitive
const sorted = SortUtils.sortStringsCaseInsensitive(['Banana', 'apple', 'Cherry']);
// ['apple', 'Banana', 'Cherry']
```

### 2. Object Array Sorting

#### Sort by Numeric Property
```typescript
interface Post {
  id: number;
  title: string;
}

const posts = [
  { id: 3, title: 'Post 3' },
  { id: 1, title: 'Post 1' },
  { id: 2, title: 'Post 2' }
];

// Ascending by ID
const sorted = SortUtils.sortByNumberProperty(posts, 'id', 'asc');
// [{ id: 1, ... }, { id: 2, ... }, { id: 3, ... }]

// Descending by ID
const sorted = SortUtils.sortByNumberProperty(posts, 'id', 'desc');
// [{ id: 3, ... }, { id: 2, ... }, { id: 1, ... }]
```

#### Sort by String Property
```typescript
const users = [
  { name: 'Charlie', age: 30 },
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 35 }
];

const sorted = SortUtils.sortByStringProperty(users, 'name', 'asc');
// [{ name: 'Alice', ... }, { name: 'Bob', ... }, { name: 'Charlie', ... }]
```

### 3. Sort Validation

#### Check if Numbers are Sorted
```typescript
// Check ascending
const isAsc = SortUtils.isNumbersSortedAsc([1, 2, 3, 4]);
// true

// Check descending
const isDesc = SortUtils.isNumbersSortedDesc([4, 3, 2, 1]);
// true
```

#### Check if Array is Sorted by Property
```typescript
const posts = [
  { id: 1, title: 'A' },
  { id: 2, title: 'B' },
  { id: 3, title: 'C' }
];

const isSorted = SortUtils.isSortedByNumberProperty(posts, 'id', 'asc');
// true
```

### 4. Utility Functions

#### Extract Property Values
```typescript
const posts = [
  { id: 1, title: 'Post 1' },
  { id: 2, title: 'Post 2' },
  { id: 3, title: 'Post 3' }
];

const ids = SortUtils.extractProperty(posts, 'id');
// [1, 2, 3]

const titles = SortUtils.extractProperty(posts, 'title');
// ['Post 1', 'Post 2', 'Post 3']
```

#### Find Unsorted Indices
```typescript
const numbers = [1, 3, 2, 4, 5];
const unsorted = SortUtils.getUnsortedIndices(numbers, 'asc');
// [1] - index 1 is where sort order is violated (3 > 2)
```

### 5. Custom Comparators
```typescript
const items = [
  { priority: 1, name: 'High' },
  { priority: 3, name: 'Low' },
  { priority: 2, name: 'Medium' }
];

// Custom comparator for complex sorting
const sorted = SortUtils.sortWithComparator(items, (a, b) => {
  if (a.priority !== b.priority) {
    return a.priority - b.priority;
  }
  return a.name.localeCompare(b.name);
});
```

## Usage in Tests

### Example 1: Verify API Response Sort Order
```typescript
test("should return posts sorted by ID", async ({ postSteps }) => {
  const posts = await postSteps.getAllPostsValidated();
  
  // Extract IDs
  const ids = SortUtils.extractProperty(posts, "id");
  
  // Get expected sorted order
  const sortedIds = SortUtils.sortNumbersAsc(ids);
  
  // Verify
  expect(ids).toEqual(sortedIds);
});
```

### Example 2: Direct Sort Validation
```typescript
test("should return posts sorted by ID", async ({ postSteps }) => {
  const posts = await postSteps.getAllPostsValidated();
  
  // Direct validation
  const isSorted = SortUtils.isSortedByNumberProperty(posts, "id", "asc");
  expect(isSorted).toBe(true);
});
```

### Example 3: Using in Step Functions
```typescript
// In post.steps.ts
@step("Verify posts are sorted by ID ascending")
async verifyPostsSortedById(posts: Post[]): Promise<void> {
  const ids = SortUtils.extractProperty(posts, "id");
  const sortedIds = SortUtils.sortNumbersAsc(ids);
  expect(ids).toEqual(sortedIds);
}
```

## Benefits

1. **Reusability**: Single source of truth for sorting logic
2. **Type Safety**: Generic functions work with any type
3. **Readability**: Clear method names improve test readability
4. **Maintainability**: Changes to sorting logic in one place
5. **Testing**: Dedicated utility can be unit tested independently
6. **Consistency**: Same sorting behavior across all tests

## Best Practices

1. **Always use immutable operations**: All sorting methods return new arrays
2. **Extract before sorting**: Use `extractProperty` for clarity
3. **Choose the right method**: Use type-specific methods for better performance
4. **Validate assumptions**: Use `isSorted` methods to verify data integrity
5. **Custom logic**: Use `sortWithComparator` for complex sorting needs

## Migration from Inline Sorting

### Before (Inline Sorting)
```typescript
const ids = posts.map(post => post.id);
const sortedIds = [...ids].sort((a, b) => a - b);
expect(ids).toEqual(sortedIds);
```

### After (Using SortUtils)
```typescript
const ids = SortUtils.extractProperty(posts, 'id');
const sortedIds = SortUtils.sortNumbersAsc(ids);
expect(ids).toEqual(sortedIds);
```

## Future Enhancements

Potential additions to the utility:
- Date sorting utilities
- Multi-property sorting
- Stable sort guarantee
- Performance optimizations for large arrays
- Sort by nested properties
