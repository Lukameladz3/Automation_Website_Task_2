import { test, expect } from "@jsonplaceholder/fixtures/index";
import { UserTestData } from "@test-data/jsonplaceholder";

test.describe("JSONPlaceholder API - GET Users and Data Consistency", () => {
  test("TC 4.1: Get All Users - Status 200, exactly 10 users", async ({
    userSteps,
  }) => {
    // Service now returns validated data directly
    const users = await userSteps.getAllUsers();
    expect(users.length).toBe(UserTestData.TOTAL_USERS_COUNT);
  });

  test("TC 4.2: Deep Data User 5 - Verify nested Address, Geo, Company structure", async ({
    userSteps,
  }) => {
    const userData = UserTestData.USER_5;

    // Service now returns validated data directly
    const user = await userSteps.getUser(UserTestData.TEST_USER_ID);

    // Verify basic info
    await userSteps.verifyUserBasicInfo(user, {
      id: userData.ID,
      name: userData.NAME,
      username: userData.USERNAME,
      email: userData.EMAIL,
      phone: userData.PHONE,
      website: userData.WEBSITE,
    });

    // Verify address
    await userSteps.verifyUserAddress(user, {
      street: userData.ADDRESS.STREET,
      suite: userData.ADDRESS.SUITE,
      city: userData.ADDRESS.CITY,
      zipcode: userData.ADDRESS.ZIPCODE,
    });

    // Verify geo coordinates
    await userSteps.verifyUserGeo(user, {
      lat: userData.ADDRESS.GEO.LAT,
      lng: userData.ADDRESS.GEO.LNG,
    });

    // Verify company
    await userSteps.verifyUserCompany(user, {
      name: userData.COMPANY.NAME,
      catchPhrase: userData.COMPANY.CATCH_PHRASE,
      bs: userData.COMPANY.BS,
    });
  });

  test("TC 4.3: Data Range - Verify geo.lat (-90 to 90), geo.lng (-180 to 180)", async ({
    userSteps,
  }) => {
    // Service now returns validated data directly
    const users = await userSteps.getAllUsers();

    const geoRanges = UserTestData.GEO_RANGES;
    await userSteps.verifyUsersGeoCoordinates(
      users,
      geoRanges.LAT_MIN,
      geoRanges.LAT_MAX,
      geoRanges.LNG_MIN,
      geoRanges.LNG_MAX,
    );
  });

  test("TC 5.1: Cross-Check User 5 - Compare /users/5 with /users list", async ({
    userSteps,
  }) => {
    const testUserId = UserTestData.TEST_USER_ID;

    // Get all users - returns validated data
    const allUsers = await userSteps.getAllUsers();

    // Find user in the list
    const userFromList = allUsers.find((user) => user.id === testUserId);
    expect(
      userFromList,
      `User ${testUserId} should be found in the /users list`,
    ).toBeDefined();

    // Get user directly - returns validated data
    const userDirect = await userSteps.getUser(testUserId);

    // Compare - they must be identical
    await userSteps.verifyUsersMatch(userDirect, userFromList!);
  });

  test("TC 5.2: Relational Check - Verify User 5's posts exist and belong to User 5", async ({
    userSteps,
    postSteps,
  }) => {
    const testUserId = UserTestData.TEST_USER_ID;

    // Confirm user exists - returns validated data
    const user = await userSteps.getUser(testUserId);
    await userSteps.verifyUserBasicInfo(user, { id: testUserId });

    // Fetch posts for user - returns validated data
    const posts = await postSteps.getPostsByUserId(testUserId);

    // Verify posts exist and belong to user
    expect(
      posts.length,
      `User ${testUserId} should have posts`,
    ).toBeGreaterThan(0);
    await postSteps.verifyAllPostsBelongToUser(posts, testUserId);
  });
});
