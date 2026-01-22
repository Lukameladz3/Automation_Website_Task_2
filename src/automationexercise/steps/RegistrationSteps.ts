import { expect } from "@playwright/test";
import { User } from "../models/UserModels";
import { AccountCreatedPage } from "../pages/AccountCreatedPage";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { SignupPage } from "../pages/SignupPage";
import { step } from "../utils/StepDecorator";

export class RegistrationSteps {
  constructor(
    private homePage: HomePage,
    private loginPage: LoginPage,
    private signupPage: SignupPage,
    private createdPage: AccountCreatedPage,
  ) { }

  /**
   * Navigates to home page, opens signup/login page, and starts registration.
   * Use this when you need to open the signup page and start registration in one step.
   * If already on signup/login page, call loginPage.signup() directly instead.
   */
  @step("Open and start registration")
  async openAndStartRegistration(user: User) {
    await this.homePage.goto();
    await this.homePage.clickSignupLogin();
    await this.loginPage.signup(user.name, user.email);
  }

  @step("Fill account details")
  async fillAccountDetails(user: User) {
    await this.signupPage.fillAccountDetails(user);
    await this.signupPage.clickCreateAccount();
  }

  @step("Finish account creation")
  async finishAccountCreation() {
    await this.createdPage.clickContinue();
  }

  @step("Perform full registration")
  async performFullRegistration(user: User) {
    await this.openAndStartRegistration(user);
    await this.fillAccountDetails(user);
  }

  /**
   * Complete account registration with all assertions
   * This includes: registration flow, account creation verification, and login verification
   * Use this to reduce duplication in tests that need full registration with assertions
   */
  @step("Register new account with verification")
  async registerNewAccount(user: User) {
    // Perform registration
    await this.performFullRegistration(user);

    // Verify Account Created
    await expect(
      this.createdPage.successMessage,
      "Account creation message should be visible",
    ).toBeVisible();
    await expect(
      this.createdPage.successMessage,
      "Account creation message should have expected text",
    ).toHaveText("Account Created!");

    // Click Continue
    await this.finishAccountCreation();

    // Verify user is logged in
    await expect(
      this.homePage.loggedInText,
      "User should be logged in",
    ).toContainText(user.name);
  }
}
