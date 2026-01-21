import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
    // Helper arrow function to reduce duplication for test ID locators
    private getByDataQa = (name: string, description: string): Locator =>
        this.page.getByTestId(name).describe(description);

    readonly signupNameInput: Locator;
    readonly signupEmailInput: Locator;
    readonly signupBtn: Locator;
    readonly newUserHeader: Locator;
    readonly loginEmailInput: Locator;
    readonly loginPasswordInput: Locator;
    readonly loginBtn: Locator;
    readonly loginHeader: Locator;

    constructor(page: Page) {
        super(page);

        this.signupNameInput = this.getByDataQa('signup-name', 'Signup name input');
        this.signupEmailInput = this.getByDataQa('signup-email', 'Signup email input');
        this.signupBtn = this.getByDataQa('signup-button', 'Signup button');
        this.newUserHeader = this.page.getByRole('heading', { name: 'New User Signup!' }).describe('New User Header');
        this.loginEmailInput = this.getByDataQa('login-email', 'Login email input');
        this.loginPasswordInput = this.getByDataQa('login-password', 'Login password input');
        this.loginBtn = this.getByDataQa('login-button', 'Login button');
        this.loginHeader = this.page.getByRole('heading', { name: 'Login to your account' }).describe('Login Header');
    }

    async signup(name: string, email: string) {
        await this.signupNameInput.fill(name);
        await this.signupEmailInput.fill(email);
        await this.signupBtn.click();
    }

    async login(email: string, pass: string) {
        await this.loginEmailInput.fill(email);
        await this.loginPasswordInput.fill(pass);
        await this.loginBtn.click();
    }

    async verifyVisible() {
        // Soft assertions: Check all fields to see all failures at once (data verification)
        await expect.soft(this.loginEmailInput, 'Login email input should be visible').toBeVisible();
        await expect.soft(this.loginPasswordInput, 'Login password input should be visible').toBeVisible();
    }
}
