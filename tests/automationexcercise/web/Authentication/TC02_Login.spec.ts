import { expect, isolatedTest as test } from '@fixtures/index';

test.describe("TC02: User Login", () => {
    test("should login with registered user credentials", async ({
        authedUser,
        homePage,
        loginPage,
    }) => {
        // Step 1: Navigate to homepage
        await test.step("Navigate to homepage", async () => {
            await homePage.goto();
            await homePage.verifyPageOpened();
        });

        // Step 2: Click on Signup/Login
        await test.step("Navigate to login page", async () => {
            await homePage.clickSignupLogin();
            await expect(
                loginPage.loginHeader,
                "Login to your account heading should be visible"
            ).toBeVisible();
        });

        // Step 3: Enter email and password
        await test.step("Login with worker-specific credentials", async () => {
            await loginPage.login(authedUser.email, authedUser.password);
        });

        // Step 4: Verify logged in successfully
        await test.step("Verify successful login", async () => {
            await expect(
                homePage.loggedInText,
                "Logged in text should be visible"
            ).toBeVisible();
            await expect(
                homePage.loggedInText,
                `Should show logged in as ${authedUser.name}`
            ).toContainText(authedUser.name);
        });

        // Step 5: Verify on homepage after login
        await test.step("Verify redirected to homepage", async () => {
            await homePage.verifyPageOpened();
        });
    });
});
