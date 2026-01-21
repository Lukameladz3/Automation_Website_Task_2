import { Locator, Page } from '@playwright/test';
import { Routes } from '@constants/Routes';
import { BasePage } from './BasePage';

export class AccountCreatedPage extends BasePage {
    // Helper arrow function to reduce duplication for test ID locators
    private getByDataQa = (name: string, description: string): Locator =>
        this.page.getByTestId(name).describe(description);

    readonly successMessage: Locator;
    readonly continueBtn: Locator;

    constructor(page: Page) {
        super(page);

        this.successMessage = this.page.getByText('Account Created!').describe('Success message');
        this.continueBtn = this.getByDataQa('continue-button', 'Continue button');
    }

    async clickContinue() {
        await this.clickAndWaitForURL(
            new RegExp(`${Routes.WEB.HOME}($|\\?)`),
            () => this.continueBtn.click()
        );
    }
}
