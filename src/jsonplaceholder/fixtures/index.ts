import "../utils/api-matchers";
import { test as base, expect } from "@playwright/test";
import { JsonPlaceholderService } from "../api/services/json-placeholder.service";
import { PostSteps } from "../steps/post.steps";
import { UserSteps } from "../steps/user.steps";
import { ResponseSteps } from "../steps/response.steps";

export type JsonPlaceholderFixtures = { // No need to export this
  jsonPlaceholderService: JsonPlaceholderService;
  postSteps: PostSteps;
  userSteps: UserSteps;
  responseSteps: ResponseSteps;
};

export const test = base.extend<JsonPlaceholderFixtures>({
  jsonPlaceholderService: async ({ request }, use) => {
    await use(new JsonPlaceholderService(request));
  },
  postSteps: async ({ jsonPlaceholderService }, use) => {
    await use(new PostSteps(jsonPlaceholderService));
  },
  userSteps: async ({ jsonPlaceholderService }, use) => {
    await use(new UserSteps(jsonPlaceholderService));
  },
  responseSteps: async ({}, use) => {
    await use(new ResponseSteps());
  },
});

export { expect }; // What is this?
