import { expect } from '@playwright/test';
import { StatusCode } from '@constants/StatusCode';
import { TestData } from '@constants/TestData';
import { ApiResponseSchema, User, UserDetailResponse, UserDetailResponseSchema } from '@models/UserModels';
import { retry, RetryableError } from '@utils/Retry';
import { step } from '@utils/StepDecorator';
import { UserService } from '../Services/UserService';

/**
 * UserApiSteps - API operations for user management
 * Used for faster test data setup/teardown compared to UI operations
 */
export class UserApiSteps {
    constructor(private userService: UserService) {}

    /**
     * Create and verify user account via API
     * @param user User data object
     * @returns Created user data (same as input)
     */
    @step('API: Create and verify user account')
    async createAndVerifyUser(user: User): Promise<User> {
        const response = await retry(async (attempt) => {
            const res = await this.userService.createAccount(user);
            const status = res.status();
            if ([StatusCode.INTERNAL_SERVER_ERROR, 502, 503, 504].includes(status)) {
                const body = await res.json().catch(() => undefined);
                throw new RetryableError(
                    `Transient API error (attempt ${attempt}): status=${status}, body=${JSON.stringify(body)}`
                );
            }
            return res;
        });

        await expect(
            response,
            `Create user API should return HTTP 200, got ${response.status()}`
        ).toHaveStatusCode(StatusCode.OK);

        const body = await response.json();
        const parsed = ApiResponseSchema.safeParse(body);
        expect(
            parsed.success,
            `Create user response schema validation should succeed.\nIssues: ${
                parsed.success ? 'none' : JSON.stringify(parsed.error.issues)
            }`
        ).toBeTruthy();
        if (!parsed.success) {
            throw parsed.error;
        }

        await expect(
            parsed.data.responseCode,
            `User creation should return responseCode 201, got ${parsed.data.responseCode}`
        ).toHaveStatusCode(StatusCode.CREATED);
        expect(
            parsed.data.message,
            'User creation message should match expected value'
        ).toBe(TestData.API.USER_CREATED_MESSAGE);

        return user;
    }

    /**
     * Delete a user account via API
     * @param email User email
     * @param password User password
     */
    @step('API: Delete user account')
    async deleteUser(email: string, password: string): Promise<void> {
        const response = await retry(async (attempt) => {
            const res = await this.userService.deleteAccount(email, password);
            const status = res.status();
            if ([StatusCode.INTERNAL_SERVER_ERROR, 502, 503, 504].includes(status)) {
                const body = await res.json().catch(() => undefined);
                throw new RetryableError(
                    `Transient API error (attempt ${attempt}): status=${status}, body=${JSON.stringify(body)}`
                );
            }
            return res;
        });

        await expect(
            response,
            `Delete user API should return HTTP 200, got ${response.status()}`
        ).toHaveStatusCode(StatusCode.OK);

        const body = await response.json().catch(() => undefined);
        // Idempotent cleanup: API may reply "Account not found!" if already deleted.
        if (body?.message === TestData.API.ACCOUNT_DELETED_MESSAGE || body?.message === TestData.API.ACCOUNT_NOT_FOUND_MESSAGE) {
            return;
        }

        expect(
            body?.message,
            'Account deletion message should match expected value'
        ).toBe(TestData.API.ACCOUNT_DELETED_MESSAGE);
    }

    /**
     * Verify login credentials via API
     * @param email User email
     * @param password User password
     * @returns true if login is valid, false otherwise
     */
    @step('API: Verify login credentials')
    async isLoginValid(email: string, password: string): Promise<boolean> {
        const response = await this.userService.verifyLogin(email, password);

        const body = await response.json();
        
        if (response.status() === StatusCode.OK && body.message === TestData.API.USER_EXISTS_MESSAGE) {
            return true;
        }
        return false;
    }

    /**
     * Verify and get user details via API
     * @param email User email
     * @returns User detail response
     */
    @step('API: Verify and get user details by email')
    async verifyAndGetUserDetailByEmail(email: string): Promise<UserDetailResponse> {
        const response = await this.userService.getUserDetailByEmail(email);

        // Assert HTTP status
        await expect(
            response,
            `Get user detail API should return HTTP 200, got ${response.status()}`
        ).toHaveStatusCode(StatusCode.OK);

        // Validate response schema
        const body = await response.json();
        const parsed = UserDetailResponseSchema.safeParse(body);
        expect(
            parsed.success,
            `User detail response schema validation should succeed.\nIssues: ${
                parsed.success ? 'none' : JSON.stringify(parsed.error.issues)
            }`
        ).toBeTruthy();
        if (!parsed.success) {
            throw parsed.error;
        }

        return parsed.data;
    }
}


