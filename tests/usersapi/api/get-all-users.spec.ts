import { test } from "../../../src/usersapi/fixtures";
// import { UniqueUsersListSchema } from "../../../src/usersapi/models/schemas";
import { UsersApiTestData } from "../../../src/usersapi/constants";

test.describe("GET /api/users - Get All Users", () => {
  test("should return 200 status with valid response time", async ({
    usersSteps,
    responseSteps,
  }) => {
    const { response, responseTime } = await responseSteps.measureResponseTime(
      () => usersSteps.getAllUsers(null),
    );

    await responseSteps.verifyStatusCode(response, 200);
    await responseSteps.verifyJsonContentType(response);
    await responseSteps.verifyResponseTime(
      responseTime,
      UsersApiTestData.EXPECTED_RESPONSE_TIME.GET_ALL_USERS,
    );
  });

  test("should return all users with valid schema", async ({ usersSteps }) => {
    await usersSteps.getAllUsers();
  });

  test("should have valid data types for all fields", async ({
    usersSteps,
  }) => {
    await usersSteps.verifyAllUsersHaveValidDataTypes();
  });

  test("FAIL: all user IDs should be unique @bug", async ({ usersSteps }) => {
    // This test will FAIL because there are duplicate user IDs in the response
    await usersSteps.verifyNoDuplicateIds();
  });

  test("should identify users without age field", async ({ usersSteps }) => {
    await usersSteps.identifyUsersWithoutAge();
  });

  test("should successfully return users without age field without errors", async ({
    usersSteps,
  }) => {
    await usersSteps.verifyUsersWithoutAgeAreValid();
  });
});
