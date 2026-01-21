import fs from "fs";
import path from "path";
import { test } from '@fixtures/index';

test.describe("TC10: Contact Form Submission with File Upload", () => {
    // Create test file before tests
    test.beforeAll(async () => {
        const testFilePath = path.join(process.cwd(), "test-data", "test-file.txt");
        const testFileDir = path.dirname(testFilePath);

        fs.mkdirSync(testFileDir, { recursive: true });

        fs.writeFileSync(testFilePath, "This is a test file for contact form upload.");
    });

    test("should submit contact form with file attachment", async ({
        authedUser,
        contactUsPage,
        homePage,
    }) => {
        const testFilePath = path.join(process.cwd(), "test-data", "test-file.txt");

        const contactData = {
            email: authedUser.email,
            message: "This is a test message for the contact form. It contains more than 50 characters to ensure proper validation.",
            name: authedUser.name,
            subject: "Test Inquiry",
        };

        // Navigate to contact us page
        await homePage.goto();
        await homePage.clickContactUs();
        await contactUsPage.verifyPageOpened();
        await contactUsPage.verifyFormContentVisible();

        // Fill contact form
        await contactUsPage.fillContactForm(contactData);

        // Upload file attachment
        await contactUsPage.uploadFile(testFilePath);
    });
});
