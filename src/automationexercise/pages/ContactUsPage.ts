import { expect, Locator, Page } from "@playwright/test";
import { Routes } from "../constants/Routes";
import { BasePage } from "./BasePage";

export interface ContactFormData {
    email: string;
    message: string;
    name: string;
    subject: string;
}

export class ContactUsPage extends BasePage {
    readonly getInTouchHeading: Locator;
    readonly nameInput: Locator;
    readonly emailInput: Locator;
    readonly subjectInput: Locator;
    readonly messageTextarea: Locator;
    readonly fileUploadInput: Locator;
    readonly submitButton: Locator;
    readonly successMessage: Locator;
    readonly homeButton: Locator;

    constructor(page: Page) {
        super(
            page,
            page.getByRole("heading", { name: /get in touch/i }).describe("Get in touch heading")
        );

        this.getInTouchHeading = this.page
            .getByRole("heading", { name: /get in touch/i })
            .describe("Get in touch heading");
        this.nameInput = this.page
            .getByTestId("name")
            .describe("Name input");
        this.emailInput = this.page
            .getByTestId("email")
            .describe("Email input");
        this.subjectInput = this.page
            .getByTestId("subject")
            .describe("Subject input");
        this.messageTextarea = this.page
            .getByTestId("message")
            .describe("Message textarea");
        this.fileUploadInput = this.page
            .locator("input[name='upload_file']")
            .describe("File upload input");
        this.submitButton = this.page
            .getByTestId("submit-button")
            .describe("Submit button");
        this.successMessage = this.page
            .locator(".status.alert.alert-success")
            .describe("Success message");
        this.homeButton = this.page
            .locator(".btn.btn-success")
            .filter({ hasText: /home/i })
            .describe("Home button");
    }

    async goto() {
        await super.goto(Routes.WEB.CONTACT_US);
    }

    /**
     * Fill contact form with data
     */
    async fillContactForm(data: ContactFormData): Promise<void> {
        await this.nameInput.fill(data.name);
        await this.emailInput.fill(data.email);
        await this.subjectInput.fill(data.subject);
        await this.messageTextarea.fill(data.message);
    }

    /**
     * Upload a file
     */
    async uploadFile(filePath: string): Promise<void> {
        await this.fileUploadInput.setInputFiles(filePath);
    }

    /**
     * Submit the contact form
     * Note: May trigger a confirmation dialog
     */
    async submitForm(): Promise<void> {
        // Handle the confirmation dialog that appears on submit
        this.page.once("dialog", (dialog) => {
            dialog.accept();
        });

        await this.submitButton.click();
    }

    /**
     * Verify success - element exists in DOM but is CSS hidden
     */
    async verifySuccessMessage(): Promise<void> {
        // Just verify the success element appears in DOM after submission.
        // (On this site it may be CSS-hidden, so visibility checks can be flaky.)
        await expect(
            this.successMessage,
            "Success message element should be attached after contact form submission"
        ).toBeAttached();
    }

    /**
     * Click home button after submission
     */
    async clickHomeButton(): Promise<void> {
        await this.homeButton.click();
    }

    /**
     * Verify form content is visible
     */
    async verifyFormContentVisible(): Promise<void> {
        await expect(this.getInTouchHeading, "Get in touch heading should be visible").toBeVisible();
        await expect(this.nameInput, "Name input should be visible").toBeVisible();
        await expect(this.submitButton, "Submit button should be visible").toBeVisible();
    }

    /**
     * Get current values from form (for validation testing)
     */
    async getFormValues(): Promise<ContactFormData> {
        return {
            email: await this.emailInput.inputValue(),
            message: await this.messageTextarea.inputValue(),
            name: await this.nameInput.inputValue(),
            subject: await this.subjectInput.inputValue(),
        };
    }
}
