# Spec-Driven Workflow

⚠️ **NO COPY-PASTE POLICY**:
- This document describes the **process**, not code to copy
- Any code snippets are **illustrative only**
- Create your own implementations based on YOUR application's requirements

Build robust tests without duplication. Spec files are input - all implementation follows from test scenarios.

## Core Steps

### 1. Spec Definition (AI Input)
- **Format**: Gherkin (Given/When/Then)
- **Purpose**: Use as a prompt for the AI Agent.
- **Storage**: Ephemeral / Reference only. Do NOT commit `.feature` files to the repository.
- **Process**: Paste the Gherkin scenario into the chat with the AI.

### 2. 🚨 MANDATORY: Locator Extraction (MCP ONLY)

🔴 **CRITICAL RULE: Playwright MCP ONLY for All Browser Interactions**
- ✅ **ALWAYS** use Playwright MCP commands for locator extraction and browser work
- ❌ **NEVER** use `browser_subagent` or other browser tools for test-related work
- 📍 **MCP provides:** Better locator engine access, consistency, efficiency

**CODE WRITING FORBIDDEN WITHOUT COMPLETED LOCATOR EXTRACTION**

Follow `docs/patterns/locators.md` process using **Playwright MCP**:
1. Visual analysis via Playwright MCP (`mcp__playwright__browser_navigate`, `mcp__playwright__browser_snapshot`)
2. HTML structure investigation (use MCP to inspect element container)
3. Priority strategy (ID > Data > Role+Text > aria > unique CSS > XPath)
4. Validation (uniqueness + stability via MCP)
5. Documentation (visual context, container HTML, selected locator, alternatives, verification)

**Result**: LOCATORS DOCUMENT before coding

**See:** `docs/examples/locator-extraction-example.md` for complete MCP workflow example

### 3. 🔴 MANDATORY: Check Maps Before Coding
**STOP! Before writing ANY code:**
1. **OPEN** `docs/maps/page-object-map.md` - Check existing Page Objects
2. **OPEN** `docs/maps/steps-map.md` - Check existing Steps classes
3. **SEARCH** for existing methods (even with different names)
4. **VERIFY** no similar functionality exists
5. **UPDATE** both maps after creating/editing code

### 4. Page Objects (Anti-Duplication)
- **Location**: `tests/pages/`
- **🚨 CHECK PAGE-OBJECT-MAP.MD FIRST** - Never skip this step!
- **Search existing code** - Use grep/search before creating
- **Reuse/extend** existing Page Objects - NEVER duplicate
- **MCP-only locators** from step 2
- **One locator per element**

**Element Pattern**:
- Use `Locator` type for all elements (import from `@playwright/test`)
- Add `.describe()` to ALL locators for debugging
- Use `BasePage` protected methods for checks (`elementToBeVisible`, `elementToHaveText`, etc.)
- Use Playwright API directly for interactions (`.click()`, `.fill()`, `.hover()`, etc.)
- NO wrapper classes (Button, TextBox, Label are deprecated)

**Search Commands Before Creating:**
```bash
# Check map file
grep -i "YourPageName" docs/maps/page-object-map.md

# Search existing Page Objects
grep -r "class.*Page" tests/pages/

# Search for similar methods
grep -r "async.*click" tests/pages/
```

**Example Structure:**
```typescript
import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
    readonly emailField: Locator;
    readonly submitButton: Locator;

    constructor(page: Page) {
        super(page, page.locator("form"), "Login Page");
        // Always use .describe() for debugging
        this.emailField = page.locator("#email").describe("Email input field");
        this.submitButton = page.locator("#submit").describe("Submit button");
    }

    async enterEmail(email: string): Promise<void> {
        await this.elementToBeVisible(this.emailField); // BasePage check
        await this.emailField.fill(email); // Playwright API
    }
}
```

**📋 Special Cases**:
- **Tables**: See `docs/examples/special-cases.md#working-with-tables` for Playwright table handling
- **IFrames**: See `docs/examples/special-cases.md#iframe-handling` for frameLocator usage
- **Alerts**: See `docs/examples/special-cases.md#browser-alerts` for dialog handling

### 5. Steps Classes (Business Logic Layer)
- **Location**: `tests/steps/`
- **Purpose**: Business logic orchestration (NOT atomic actions)
- **🚨 MANDATORY**: Use `@step()` decorator on ALL methods
- **🚨 BEST PRACTICE**: Accept data as parameters, DON'T read from secrets internally

**Rules**:
- Inject Page Objects via constructor
- Implement business workflows, not single actions
- Use `@step("description")` for all public methods
- Tests call Steps ONLY, never Page Objects directly
- **Accept parameters** to make methods versatile and reusable

**Example:**
```typescript
import { step } from "../decorators/decorators";
import { LoginPage } from "../pages/LoginPage";

export class LoginSteps {
    constructor(private loginPage: LoginPage) {}

    // ✅ GOOD: Accepts credentials as parameters - works with ANY data
    @step("User logs in with {0}")
    async login(email: string, password: string): Promise<void> {
        await this.loginPage.enterEmail(email);
        await this.loginPage.enterPassword(password);
        await this.loginPage.clickSubmit();
    }

    // ✅ GOOD: Accepts expected error as parameter - flexible verification
    @step("Verify login error: {0}")
    async verifyLoginError(expectedMessage: string): Promise<void> {
        await this.loginPage.verifyErrorDisplayed();
        await this.loginPage.verifyErrorHasText(expectedMessage);
    }
}
```

**Usage in Test:**
```typescript
test('Login with valid user', async ({ loginSteps }) => {
    // Get data at test level
    const username = getWikipediaUsername();
    const password = getWikipediaPassword();
    
    // Pass to Steps methods
    await loginSteps.login(username, password);
});
```

**Benefits:**
- Methods work with ANY data (valid, invalid, edge cases)
- Easy data-driven testing
- Steps are pure, reusable utilities

**See:** `docs/patterns/step-definition.md` for complete Steps pattern

### 6. Test Implementation (Anti-Duplication)
- **Location**: `tests/`
- **🚨 CHECK EXISTING FIRST** - Search before creating any test
- **Search existing patterns** - no duplicates allowed
- **Thin orchestration layer** - call Steps methods only (no direct Page Object calls)
- **Reuse fixtures**

**Search Before Creating:**
```bash
# Search for similar tests
grep -r "test(" tests/
```

### 7. Validation
- Execute tests: `npx playwright test`
- All steps must resolve
- 100% executable scenarios
- End-to-end validation
- Code automatically generates HTML reports

### 8. Code Submission
1. **Create feature branch** from current branch
2. **Verify all tests pass** (100% required)
3. **Stage changes** (git add) - **Only `.ts` files (tests, pages, steps)**. Do NOT add `.feature` files.
4. **Create commit** with descriptive message
5. **Push branch** to remote
6. **Create Pull Request**
7. **Result**: Open PR (NOT merged!)

**See [patterns/git-workflow.md](patterns/git-workflow.md) for complete Git workflow specification.**

### 9. API Steps (When Needed)

Use API Steps for test data setup/teardown (faster than UI interactions).

- **Location**: `tests/api-steps/`
- **Pattern**: Same as UI Steps (use `@step` decorator on ALL methods)
- **Fixture**: Import from `tests/fixtures/api.fixture.ts`

**Components**:
| File | Purpose |
|------|---------|
| `utils/ApiClient.ts` | Generic HTTP wrapper (GET/POST/PUT/DELETE) |
| `utils/ApiHelper.ts` | Response interception during UI actions |
| `tests/api-steps/*ApiSteps.ts` | Domain-specific API methods |

**Example API Steps:**
```typescript
import { step } from '../../utils/Decorators';

export class UserApiSteps {
    @step('Create user via API: {0}')
    async createUser(name: string, email: string): Promise<User> {
        const response = await this.apiClient.post<User>('/users', { name, email });
        return response.body;
    }
}
```

**Usage Pattern (API + UI mixed):**
```typescript
import { test } from '../fixtures/api.fixture';

test('edit user profile', async ({ userApiSteps, wikiSteps }) => {
    const user = await userApiSteps.createUser('John', 'john@test.com'); // Fast API setup
    await wikiSteps.navigateToProfile(user.id);                         // UI test
    await userApiSteps.deleteUser(user.id);                             // Fast API cleanup
});
```

**See [patterns/api-utils.md](patterns/api-utils.md) for complete API patterns.**

## Directory Structure
```
tests/
├── pages/       ← Page Objects (reuse first!)
├── steps/       ← UI Steps Classes (@step decorators)
├── api-steps/   ← API Steps Classes (@step decorators)
├── fixtures/    ← Test Fixtures (steps.fixture.ts, api.fixture.ts)
└── specs/       ← Spec files (Test Scenarios)
utils/
├── ApiClient.ts ← HTTP wrapper
├── ApiHelper.ts ← Response interception
└── ...
```

## Success Criteria
- ✅ Tests execute 100% successfully
- ✅ **MCP used exclusively** for all browser/locator work
- ✅ **No duplicate Page Objects** - Checked via maps/page-object-map.md
- ✅ All locators follow `locators.md` methodology
- ✅ All locators have `.describe()` for debugging
- ✅ **@step decorator** on all Steps methods
- ✅ **Maximum code reuse** - Always extend, never duplicate
- ✅ **Page Object Map updated** - Document all new Page Objects
- ✅ **Steps Map updated** - Document all new Steps methods

## Anti-Patterns
- ❌ Using `browser_subagent` instead of Playwright MCP
- ❌ Creating new code without checking existing
- ❌ Guessing locators without MCP validation
- ❌ Partial test implementation
- ❌ Duplicate classes/methods
- ❌ Direct Playwright calls in tests (use Steps)
- ❌ Direct Page Object usage in tests (use Steps)
- ❌ Missing `.describe()` on locators
- ❌ Missing `@step` decorators on Steps methods
