import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import config from "../playwright.config";

import { UserService } from "@api/Services/UserService";
import { expect, isolatedTest as setup } from "@fixtures/index";
import { DataFactory } from "@utils/DataFactory";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

setup(
  "authenticate workers",
  async ({ context, homePage, loginPage, request }) => {
    // Mark as slow test - creating multiple accounts takes time (3x default timeout)
    setup.slow();

    // Get worker count from config (defaults to 4 if not numeric)
    const workerCount = typeof config.workers === "number" ? config.workers : 4;

    // Create unique account for each worker
    for (let workerIndex = 0; workerIndex < workerCount; workerIndex++) {
      const user = DataFactory.generateUser({ workerIndex });
      const userService = new UserService(request);

      const storageStatePath = path.join(
        __dirname,
        `../playwright/.auth/worker-${workerIndex}.json`,
      );
      const userDataPath = path.join(
        __dirname,
        `../playwright/.auth/user-${workerIndex}.json`,
      );

      // Create user via API
      await userService.createAccount(user);

      // Login via UI to establish session
      await homePage.goto();
      await homePage.clickSignupLogin();
      await homePage.page.waitForLoadState("domcontentloaded"); // Wait for navigation to complete
      await loginPage.login(user.email, user.password);
      await expect(
        homePage.loggedInText,
        `Worker ${workerIndex} should be logged in`,
      ).toBeVisible();

      // Save storage state and user data for this worker
      await context.storageState({ path: storageStatePath });
      fs.writeFileSync(userDataPath, JSON.stringify(user, null, 2));

      // Clear session for next worker (if not last iteration)
      if (workerIndex < workerCount - 1) {
        await context.clearCookies();
      }
    }
  },
);
