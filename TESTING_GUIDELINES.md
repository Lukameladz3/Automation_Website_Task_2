# Playwright TypeScript Testing Guidelines

Actionable rules and patterns for Web and API testing with Playwright.

---

## Table of Contents

1. [Project Structure](#1-project-structure)
2. [Page Object Model (Web Testing)](#2-page-object-model-web-testing)
3. [API Service Layer (API Testing)](#3-api-service-layer-api-testing)
4. [Test Data with Faker](#4-test-data-with-faker)
5. [Fixtures Pattern](#5-fixtures-pattern)
6. [Parallel Execution](#6-parallel-execution)
7. [Detailed Failure Messages](#7-detailed-failure-messages)
8. [Configuration Best Practices](#8-configuration-best-practices)
9. [Anti-Patterns to Avoid](#9-anti-patterns-to-avoid)
10. [PR Review Checklist](#10-pr-review-checklist)

---

## 1. Project Structure

```
src/
├── api/              # API service classes
│   └── *.service.ts
├── constants/        # Routes, status codes, enums
│   ├── Routes.ts
│   └── StatusCode.ts
├── fixtures/         # Custom test fixtures
│   ├── index.ts      # Main fixture export
│   └── *.fixture.ts
├── models/           # Type definitions & Zod schemas
│   └── api/
│       └── *.ts
├── pages/            # Page Object classes
│   └── *.page.ts
└── utils/            # Helpers, DataFactory
    └── DataFactory.ts

tests/
├── api/              # API test specs
│   └── *.spec.ts
├── web/              # Web test specs
│   └── *.spec.ts
└── *.setup.ts        # Setup files (auth, etc.)
```

### File Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Page Object | `<Name>Page.ts` | `LoginPage.ts`, `CheckoutPage.ts` |
| API Service | `<Domain>Service.ts` | `UserService.ts`, `OrderService.ts` |
| Fixture | `<name>.fixture.ts` | `auth.fixture.ts`, `api.fixture.ts` |
| Test Spec | `<feature>.spec.ts` | `login.spec.ts`, `checkout.spec.ts` |
| Model/Schema | `<Domain>Models.ts` | `UserModels.ts`, `OrderModels.ts` |

---

## 2. Page Object Model (Web Testing)

### Rules

1. **One class per page/component** - Each page or significant component gets its own class
2. **Dependency injection** - Pass `Page` instance via constructor
3. **Locators as readonly properties** - Define all locators in constructor
4. **Actions only, no assertions** - Page objects perform actions; tests make assertions
5. **Prefer user-facing locators** - Use `getByRole`, `getByText`, `getByTestId`, `getByLabel`

### Template

```typescript
import { Page, Locator } from '@playwright/test';

export class ProductPage {
    readonly page: Page;
    
    // Locators - prefer semantic selectors
    readonly addToCartBtn: Locator;
    readonly productTitle: Locator;
    readonly priceLabel: Locator;
    readonly quantityInput: Locator;

    constructor(page: Page) {
        this.page = page;
        // Preferred: user-facing locators
        this.addToCartBtn = page.getByRole('button', { name: 'Add to Cart' });
        this.productTitle = page.getByRole('heading', { level: 1 });
        this.priceLabel = page.getByTestId('product-price');
        // Fallback: CSS selectors when semantic not possible
        this.quantityInput = page.locator('#quantity');
    }

    // Navigation
    async goto(productId: string) {
        await this.page.goto(`/products/${productId}`);
    }

    // Actions - return void or data, never assertions
    async addToCart(quantity: number = 1) {
        await this.quantityInput.fill(String(quantity));
        await this.addToCartBtn.click();
    }

    // Getters for data extraction
    async getPrice(): Promise<string> {
        return await this.priceLabel.textContent() ?? '';
    }
}
```

### Locator Priority (Best to Worst)

```typescript
// 1. Role-based (BEST - accessible, resilient)
page.getByRole('button', { name: 'Submit' })
page.getByRole('textbox', { name: 'Email' })
page.getByRole('link', { name: 'Sign up' })

// 2. Label/Placeholder (Good - user-visible)
page.getByLabel('Email address')
page.getByPlaceholder('Enter your email')

// 3. Text content (Good - user-visible)
page.getByText('Welcome back')

// 4. Test ID (Good - explicit, stable)
page.getByTestId('submit-button')

// 5. CSS selector (Last resort)
page.locator('#login-button')
page.locator('.product-card')
```

### Component Pattern (Reusable Elements)

```typescript
// For repeated UI elements like cards, rows, modals
export class ProductCard {
    readonly container: Locator;
    readonly title: Locator;
    readonly price: Locator;
    readonly addBtn: Locator;

    constructor(container: Locator) {
        this.container = container;
        this.title = container.getByRole('heading');
        this.price = container.getByTestId('price');
        this.addBtn = container.getByRole('button', { name: 'Add' });
    }

    async add() {
        await this.addBtn.click();
    }
}

// Usage in Page Object
export class CatalogPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    getProductCard(name: string): ProductCard {
        const container = this.page.locator('[data-testid="product-card"]', {
            has: this.page.getByText(name)
        });
        return new ProductCard(container);
    }
}
```

---

## 3. API Service Layer (API Testing)

### Rules

1. **One service per API domain** - Group related endpoints logically
2. **Inject `APIRequestContext`** - Enables fixture-based setup
3. **Return raw `APIResponse`** - Let tests handle assertions and parsing
4. **Centralize routes** - All endpoints in `constants/Routes.ts`
5. **Validate with Zod schemas** - Type-safe response parsing in tests

### Service Template

```typescript
import { APIRequestContext, APIResponse } from '@playwright/test';
import { Routes } from '../constants/Routes';
import { CreateOrderRequest } from '../models/api/OrderModels';

export class OrderService {
    constructor(private request: APIRequestContext) {}

    async getOrder(id: string): Promise<APIResponse> {
        return await this.request.get(Routes.orderById(id));
    }

    async listOrders(params?: { page?: number; limit?: number }): Promise<APIResponse> {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.set('page', String(params.page));
        if (params?.limit) searchParams.set('limit', String(params.limit));
        
        const url = searchParams.toString() 
            ? `${Routes.ORDERS}?${searchParams}` 
            : Routes.ORDERS;
        return await this.request.get(url);
    }

    async createOrder(data: CreateOrderRequest): Promise<APIResponse> {
        return await this.request.post(Routes.ORDERS, { data });
    }

    async updateOrder(id: string, data: Partial<CreateOrderRequest>): Promise<APIResponse> {
        return await this.request.patch(Routes.orderById(id), { data });
    }

    async deleteOrder(id: string): Promise<APIResponse> {
        return await this.request.delete(Routes.orderById(id));
    }
}
```

### Routes Constants

```typescript
// src/constants/Routes.ts
export const Routes = {
    // API endpoints
    USERS: '/api/users',
    ORDERS: '/api/orders',
    PRODUCTS: '/api/products',
    
    // Dynamic routes
    userById: (id: string | number) => `/api/users/${id}`,
    orderById: (id: string) => `/api/orders/${id}`,
    
    // UI routes
    LOGIN: '/',
    DASHBOARD: '/dashboard',
    CHECKOUT: '/checkout',
} as const;
```

### Zod Schema Pattern

```typescript
// src/models/api/OrderModels.ts
import { z } from 'zod';

// Response schemas
export const OrderSchema = z.object({
    id: z.string().uuid(),
    userId: z.string(),
    items: z.array(z.object({
        productId: z.string(),
        quantity: z.number().positive(),
        price: z.number()
    })),
    total: z.number(),
    status: z.enum(['pending', 'confirmed', 'shipped', 'delivered']),
    createdAt: z.string().datetime()
});

export const OrderListSchema = z.object({
    data: z.array(OrderSchema),
    pagination: z.object({
        page: z.number(),
        totalPages: z.number(),
        totalItems: z.number()
    })
});

// Request schemas
export const CreateOrderRequestSchema = z.object({
    items: z.array(z.object({
        productId: z.string(),
        quantity: z.number().positive()
    }))
});

// Infer TypeScript types
export type Order = z.infer<typeof OrderSchema>;
export type CreateOrderRequest = z.infer<typeof CreateOrderRequestSchema>;
```

### API Test Pattern

```typescript
import { test, expect } from '../../src/fixtures';
import { StatusCode } from '../../src/constants/StatusCode';
import { OrderSchema, CreateOrderRequestSchema } from '../../src/models/api/OrderModels';
import { DataFactory } from '../../src/utils/DataFactory';

test.describe('Order API', () => {
    test('should create order successfully', async ({ api }) => {
        // Arrange
        const orderData = DataFactory.generateOrder();

        // Act
        const response = await api.orders.createOrder(orderData);

        // Assert - Status
        expect(response.status(), 'Expected 201 Created').toBe(StatusCode.CREATED);

        // Assert - Schema (validates structure + returns typed data)
        const body = OrderSchema.parse(await response.json());

        // Assert - Business logic
        expect(body.status, 'New order should be pending').toBe('pending');
        expect(body.items, 'Order items should match request').toHaveLength(orderData.items.length);
    });

    test('should return 404 for non-existent order', async ({ api }) => {
        const response = await api.orders.getOrder('non-existent-id');
        
        expect(response.status(), 'Expected 404 Not Found').toBe(StatusCode.NOT_FOUND);
    });
});
```

---

## 4. Test Data with Faker

### Rules

1. **Centralize in DataFactory** - Single source for test data generation
2. **Use seeding for CI** - Deterministic data for reproducible failures
3. **Fresh data per test** - Never share generated data between tests
4. **Include edge cases** - Special characters, boundary values

### DataFactory Template

```typescript
import { faker } from '@faker-js/faker';

export class DataFactory {
    /**
     * Set seed for deterministic generation (use in CI)
     */
    static setSeed(seed: number) {
        faker.seed(seed);
    }

    /**
     * Reset to random generation
     */
    static resetSeed() {
        faker.seed();
    }

    // ============ USER DATA ============
    
    static generateUser() {
        return {
            email: faker.internet.email(),
            password: faker.internet.password({ length: 12 }),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        };
    }

    static generateUserWithEdgeCases() {
        return {
            email: faker.internet.email(),
            password: faker.internet.password({ length: 12 }),
            // Edge cases for name fields
            firstName: "O'Connor-Smith",
            lastName: "María José",
        };
    }

    // ============ ORDER DATA ============

    static generateOrder(itemCount: number = 2) {
        return {
            items: Array.from({ length: itemCount }, () => ({
                productId: faker.string.uuid(),
                quantity: faker.number.int({ min: 1, max: 10 })
            }))
        };
    }

    // ============ ADDRESS DATA ============

    static generateAddress() {
        return {
            street: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state(),
            zipCode: faker.location.zipCode(),
            country: faker.location.country()
        };
    }

    // ============ CHECKOUT DATA ============

    static generateCheckoutDetails() {
        return {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            postalCode: faker.location.zipCode()
        };
    }

    // ============ BULK GENERATION ============

    /**
     * Generate multiple items for data-driven tests
     */
    static generateUsers(count: number) {
        return Array.from({ length: count }, () => this.generateUser());
    }

    /**
     * Deterministic generation for consistent CI results
     */
    static generateDeterministicUsers(count: number, seed: number = 42) {
        this.setSeed(seed);
        const users = this.generateUsers(count);
        this.resetSeed();
        return users;
    }
}
```

### Usage in Tests

```typescript
test('should register new user', async ({ page }) => {
    // Fresh data for this test only
    const user = DataFactory.generateUser();
    
    await registerPage.fillForm(user);
    await registerPage.submit();
    
    await expect(page.getByText(`Welcome, ${user.firstName}`)).toBeVisible();
});

// Data-driven tests
const testUsers = DataFactory.generateDeterministicUsers(3);

for (const user of testUsers) {
    test(`should validate email format: ${user.email}`, async ({ api }) => {
        const response = await api.users.create(user);
        expect(response.status()).toBe(201);
    });
}
```

---

## 5. Fixtures Pattern

### Rules

1. **Extend base test** - Use `test.extend<T>()` for custom fixtures
2. **Auto setup/teardown** - Fixtures handle lifecycle automatically
3. **Compose fixtures** - Combine multiple fixtures for complex scenarios
4. **Lazy initialization** - Fixtures only run when used

### Fixture Structure

```typescript
// src/fixtures/index.ts - Main export
import { test as base } from '@playwright/test';
import { ApiFixture, apiFixture } from './api.fixture';
import { PagesFixture, pagesFixture } from './pages.fixture';

type AllFixtures = ApiFixture & PagesFixture;

export const test = base.extend<AllFixtures>({
    ...apiFixture,
    ...pagesFixture,
});

export { expect } from '@playwright/test';
```

### API Fixture

```typescript
// src/fixtures/api.fixture.ts
import { request as playwrightRequest } from '@playwright/test';
import { UserService } from '../api/UserService';
import { OrderService } from '../api/OrderService';

export type ApiFixture = {
    api: {
        users: UserService;
        orders: OrderService;
    };
};

export const apiFixture = {
    api: async ({}, use: (api: ApiFixture['api']) => Promise<void>) => {
        const context = await playwrightRequest.newContext({
            baseURL: process.env.API_URL,
            extraHTTPHeaders: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${process.env.API_TOKEN}`,
            }
        });

        const api = {
            users: new UserService(context),
            orders: new OrderService(context),
        };

        await use(api);
        await context.dispose();
    }
};
```

### Pages Fixture

```typescript
// src/fixtures/pages.fixture.ts
import { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { CheckoutPage } from '../pages/CheckoutPage';

export type PagesFixture = {
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
    checkoutPage: CheckoutPage;
};

export const pagesFixture = {
    loginPage: async ({ page }: { page: Page }, use: (p: LoginPage) => Promise<void>) => {
        await use(new LoginPage(page));
    },
    dashboardPage: async ({ page }: { page: Page }, use: (p: DashboardPage) => Promise<void>) => {
        await use(new DashboardPage(page));
    },
    checkoutPage: async ({ page }: { page: Page }, use: (p: CheckoutPage) => Promise<void>) => {
        await use(new CheckoutPage(page));
    },
};
```

### Fixture with Setup/Teardown

```typescript
// Fixture that creates and cleans up test data
export const orderFixture = {
    testOrder: async ({ api }, use) => {
        // Setup: Create order before test
        const orderData = DataFactory.generateOrder();
        const response = await api.orders.createOrder(orderData);
        const order = await response.json();

        // Provide to test
        await use(order);

        // Teardown: Clean up after test
        await api.orders.deleteOrder(order.id);
    }
};
```

---

## 6. Parallel Execution

### Configuration

```typescript
// playwright.config.ts
export default defineConfig({
    fullyParallel: true,           // Run all tests in parallel
    workers: process.env.CI ? 4 : undefined,  // CI: fixed workers, Local: auto
    
    // Per-project parallelism
    projects: [
        {
            name: 'api',
            testMatch: /.*\/api\/.*\.spec\.ts/,
            fullyParallel: true,
        },
        {
            name: 'web',
            testMatch: /.*\/web\/.*\.spec\.ts/,
            fullyParallel: true,
        },
    ],
});
```

### Isolation Rules

```typescript
// GOOD: Each test creates its own data
test('should update user profile', async ({ api }) => {
    const user = DataFactory.generateUser();
    const createResponse = await api.users.create(user);
    const userId = (await createResponse.json()).id;
    
    const updateResponse = await api.users.update(userId, { firstName: 'Updated' });
    expect(updateResponse.status()).toBe(200);
});

// BAD: Shared state between tests
let sharedUserId: string; // DON'T DO THIS

test('create user', async ({ api }) => {
    const response = await api.users.create(DataFactory.generateUser());
    sharedUserId = (await response.json()).id; // Race condition!
});

test('update user', async ({ api }) => {
    await api.users.update(sharedUserId, { firstName: 'Test' }); // Depends on previous test!
});
```

### Serial Execution (When Required)

```typescript
// Only use serial when tests MUST run in order
test.describe.configure({ mode: 'serial' });

test.describe('Checkout flow (sequential)', () => {
    test('step 1: add items to cart', async ({ page }) => { /* ... */ });
    test('step 2: enter shipping', async ({ page }) => { /* ... */ });
    test('step 3: complete payment', async ({ page }) => { /* ... */ });
});
```

### Parallel Within Describe

```typescript
test.describe('User API', () => {
    // Explicitly enable parallel for this describe block
    test.describe.configure({ mode: 'parallel' });

    test('should create user', async ({ api }) => { /* ... */ });
    test('should get user', async ({ api }) => { /* ... */ });
    test('should update user', async ({ api }) => { /* ... */ });
    test('should delete user', async ({ api }) => { /* ... */ });
});
```

---

## 7. Detailed Failure Messages

### Always Include Assertion Messages

```typescript
// GOOD: Descriptive messages that explain intent
expect(response.status(), 'Create user should return 201 Created').toBe(201);
expect(body.email, 'Response email should match request').toBe(requestData.email);
expect(items, 'Cart should contain exactly 3 items').toHaveLength(3);

// BAD: No message - unclear what failed
expect(response.status()).toBe(201);
expect(body.email).toBe(requestData.email);
```

### Include Context in Messages

```typescript
test('should fetch user by ID', async ({ api }) => {
    const userId = 123;
    const response = await api.users.getUser(userId);
    
    // Include the actual values for debugging
    expect(
        response.status(),
        `GET /users/${userId} should return 200, got ${response.status()}`
    ).toBe(200);

    const body = await response.json();
    expect(
        body.id,
        `User ID in response (${body.id}) should match requested ID (${userId})`
    ).toBe(userId);
});
```

### Soft Assertions (Multiple Checks)

```typescript
test('should validate user response structure', async ({ api }) => {
    const response = await api.users.getUser(1);
    const body = await response.json();

    // Soft assertions: continue checking even if one fails
    expect.soft(body.id, 'ID should be present').toBeDefined();
    expect.soft(body.email, 'Email should be valid format').toMatch(/@/);
    expect.soft(body.firstName, 'First name should not be empty').toBeTruthy();
    expect.soft(body.lastName, 'Last name should not be empty').toBeTruthy();

    // This will report ALL failures, not just the first one
});
```

### Custom Error Context with test.step

```typescript
test('should complete checkout', async ({ page, checkoutPage }) => {
    await test.step('Fill shipping details', async () => {
        const address = DataFactory.generateAddress();
        await checkoutPage.fillShipping(address);
        await expect(
            checkoutPage.shippingConfirmation,
            'Shipping form should be confirmed'
        ).toBeVisible();
    });

    await test.step('Enter payment information', async () => {
        await checkoutPage.fillPayment(DataFactory.generateCard());
        await expect(
            checkoutPage.paymentConfirmation,
            'Payment should be accepted'
        ).toBeVisible();
    });

    await test.step('Confirm order', async () => {
        await checkoutPage.confirmOrder();
        await expect(
            page,
            'Should redirect to order confirmation page'
        ).toHaveURL(/\/order-confirmed/);
    });
});
```

### API Response Debugging

```typescript
test('should handle API error gracefully', async ({ api }) => {
    const response = await api.orders.createOrder({ items: [] });
    
    // Log response for debugging on failure
    const body = await response.json();
    
    expect(
        response.status(),
        `Expected 400 Bad Request for empty order.\nResponse: ${JSON.stringify(body, null, 2)}`
    ).toBe(400);
    
    expect(
        body.error,
        'Error message should mention empty items'
    ).toContain('items');
});
```

---

## 8. Configuration Best Practices

### Recommended playwright.config.ts

```typescript
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
    // Test discovery
    testDir: './tests',
    testMatch: '**/*.spec.ts',

    // Parallelization
    fullyParallel: true,
    workers: process.env.CI ? 4 : undefined,

    // Timeouts
    timeout: 30_000,              // Test timeout
    expect: {
        timeout: 5_000,           // Assertion timeout
    },

    // CI settings
    forbidOnly: !!process.env.CI, // Fail if test.only in CI
    retries: process.env.CI ? 2 : 0,

    // Reporting
    reporter: [
        ['list'],                         // Console output
        ['html', { open: 'never' }],      // HTML report
        ['json', { outputFile: 'results.json' }], // For CI parsing
    ],

    // Global settings
    use: {
        baseURL: process.env.BASE_URL,
        
        // Browser settings
        headless: true,
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,

        // Artifacts - only on failure to save space
        trace: 'retain-on-failure',
        video: 'retain-on-failure',
        screenshot: 'only-on-failure',

        // Timeouts
        actionTimeout: 10_000,
        navigationTimeout: 15_000,
    },

    // Projects
    projects: [
        // Auth setup (runs first)
        {
            name: 'setup',
            testMatch: /.*\.setup\.ts/,
        },
        // API tests (no browser needed)
        {
            name: 'api',
            testMatch: /.*\/api\/.*\.spec\.ts/,
            use: { 
                // No browser config needed for API tests
            },
        },
        // Web tests
        {
            name: 'chromium',
            testMatch: /.*\/web\/.*\.spec\.ts/,
            use: {
                ...devices['Desktop Chrome'],
                storageState: 'playwright/.auth/user.json',
            },
            dependencies: ['setup'],
        },
    ],
});
```

### Environment Variables (.env.example)

```bash
# Application URLs
BASE_URL=https://example.com
API_URL=https://api.example.com

# Authentication
AUTH_USER=testuser@example.com
AUTH_PASSWORD=testpassword
API_TOKEN=your-api-token

# Test configuration
CI=false
DEBUG=false
```

---

## 9. Anti-Patterns to Avoid

### Never Use Hard Waits

```typescript
// BAD: Arbitrary sleep
await page.waitForTimeout(3000);

// GOOD: Wait for specific condition
await expect(page.getByRole('alert')).toBeVisible();
await page.waitForResponse(resp => resp.url().includes('/api/data'));
await expect(submitBtn).toBeEnabled();
```

### Never Assert in Page Objects

```typescript
// BAD: Assertion in page object
class LoginPage {
    async login(user: string, pass: string) {
        await this.usernameInput.fill(user);
        await this.passwordInput.fill(pass);
        await this.loginBtn.click();
        await expect(this.page).toHaveURL('/dashboard'); // DON'T
    }
}

// GOOD: Return control to test
class LoginPage {
    async login(user: string, pass: string) {
        await this.usernameInput.fill(user);
        await this.passwordInput.fill(pass);
        await this.loginBtn.click();
        // No assertion - let test decide what to verify
    }
}

// In test:
await loginPage.login(user, pass);
await expect(page).toHaveURL('/dashboard'); // Test makes assertion
```

### Never Share State Between Tests

```typescript
// BAD: Mutable shared state
let token: string;

test.beforeAll(async ({ api }) => {
    token = await api.auth.getToken(); // Shared across tests
});

// GOOD: Each test gets its own context
test('test 1', async ({ authenticatedApi }) => {
    // authenticatedApi fixture provides fresh token
});
```

### Never Hardcode Test Data in Specs

```typescript
// BAD: Hardcoded data
test('should create user', async ({ api }) => {
    const response = await api.users.create({
        email: 'john@test.com',      // Will conflict in parallel
        firstName: 'John',
        lastName: 'Doe'
    });
});

// GOOD: Generated data
test('should create user', async ({ api }) => {
    const user = DataFactory.generateUser();
    const response = await api.users.create(user);
});
```

### Never Use CSS Classes for Test Selectors

```typescript
// BAD: Brittle, tied to styling
page.locator('.btn-primary-lg')
page.locator('.MuiButton-root')

// GOOD: Semantic or test-specific
page.getByRole('button', { name: 'Submit' })
page.getByTestId('submit-button')
```

### Never Catch Errors to Hide Failures

```typescript
// BAD: Swallowing errors
test('should work', async ({ api }) => {
    try {
        const response = await api.doSomething();
        expect(response.status()).toBe(200);
    } catch (e) {
        console.log('Test failed but continuing...'); // NO!
    }
});

// GOOD: Let tests fail naturally
test('should work', async ({ api }) => {
    const response = await api.doSomething();
    expect(response.status(), 'Request should succeed').toBe(200);
});
```

---

## 10. PR Review Checklist

### Test Structure

- [ ] Test file follows naming convention (`*.spec.ts`)
- [ ] Tests are in correct folder (`tests/api/` or `tests/web/`)
- [ ] Each test has a clear, descriptive name
- [ ] Tests are independent (no shared mutable state)
- [ ] No `test.only` or `test.skip` without explanation

### Assertions

- [ ] Every assertion has a descriptive message
- [ ] Using `expect.soft()` for multiple related checks
- [ ] Schema validation with Zod for API responses
- [ ] Status codes checked with custom messages

### Data Management

- [ ] Test data generated via `DataFactory`
- [ ] No hardcoded IDs, emails, or credentials
- [ ] Unique data per test for parallel safety

### Page Objects

- [ ] No assertions inside page objects
- [ ] Locators use semantic selectors (`getByRole`, `getByTestId`)
- [ ] No `waitForTimeout()` calls

### API Services

- [ ] Returns raw `APIResponse` (no parsing in service)
- [ ] Routes use constants from `Routes.ts`
- [ ] Proper TypeScript types for request data

### Parallel Safety

- [ ] Test can run in any order
- [ ] No dependencies on other tests
- [ ] Fresh data created in test or fixture

### Error Handling

- [ ] No swallowed exceptions
- [ ] Negative cases have expected error assertions
- [ ] Timeout values are reasonable

---

## Quick Reference

### Common Imports

```typescript
// Tests
import { test, expect } from '../../src/fixtures';
import { DataFactory } from '../../src/utils/DataFactory';
import { StatusCode } from '../../src/constants/StatusCode';

// Page Objects
import { Page, Locator, expect } from '@playwright/test';

// API Services
import { APIRequestContext, APIResponse } from '@playwright/test';

// Models
import { z } from 'zod';
```

### Assertion Patterns

```typescript
// Status codes
expect(response.status(), 'Should return OK').toBe(StatusCode.OK);

// Schema validation (throws on invalid)
const body = UserSchema.parse(await response.json());

// Visibility
await expect(element, 'Element should be visible').toBeVisible();

// URL
await expect(page, 'Should navigate to dashboard').toHaveURL(/dashboard/);

// Text content
await expect(heading, 'Should show welcome message').toContainText('Welcome');

// Count
await expect(items, 'Should have 3 items').toHaveCount(3);

// Soft assertions
expect.soft(value, 'First check').toBe(expected1);
expect.soft(value, 'Second check').toBe(expected2);
```

### Running Tests

```bash
# All tests
pnpm exec playwright test

# Specific file
pnpm exec playwright test tests/api/users.spec.ts

# By tag
pnpm exec playwright test --grep @smoke

# API only
pnpm exec playwright test --project=api

# With UI
pnpm exec playwright test --ui

# Debug mode
pnpm exec playwright test --debug

# Show report
pnpm exec playwright show-report
```

