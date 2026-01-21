import { Page } from '@playwright/test';
import { HomePage } from '@pages/HomePage';
import { step } from '@utils/StepDecorator';

export class NavigationSteps {
    constructor(
        private page: Page,
        private homePage: HomePage
    ) {}

    @step('Navigate to Home Page')
    async openHomePage(): Promise<void> {
        await this.homePage.goto();
        await this.homePage.verifyPageOpened();
    }

    @step('Scroll to bottom of page')
    async scrollToBottom(): Promise<void> {
        await this.homePage.scrollToBottom();
    }

    @step('Scroll to top of page')
    async scrollToTop(): Promise<void> {
        await this.homePage.scrollToTop();
    }

    @step('Verify subscription section is visible')
    async verifySubscriptionVisible(): Promise<void> {
        await this.homePage.verifySubscriptionVisible();
    }

    @step('Verify hero/full-fledged text is visible')
    async verifyHeroTextVisible(): Promise<void> {
        await this.homePage.verifyFullFledgedTextInViewport();
    }
}
