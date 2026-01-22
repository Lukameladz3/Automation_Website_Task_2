import { expect, isolatedTest as test } from '@fixtures/index';
import { DataFactory } from '@utils/DataFactory';

// left this test to show example
test.describe("TC01: User Registration", { tag: "@Abdykarimov" }, () => {
  test("should register a new user with complete profile", async ({
    accountCreatedPage,
    homePage,
    registrationSteps,
  }) => {
    const workerIndex = test.info().workerIndex;
    const user = DataFactory.generateUser({ workerIndex });

    // Steps layer provides reporting via @step decorator
    await registrationSteps.openAndStartRegistration(user);
    await registrationSteps.fillAccountDetails(user);

    // Verify account creation
    await expect(accountCreatedPage.successMessage, 'account create text should be visible').toHaveText(
      "Account Created!",
    );

    // Continue and verify logged-in state
    await registrationSteps.finishAccountCreation();
    await expect(
      homePage.loggedInText,
      "User should be logged in",
    ).toContainText(user.name);
  });
});
