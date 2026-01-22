import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env"), quiet: true });

/**
 * Get worker-specific storage state path
 * Each worker gets its own authenticated session to avoid conflicts
 */
export function getWorkerStorageState(workerIndex: number): string {
  return path.join(__dirname, `playwright/.auth/worker-${workerIndex}.json`);
}

/**
 * Get worker-specific user data path
 */
export function getWorkerUserData(workerIndex: number): string {
  return path.join(__dirname, `playwright/.auth/user-${workerIndex}.json`);
}

export default defineConfig({
  expect: {
    timeout: 10_000,
  },
  forbidOnly: !!process.env.CI,
  fullyParallel: true,
  projects: [
    // ==================== Automation Exercise Project ====================
    {
      name: "automationexercise-setup",
      testMatch: /global\.setup\.ts/,
      retries: 0, // No retries for setup - creates worker-specific files
    },
    {
      name: "automationexercise-api",
      testMatch: /.*\/automationexercise\/api\/.*\.spec\.ts/,
      use: {
        baseURL: process.env.BASE_URL || "https://www.automationexercise.com",
      },
    },
    {
      dependencies: ["automationexercise-setup"],
      name: "automationexercise-web",
      testMatch: /.*\/automationexercise\/web\/.*\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        baseURL: process.env.BASE_URL || "https://www.automationexercise.com",
      },
    },

    // ==================== JSONPlaceholder Project ====================
    {
      name: "jsonplaceholder-api",
      testMatch: /.*\/jsonplaceholder\/api\/.*\.spec\.ts/,
      use: {
        baseURL: "https://jsonplaceholder.typicode.com",
      },
    },
  ],

  reporter: [
    ["list"],
    ["dot"],
    ["github"],
    ["html", { open: "never" }],
    ["json", { outputFile: "test-reports/results.json" }],
    ["junit", { outputFile: "test-reports/junit-results.xml" }],
  ],
  retries: process.env.CI ? 2 : 0,
  testDir: "./tests",
  timeout: 60_000,
  use: {
    actionTimeout: 15_000,
    baseURL: process.env.BASE_URL || "https://www.automationexercise.com",
    navigationTimeout: 60_000,
    screenshot: "only-on-failure",
    testIdAttribute: "data-qa",
    trace: "on-first-retry",
    video: "retain-on-failure",
  },
  workers: process.env.CI ? 4 : 4,
});
