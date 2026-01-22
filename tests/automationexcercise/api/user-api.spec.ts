import { StatusCode } from "@constants/StatusCode";
import { TestData } from "@constants/TestData";
import { expect, test } from "@fixtures/index";
import {
  ApiResponseSchema,
  UserDetailResponseSchema,
} from "@models/UserModels";
import { DataFactory } from "@utils/DataFactory";

test.describe("User API", () => {
  test("API 7: POST To Verify Login with valid details", async ({
    userService,
  }) => {
    // First create a user to ensure we have valid credentials
    const workerIndex = test.info().workerIndex;
    const user = DataFactory.generateUser({ workerIndex });
    const createResponse = await userService.createAccount(user);
    await expect(
      createResponse,
      "User creation should succeed before login verification test",
    ).toHaveStatusCode(StatusCode.OK);

    // Now verify login with the created user's credentials
    const response = await userService.verifyLogin(user.email, user.password);

    // Assert status code
    await expect(
      response,
      "POST /api/verifyLogin with valid credentials should return 200 OK",
    ).toHaveStatusCode(StatusCode.OK);

    // Validate response message
    const body = await response.json();
    expect(body.message, "Response message should confirm user exists").toBe(
      TestData.API.USER_EXISTS_MESSAGE,
    );
  });

  test("API 8: POST To Verify Login without email parameter", async ({
    userService,
  }) => {
    const response = await userService.verifyLoginWithoutEmail(
      TestData.AUTH.DUMMY_PASSWORD,
    );

    // API returns HTTP 200 and uses responseCode in body for actual status
    await expect(
      response,
      "POST /api/verifyLogin without email should return 200 OK (error encoded in body.responseCode)",
    ).toHaveStatusCode(StatusCode.OK);

    // Validate response message
    const body = await response.json();
    expect(
      body.responseCode,
      "Response code in body should be 400 Bad Request",
    ).toBe(StatusCode.BAD_REQUEST);
    expect(
      body.message,
      "Response message should indicate missing email or password parameter",
    ).toBe(TestData.API.MISSING_EMAIL_PASSWORD_MESSAGE);
  });

  test("API 9: DELETE To Verify Login", async ({ userService }) => {
    const response = await userService.deleteVerifyLogin();

    // API returns HTTP 200 and uses responseCode in body for actual status
    await expect(
      response,
      "DELETE /api/verifyLogin should return 200 OK (error encoded in body.responseCode)",
    ).toHaveStatusCode(StatusCode.OK);

    // Validate response message
    const body = await response.json();
    expect(
      body.responseCode,
      `Response code in body should be ${StatusCode.METHOD_NOT_ALLOWED}`,
    ).toBe(StatusCode.METHOD_NOT_ALLOWED);
    expect(
      body.message,
      "Response message should indicate method not supported",
    ).toBe(TestData.API.METHOD_NOT_ALLOWED_MESSAGE);
  });

  test("API 10: POST To Verify Login with invalid details", async ({
    userService,
  }) => {
    const { email, password } = TestData.AUTH.INVALID_CREDENTIALS;

    const response = await userService.verifyLogin(email, password);

    // API returns HTTP 200 and uses responseCode in body for actual status
    await expect(
      response,
      "POST /api/verifyLogin with invalid credentials should return 200 OK (error encoded in body.responseCode)",
    ).toHaveStatusCode(StatusCode.OK);

    // Validate response message
    const body = await response.json();
    expect(
      body.responseCode,
      "Response code in body should be 404 Not Found",
    ).toBe(StatusCode.NOT_FOUND);
    expect(
      body.message,
      "Response message should indicate user not found",
    ).toBe(TestData.API.USER_NOT_FOUND_MESSAGE);
  });

  test("API 11: POST To Create/Register User Account", async ({
    userService,
  }) => {
    const workerIndex = test.info().workerIndex;
    const user = DataFactory.generateUser({ workerIndex });

    const response = await userService.createAccount(user);

    // Assert status code (API may return 200 with responseCode 201 in body)
    await expect(
      response,
      "POST /api/createAccount HTTP status should be 200",
    ).toHaveStatusCode(StatusCode.OK);

    // Validate response schema
    const body = await response.json();
    const parsed = ApiResponseSchema.parse(body);

    // Assert response structure (actual API status in responseCode)
    expect(parsed.responseCode, "Response code in body should be 201").toBe(
      StatusCode.CREATED,
    );
    expect(
      parsed.message,
      "Response message should confirm user creation",
    ).toBe(TestData.API.USER_CREATED_MESSAGE);
  });

  test("API 12: DELETE METHOD To Delete User Account", async ({
    userService,
  }) => {
    // First create a user
    const workerIndex = test.info().workerIndex;
    const user = DataFactory.generateUser({ workerIndex });
    const createResponse = await userService.createAccount(user);
    await expect(
      createResponse,
      "User creation should succeed before deletion test",
    ).toHaveStatusCode(StatusCode.OK);

    // Now delete the user
    const response = await userService.deleteAccount(user.email, user.password);

    // Assert status code
    await expect(
      response,
      "DELETE /api/deleteAccount should return 200 OK",
    ).toHaveStatusCode(StatusCode.OK);

    // Validate response message
    const body = await response.json();
    expect(
      body.message,
      "Response message should confirm account deletion",
    ).toBe(TestData.API.ACCOUNT_DELETED_MESSAGE);
  });

  test("API 13: PUT METHOD To Update User Account", async ({ userService }) => {
    // First create a user
    const workerIndex = test.info().workerIndex;
    const user = DataFactory.generateUser({ workerIndex });
    const createResponse = await userService.createAccount(user);
    await expect(
      createResponse,
      "User creation should succeed before update test",
    ).toHaveStatusCode(StatusCode.OK);

    // Update user details
    const updatedUser = DataFactory.generateUser({ workerIndex });
    updatedUser.email = user.email; // Keep same email
    updatedUser.password = user.password; // Update requires correct existing password

    const response = await userService.updateAccount(updatedUser);

    // Assert status code
    await expect(
      response,
      "PUT /api/updateAccount should return 200 OK",
    ).toHaveStatusCode(StatusCode.OK);

    // Validate response message
    const body = await response.json();
    expect(body.responseCode, "Response code in body should be 200 OK").toBe(
      StatusCode.OK,
    );
    expect(body.message, "Response message should confirm user update").toBe(
      TestData.API.USER_UPDATED_MESSAGE,
    );
  });

  test("API 14: GET user account detail by email", async ({ userService }) => {
    // First create a user
    const workerIndex = test.info().workerIndex;
    const user = DataFactory.generateUser({ workerIndex });
    const createResponse = await userService.createAccount(user);
    await expect(
      createResponse,
      "User creation should succeed before getting user detail",
    ).toHaveStatusCode(StatusCode.OK);

    // Get user details by email
    const response = await userService.getUserDetailByEmail(user.email);

    // Assert status code
    await expect(
      response,
      "GET /api/getUserDetailByEmail should return 200 OK",
    ).toHaveStatusCode(StatusCode.OK);

    // Validate response schema
    const body = await response.json();
    const parsed = UserDetailResponseSchema.parse(body);

    // Assert response structure
    expect(parsed.responseCode, "Response code should be 200").toBe(
      StatusCode.OK,
    );
    expect(
      parsed.user.email,
      "User email in response should match requested email",
    ).toBe(user.email);
  });
});
