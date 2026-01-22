import { Locator, Page } from '@playwright/test';

/**
 * NavigationMenu - Reusable component for global navigation header
 * Represents the main navigation menu available on all pages
 *
 * @example
 * const nav = new NavigationMenu(page);
 * await nav.clickContactUs();
 */
export class NavigationMenu {
  readonly page: Page;

  // Main Navigation Links
  readonly homeLink: Locator;
  readonly productsLink: Locator;
  readonly cartLink: Locator;
  readonly signupLoginLink: Locator;
  readonly contactUsLink: Locator;
  readonly testCasesLink: Locator;
  readonly apiTestingLink: Locator;
  readonly videoTutorialsLink: Locator;

  // User Account Links (visible when logged in)
  readonly loggedInText: Locator;
  readonly logoutLink: Locator;
  readonly deleteAccountLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // Main navigation
    this.homeLink = page.getByRole('link', { name: /home/i }).describe('Home link');
    this.productsLink = page.getByRole('link', { name: 'Products' }).describe('Products link');
    this.cartLink = page.getByText(' Cart', { exact: true }).describe('Cart link');
    this.signupLoginLink = page.getByRole('link', { name: 'Signup / Login' }).describe('Signup / Login link');
    this.contactUsLink = page.getByRole('link', { name: 'Contact us' }).describe('Contact us link');
    this.testCasesLink = page.getByRole('link', { name: 'Test Cases' }).describe('Test Cases link');
    this.apiTestingLink = page.getByRole('link', { name: 'API Testing' }).describe('API Testing link');
    this.videoTutorialsLink = page.getByRole('link', { name: 'Video Tutorials' }).describe('Video Tutorials link');

    // User account actions
    this.loggedInText = page.locator('li').filter({ hasText: 'Logged in as' }).describe('Logged in text');
    this.logoutLink = page.getByRole('link', { name: 'Logout' }).describe('Logout link');
    this.deleteAccountLink = page.getByRole('link', { name: ' Delete Account' }).describe('Delete Account link');
  }

  /**
   * Navigate to Home page
   */
  async clickHome() {
    await this.homeLink.click();
  }

  /**
   * Navigate to Products page
   */
  async clickProducts() {
    await this.productsLink.click();
  }

  /**
   * Navigate to Cart page
   */
  async clickCart() {
    await this.cartLink.click();
  }

  /**
   * Navigate to Signup/Login page
   */
  async clickSignupLogin() {
    await this.signupLoginLink.click();
  }

  /**
   * Navigate to Contact Us page
   */
  async clickContactUs() {
    await this.contactUsLink.click();
  }

  /**
   * Navigate to Test Cases page
   */
  async clickTestCases() {
    await this.testCasesLink.click();
  }

  /**
   * Navigate to API Testing page
   */
  async clickApiTesting() {
    await this.apiTestingLink.click();
  }

  /**
   * Navigate to Video Tutorials page
   */
  async clickVideoTutorials() {
    await this.videoTutorialsLink.click();
  }

  /**
   * Click Logout link
   */
  async clickLogout() {
    await this.logoutLink.click();
  }

  /**
   * Click Delete Account link
   */
  async clickDeleteAccount() {
    await this.deleteAccountLink.click();
  }
}
