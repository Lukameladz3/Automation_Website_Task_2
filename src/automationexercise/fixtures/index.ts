import "../utils/ApiMatchers";
import { test as base } from "@playwright/test";
import { ApiFixtures, apiFixtures } from "./api.fixture";
import { authFixture, AuthFixtures, workerAuthContext } from "./auth.fixture";
import { PageFixtures, pageFixtures } from "./pages.fixture";
import { StepsFixtures, stepsFixtures } from "./steps.fixture";

/**
 * Base test with all fixtures but NO authentication context override.
 * This is the foundation for both authenticated and isolated tests.
 */
const unauthenticatedTest = base.extend<
  ApiFixtures & PageFixtures & StepsFixtures & AuthFixtures
>({
  ...apiFixtures,
  ...pageFixtures,
  ...stepsFixtures,
  ...(authFixture as any),
});

/**
 * Authenticated test with worker-specific authentication context.
 * - Each worker gets its own pre-authenticated browser context
 * - Uses stored authentication state from global setup
 * - Use this for tests require a logged-in user
 */
const authenticatedTest = unauthenticatedTest.extend(workerAuthContext as any);

/**
 * Test instance with worker authentication (default for authenticated flows).
 * Includes context override that loads worker-specific authentication state.
 */
export const test = authenticatedTest;

/**
 * Test instance WITHOUT authentication context (for login, registration, and isolated flows).
 * - Starts with clean browser context (no cookies, no storage)
 * - Use this for:
 *   - Login tests
 *   - Registration tests
 *   - Tests that need to authenticate manually
 *   - Tests that verify unauthenticated user behavior
 */
export const isolatedTest = unauthenticatedTest;

export { expect } from "@playwright/test";
