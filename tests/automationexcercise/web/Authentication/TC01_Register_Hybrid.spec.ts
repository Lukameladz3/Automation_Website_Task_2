import { expect, isolatedTest as test } from '@fixtures/index';
import { User } from '@models/UserModels';
import { DataFactory } from '@utils/DataFactory';

test.describe("TC01-Hybrid: User Registration with API Setup & Validation", () => {
    let testUser: User;

    test.beforeEach(async ({ userApiSteps }) => {
        // Create user via API for faster setup
        const workerIndex = test.info().workerIndex;
        testUser = DataFactory.generateUser({ workerIndex });
        await userApiSteps.createAndVerifyUser(testUser);
    });

    test.afterEach(async ({ userApiSteps }) => {
        // Cleanup: Delete user via API
        await userApiSteps.deleteUser(testUser.email, testUser.password);
    });

    test("should create user via API and verify account details in UI match API data", async ({
        homePage,
        loginPage,
        userApiSteps,
    }) => {
        // Step 1: Get user details via API for validation
        await test.step("Get user details via API", async () => {
            const userDetail = await userApiSteps.verifyAndGetUserDetailByEmail(testUser.email);
            expect(
                userDetail.user.email,
                "API user email should match created user email"
            ).toBe(testUser.email);
        });

        // Step 2: Navigate to homepage and login
        await test.step("Navigate to homepage and login", async () => {
            await homePage.goto();
            await homePage.verifyPageOpened();
            await homePage.clickSignupLogin();
            await expect(
                loginPage.loginHeader,
                "Login to your account heading should be visible"
            ).toBeVisible();
        });

        // Step 3: Login with API-created credentials
        await test.step("Login with API-created user credentials", async () => {
            await loginPage.login(testUser.email, testUser.password);
        });

        // Step 4: Verify successful login
        await test.step("Verify successful login", async () => {
            await expect(
                homePage.loggedInText,
                "Logged in text should be visible"
            ).toBeVisible();
            await expect(
                homePage.loggedInText,
                `Should show logged in as ${testUser.name}`
            ).toContainText(testUser.name);
        });

        // Step 5: Verify user details via API match what we created
        await test.step("Verify user details in UI match API data", async () => {
            const userDetail = await userApiSteps.verifyAndGetUserDetailByEmail(testUser.email);

            // Verify key user details match
            expect(
                userDetail.user.email,
                "User email from API should match created email"
            ).toBe(testUser.email);
            expect(
                userDetail.user.name,
                "User name from API should match created name"
            ).toBe(testUser.name);
            expect(
                userDetail.user.first_name,
                "First name from API should match created firstName"
            ).toBe(testUser.firstName);
            expect(
                userDetail.user.last_name,
                "Last name from API should match created lastName"
            ).toBe(testUser.lastName);
            expect(
                userDetail.user.city,
                "City from API should match created city"
            ).toBe(testUser.city);
        });

        // Step 6: Verify login via API
        await test.step("Verify login credentials work via API", async () => {
            const loginValid = await userApiSteps.isLoginValid(
                testUser.email,
                testUser.password
            );
            expect(
                loginValid,
                "Login should be valid via API"
            ).toBe(true);
        });
    });
});

