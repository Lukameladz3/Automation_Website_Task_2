import { expect, Locator, Page } from "@playwright/test";
import { NavigationMenu } from "../components/NavigationMenu";

/**
 * BasePage - Base class for all page objects
 * Provides common page reference and navigation
 */
export abstract class BasePage {
  readonly page: Page;
  readonly navigation: NavigationMenu;
  readonly uniqueLocator?: Locator;

  constructor(page: Page, uniqueLocator?: Locator) {
    this.page = page;
    this.navigation = new NavigationMenu(page);
    this.uniqueLocator = uniqueLocator;
  }

  /**
   * Navigate to a specific URL
   * Using 'load' with extended timeout to ensure all resources load
   * before interactions, preventing element-not-found errors
   */
  async goto(url: string): Promise<void> {
    await this.page.goto(url, {
      // domcontentloaded is typically more stable/faster than full load for this site
      waitUntil: "domcontentloaded",
    });
  }

  /**
   * Get current page URL
   */
  getUrl(): string {
    return this.page.url();
  }

  /**
   * Navigate back in history
   * Waits for DOM to be ready after navigation
   */
  async goBack(): Promise<void> {
    await this.page.goBack({ waitUntil: "domcontentloaded" });
  }

  /**
   * Click an element and wait for a URL match.
   * Uses configured navigationTimeout from Playwright config (no hardcoded timeouts).
   *
   * @remarks
   * This method handles race conditions with ad overlays and hash changes by checking
   * if navigation actually occurred before waiting for the URL pattern.
   */
  protected async clickAndWaitForURL(
    urlPattern: RegExp,
    click: () => Promise<unknown>,
  ): Promise<void> {
    const currentUrl = this.page.url();

    await Promise.all([
      // Only wait for URL if we're expecting a navigation
      this.page.waitForURL(
        (url) => {
          // Match the pattern AND ensure it's different from current URL
          return (
            urlPattern.test(url.toString()) && url.toString() !== currentUrl
          );
        },
        { waitUntil: "domcontentloaded" },
      ),
      click(),
    ]);
  }

  /**
   * Wait for the page to load completely
   */
  async waitForLoadState(
    state: "domcontentloaded" | "load" | "networkidle" = "load",
  ): Promise<void> {
    await this.page.waitForLoadState(state);
  }

  /**
   * Verify that the page is opened by checking the unique locator
   * @param customMessage Optional custom error message for the assertion
   */
  async verifyPageOpened(customMessage?: string): Promise<void> {
    if (!this.uniqueLocator) {
      throw new Error(
        "Cannot verify page opened: uniqueLocator not defined in page object constructor",
      );
    }

    const message =
      customMessage ||
      `Page should be opened (unique locator should be visible)`;
    await expect(this.uniqueLocator, message).toBeVisible();
  }


}
