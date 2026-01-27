import { expect } from "@playwright/test";
import { JsonPlaceholderService } from "../api/services/json-placeholder.service";
import * as UserTypes from "../models/schemas/user.schemas";
import { step } from "../utils/step-decorator";

/**
 * Steps for User API operations.
 * Handles user retrieval and user-specific validations.
 */
export class UserSteps {
  constructor(private service: JsonPlaceholderService) {}

  // ==================== API Call Steps - Validated Methods ====================

  @step("Get all users")
  async getAllUsers(): Promise<UserTypes.User[]> {
    return await this.service.getAllUsers();
  }

  @step("Get user by ID")
  async getUser(userId: number): Promise<UserTypes.User> {
    return await this.service.getUserById(userId);
  }

  // ==================== Verification Steps ====================

  @step("Verify user basic info")
  async verifyUserBasicInfo(
    user: UserTypes.User,
    expected: {
      id?: number;
      name?: string;
      username?: string;
      email?: string;
      phone?: string;
      website?: string;
    },
  ): Promise<void> {
    const hasExpectedValues = Object.values(expected).some(
      (value) => value !== undefined,
    );
    expect(
      hasExpectedValues,
      "At least one expected value must be provided for verification",
    ).toBe(true);

    if (expected.id !== undefined) {
      expect(user.id, "User ID mismatch").toBe(expected.id);
    }
    if (expected.name !== undefined) {
      expect(user.name, "User name mismatch").toBe(expected.name);
    }
    if (expected.username !== undefined) {
      expect(user.username, "Username mismatch").toBe(expected.username);
    }
    if (expected.email !== undefined) {
      expect(user.email, "Email mismatch").toBe(expected.email);
    }
    if (expected.phone !== undefined) {
      expect(user.phone, "Phone mismatch").toBe(expected.phone);
    }
    if (expected.website !== undefined) {
      expect(user.website, "Website mismatch").toBe(expected.website);
    }
  }

  @step("Verify user address")
  async verifyUserAddress(
    user: UserTypes.User,
    expected: {
      street?: string;
      suite?: string;
      city?: string;
      zipcode?: string;
    },
  ): Promise<void> {
    const hasExpectedValues = Object.values(expected).some(
      (value) => value !== undefined,
    );
    expect(
      hasExpectedValues,
      "At least one expected value must be provided for verification",
    ).toBe(true);

    if (expected.street !== undefined) {
      expect(user.address.street, "Street mismatch").toBe(expected.street);
    }
    if (expected.suite !== undefined) {
      expect(user.address.suite, "Suite mismatch").toBe(expected.suite);
    }
    if (expected.city !== undefined) {
      expect(user.address.city, "City mismatch").toBe(expected.city);
    }
    if (expected.zipcode !== undefined) {
      expect(user.address.zipcode, "Zipcode mismatch").toBe(expected.zipcode);
    }
  }

  @step("Verify user geo coordinates")
  async verifyUserGeo(
    user: UserTypes.User,
    expected: { lat?: string; lng?: string },
  ): Promise<void> {
    const hasExpectedValues = Object.values(expected).some(
      (value) => value !== undefined,
    );
    expect(
      hasExpectedValues,
      "At least one expected value must be provided for verification",
    ).toBe(true);

    if (expected.lat !== undefined) {
      expect(user.address.geo.lat, "Latitude mismatch").toBe(expected.lat);
    }
    if (expected.lng !== undefined) {
      expect(user.address.geo.lng, "Longitude mismatch").toBe(expected.lng);
    }
  }

  @step("Verify user company")
  async verifyUserCompany(
    user: UserTypes.User,
    expected: { name?: string; catchPhrase?: string; bs?: string },
  ): Promise<void> {
    const hasExpectedValues = Object.values(expected).some(
      (value) => value !== undefined,
    );
    expect(
      hasExpectedValues,
      "At least one expected value must be provided for verification",
    ).toBe(true);

    if (expected.name !== undefined) {
      expect(user.company.name, "Company name mismatch").toBe(expected.name);
    }
    if (expected.catchPhrase !== undefined) {
      expect(user.company.catchPhrase, "CatchPhrase mismatch").toBe(
        expected.catchPhrase,
      );
    }
    if (expected.bs !== undefined) {
      expect(user.company.bs, "BS mismatch").toBe(expected.bs);
    }
  }

  @step("Verify users have valid geo coordinates")
  async verifyUsersGeoCoordinates(
    users: UserTypes.User[],
    latMin: number,
    latMax: number,
    lngMin: number,
    lngMax: number,
  ): Promise<void> {
    for (const user of users) {
      const lat = parseFloat(user.address.geo.lat);
      const lng = parseFloat(user.address.geo.lng);

      expect(
        lat >= latMin && lat <= latMax,
        `User ${user.id} latitude ${lat} should be between ${latMin} and ${latMax}`,
      ).toBe(true);

      expect(
        lng >= lngMin && lng <= lngMax,
        `User ${user.id} longitude ${lng} should be between ${lngMin} and ${lngMax}`,
      ).toBe(true);
    }
  }

  @step("Verify users match")
  async verifyUsersMatch(
    user1: UserTypes.User,
    user2: UserTypes.User,
  ): Promise<void> {
    expect(user1).toEqual(user2);
  }
}
