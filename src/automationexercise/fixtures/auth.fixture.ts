import { Browser, BrowserContext, TestInfo } from "@playwright/test";
import fs from "fs";
import {
  getWorkerStorageState,
  getWorkerUserData,
} from "../../../playwright.config";
import { User } from "../models/UserModels";

/**
 * Fixtures provided by the authentication module
 */
export type AuthFixtures = {
  authedUser: User;
};

/**
 * Browser fixtures required for context creation
 */
interface BrowserFixtures {
  browser: Browser;
}

/**
 * Worker info fixtures provided by Playwright
 */
interface WorkerFixtures {
  workerInfo: TestInfo;
}

/**
 * Combined fixtures for context authentication
 */
type ContextAuthFixtures = BrowserFixtures & WorkerFixtures;

/**
 * Combined fixtures for authedUser fixture
 */
type AuthUserFixtures = WorkerFixtures;

/**
 * Get the actual worker index to use, handling cases where
 * Playwright spawns more workers than we created accounts for
 */
function getActualWorkerIndex(workerIndex: number): number {
  const userDataPath = getWorkerUserData(workerIndex);

  // If this worker's user data exists, use it
  if (fs.existsSync(userDataPath)) {
    return workerIndex;
  }

  // Find the maximum available worker by checking backwards
  let maxAvailableWorker = -1;
  for (let i = 0; i < workerIndex; i++) {
    const testPath = getWorkerUserData(i);
    if (fs.existsSync(testPath)) {
      maxAvailableWorker = i;
    }
  }

  if (maxAvailableWorker >= 0) {
    const workerCount = maxAvailableWorker + 1;
    return workerIndex % workerCount;
  }

  throw new Error(
    `Worker ${workerIndex} user data not found at ${userDataPath}. ` +
      `Did global setup run successfully?` +
      "setup failed",
  );
}

/**
 * Context fixture that loads worker-specific authentication.
 * This ONLY applies to regular tests, not setup or isolated tests.
 *
 * @remarks
 * Each worker gets its own pre-authenticated browser context loaded from
 * storage state created during global setup. The 'setup' project is skipped
 * as it creates the accounts.
 */
export const workerAuthContext = {
  context: async (
    { browser }: ContextAuthFixtures,
    use: (context: BrowserContext) => Promise<void>,
    workerInfo: TestInfo,
  ): Promise<void> => {
    // Skip worker authentication for the 'setup' project - it creates the accounts
    if (workerInfo.project.name === "setup") {
      const context = await browser.newContext();
      await use(context);
      await context.close();
      return;
    }

    // For regular test projects, load worker-specific authentication
    const actualWorkerIndex = getActualWorkerIndex(workerInfo.workerIndex);
    const storageStatePath = getWorkerStorageState(actualWorkerIndex);

    // Create context with pre-loaded authentication state
    const context = await browser.newContext({
      storageState: fs.existsSync(storageStatePath)
        ? storageStatePath
        : undefined,
    });

    await use(context);
    await context.close();
  },
};

/**
 * Authentication fixture that provides worker-specific user credentials.
 *
 * @remarks
 * This fixture loads the user data for the current worker from the file system.
 * Each worker has its own unique user account created during global setup.
 * Tests can access user properties like email, name, password, etc.
 */
export const authFixture = {
  authedUser: async (
    {}: AuthUserFixtures,
    use: (user: User) => Promise<void>,
    workerInfo: TestInfo,
  ): Promise<void> => {
    const actualWorkerIndex = getActualWorkerIndex(workerInfo.workerIndex);
    const userDataPath = getWorkerUserData(actualWorkerIndex);

    const user: User = JSON.parse(fs.readFileSync(userDataPath, "utf-8"));

    // Provide pre-authenticated user to the test
    await use(user);
  },
};
