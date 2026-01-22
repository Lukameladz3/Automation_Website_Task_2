# Coding Standards

TypeScript code style and naming conventions for the framework.

---

## TypeScript Rules

- **Strict Type Checking**: No `any` unless absolutely necessary.
- **Async/Await**: Always use `async/await` for Playwright interactions.
- **Explicit Return Types**: Define return types for all methods.
- **Meaningful Names**: Descriptive variable and function names.
- **JSDoc**: Documentation for classes and public methods.
- **Assertion Standards**: Use custom matchers (`toHaveStatusCode`) and schema validation helpers (`assertSchema`).

---

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Classes | PascalCase | `LoginPage`, `DashboardPage` |
| Methods | camelCase | `login()`, `getErrorMessage()` |
| Variables | camelCase | `userName`, `errorText` |
| Constants | UPPER_SNAKE_CASE | `DEFAULT_TIMEOUT`, `BASE_URL` |
| Private | camelCase | `_attachScreenshot()`, `_validate()` |
| Files | PascalCase/camelCase | `LoginPage.ts`, `example.spec.ts` |

### File Naming

- **Page Objects:** `*Page.ts` (e.g., `LoginPage.ts`)
- **Spec Files:** `*.spec.ts` (e.g., `login.spec.ts`)
- **Steps:** `*Steps.ts` (e.g., `LoginSteps.ts`)

> **Note:** Element wrapper classes (Button, TextBox, etc.) are deprecated. Page Objects now use Playwright `Locator` directly.

---

## Method Naming Patterns

### Actions
- `click*()` - Click elements
- `enter*()` - Input text
- `select*()` - Select from dropdowns
- `navigateTo*()` - Navigate to pages
- `submit*()` - Submit forms

### Validations
- `is*Displayed()` - Check visibility
- `is*Enabled()` - Check if enabled
- `verify*()` - Complex validations
- `get*()` - Retrieve values
- `has*()` - Check existence

### State
- `waitFor*()` - Wait conditions
- `refresh*()` - Refresh elements
- `clear*()` - Clear inputs/states

---

## DRY Principles

### Search Before Creating

```bash
# Search existing Page Objects
grep -r "class.*Page" tests/pages/

# Search existing tests
grep -r "test(" tests/

# Search similar methods
grep -r "async.*login\|async.*signin" tests/pages/
```

### Reuse Priority

1. Existing Page Objects (`tests/pages/`)
2. Existing Fixtures (`tests/fixtures/`)
3. Framework elements
4. Existing helper methods

---

## Magic Values / Test Constants

**Rule:** Never use unexplained literal values (magic numbers/strings) directly in tests. Extract them to named constants.

### Placement Strategy

| Scope | Location | Example |
|-------|----------|---------|
| Single test only | Inside the test function | `const SEARCH_TERM = 'images';` |
| Single test file | Top of `test.describe` block | `const MIN_PASSWORD_LENGTH = 12;` |
| Multiple test files | JSON test data file | `tests/data/config.json` |

> **Rule:** If a constant is only used within one specific test, place it directly inside that test function to keep scope localized.

### Examples

```typescript
// ❌ BAD: Magic values with no context
const password = testDataGenerator.randomPassword(12);
await steps.verifyPopup('Click on your username to visit your homepage.');

// ✅ GOOD: Named constants explain the meaning
const MIN_PASSWORD_LENGTH = 12;
const GET_STARTED_POPUP_MESSAGE = 'Click on your username to visit your homepage.';

const password = testDataGenerator.randomPassword(MIN_PASSWORD_LENGTH);
await steps.verifyPopup(GET_STARTED_POPUP_MESSAGE);
```

### When to Use JSON Test Data

Move constants to `tests/data/*.json` when:
- Value is used across multiple spec files
- Value represents shared configuration
- Value may change per environment

---

## Navigation Pattern

**Rule:** Never use `page.goto()` directly in Tests or Steps. Navigation must go through Page Object `navigate()` methods.

| Layer | Can Navigate? | How |
|-------|---------------|-----|
| Test (spec) | ❌ No | Calls Steps |
| Steps | ❌ No | Calls Page Object `navigate()` |
| Page Object | ✅ Yes | Uses `page.goto()` with URL from environment config |

```typescript
// ❌ BAD: Direct page.goto in Steps
async openPage(): Promise<void> {
    await this.page.goto(getEnvironment().wikipedia.mainPageUrl);
}

// ✅ GOOD: Steps call Page Object navigate()
async openPage(): Promise<void> {
    await this.wikipediaMainPage.navigate();
}
```

---

## Anti-Patterns

❌ Duplicate Page Objects → Extend existing
❌ Hardcoded values → Use constants/configs
❌ Magic numbers/strings → Extract to named constants
❌ Direct Playwright calls in specs → Use Steps
❌ Direct Page Object usage in specs → Use Steps
❌ `page.goto()` in Tests or Steps → Use Page Object `navigate()`
❌ `page.waitForTimeout()` → Use `waitForSelector` or `waitForLoadState`
❌ Ignoring Promises → Always `await` async calls

---

**See also:**
- [patterns/page-object.md](patterns/page-object.md) - Page Object rules
- [maps/page-object-map.md](maps/page-object-map.md) - Track existing code
