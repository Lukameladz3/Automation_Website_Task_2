import "../utils/api-matchers";
import { test as base, expect } from "@playwright/test";
import { UsersApiService } from "../api/services";
import { UsersSteps } from "../steps/users.steps";
import { ResponseSteps } from "../steps/response.steps";

/**
 * Custom fixtures for Users API testing
 * Provides dependency injection for services and step classes
 */
export type UsersApiFixtures = {
  usersApiService: UsersApiService;
  usersSteps: UsersSteps;
  responseSteps: ResponseSteps;
};

export const test = base.extend<UsersApiFixtures>({
  usersApiService: async ({ request }, use) => {
    await use(new UsersApiService(request));
  },
  usersSteps: async ({ usersApiService }, use) => {
    await use(new UsersSteps(usersApiService));
  },
  responseSteps: async ({}, use) => {
    await use(new ResponseSteps());
  },
});

export { expect };
