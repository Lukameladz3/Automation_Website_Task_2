/**
 * Centralized test data constants
 * Following Guidelines.md §4 (Configuration Management)
 * 
 * All hardcoded test values should be moved here for:
 * - Better maintainability
 * - Easy test data updates
 * - Consistent test values across tests
 */

export const TestData = {
    /**
     * API response messages for assertions
     */
    API: {
        /** Account deleted message */
        ACCOUNT_DELETED_MESSAGE: 'Account deleted!',
        /** Account not found message (for idempotent cleanup) */
        ACCOUNT_NOT_FOUND_MESSAGE: 'Account not found!',
        /** Method not allowed error message */
        METHOD_NOT_ALLOWED_MESSAGE: 'This request method is not supported.',
        /** Missing email or password parameter error message */
        MISSING_EMAIL_PASSWORD_MESSAGE: 'Bad request, email or password parameter is missing in POST request.',
        /** Missing search_product parameter error message */
        MISSING_SEARCH_PRODUCT_MESSAGE: 'Bad request, search_product parameter is missing in POST request.',
        /** User created message */
        USER_CREATED_MESSAGE: 'User created!',
        /** User exists message */
        USER_EXISTS_MESSAGE: 'User exists!',
        /** User not found message */
        USER_NOT_FOUND_MESSAGE: 'User not found!',
        /** User updated message */
        USER_UPDATED_MESSAGE: 'User updated!',
    },

    /**
     * Auth-related constants for API negative/edge-case tests
     */
    AUTH: {
        /** Dummy password value used for negative tests */
        DUMMY_PASSWORD: 'somepassword',
        /** Invalid credentials used for negative tests */
        INVALID_CREDENTIALS: {
            email: 'invaliduser@example.com',
            password: 'invalidpassword',
        },
    },

    /**
     * Product brands for filtering tests
     */
    BRANDS: {
        /** H&M brand */
        H_AND_M: {
            expectedTitle: 'Brand - H&M Products',
            name: 'H&M',
        },
        /** Polo brand */
        POLO: {
            expectedTitle: 'Brand - Polo Products',
            name: 'Polo',
        },
    },

    /**
     * Product categories for filtering tests
     */
    CATEGORIES: {
        /** Men > Jeans category */
        MEN_JEANS: {
            category: 'Men',
            expectedTitle: 'Men - Jeans Products',
            subcategory: 'Jeans',
        },
        /** Women > Dress category */
        WOMEN_DRESS: {
            category: 'Women',
            expectedTitle: 'Women - Dress Products',
            subcategory: 'Dress',
        },
    },

    /**
     * Checkout and order data
     */
    CHECKOUT: {
        /** Test order comment */
        ORDER_COMMENT: 'Test Order for Automation Task',
    },

    /**
     * Contact form test data
     */
    CONTACT: {
        /** Expected success message */
        SUCCESS_MESSAGE: 'Success! Your details have been submitted successfully.',
        /** Valid contact form data */
        VALID_SUBMISSION: {
            message: 'This is an automated test message to verify the contact form functionality. The message contains more than 50 characters as required for testing purposes.',
            name: 'Test User Contact',
            subject: 'Test Inquiry - Automated',
        },
    },

    /**
     * Payment information for checkout tests
     */
    PAYMENT: {
        /** Test credit card number (Visa test card) */
        CARD_NUMBER: '4111 1111 1111 1111',
        /** Card CVV code */
        CVV: '123',
        /** Card expiry month (MM format) */
        EXPIRY_MONTH: '12',
        /** Card expiry year (YYYY format) */
        EXPIRY_YEAR: '2025',
    },

    /**
     * Search terms for product search tests
     */
    SEARCH: {
        /** Invalid search term that returns no results */
        INVALID_TERM: 'XYZ123NOTFOUND',
        /** Valid search term that returns results */
        VALID_TERM_1: 'T-Shirt',
        /** Alternative valid search term */
        VALID_TERM_2: 'Jeans',
    },
} as const;
