import { APIRequestContext, APIResponse } from "@playwright/test";

export class ApiClient {
  constructor(protected readonly request: APIRequestContext) {}

  private static readonly DEFAULT_TIMEOUT_MS = 30_000; // Pascal case only for env vars or global constants, this can be env or config

  protected async get(
    url: string,
    options?: Parameters<APIRequestContext["get"]>[1]
  ): Promise<APIResponse> {
    return this.request.get(url, {
      timeout: ApiClient.DEFAULT_TIMEOUT_MS, // Can be this instead of static
      ...options,
    });
  }

  protected async post(
    url: string,
    options?: Parameters<APIRequestContext["post"]>[1]
  ): Promise<APIResponse> {
    return this.request.post(url, {
      timeout: ApiClient.DEFAULT_TIMEOUT_MS,
      ...options,
    });
  }

  protected async put(
    url: string,
    options?: Parameters<APIRequestContext["put"]>[1]
  ): Promise<APIResponse> {
    return this.request.put(url, {
      timeout: ApiClient.DEFAULT_TIMEOUT_MS,
      ...options,
    });
  }

  protected async delete(
    url: string,
    options?: Parameters<APIRequestContext["delete"]>[1]
  ): Promise<APIResponse> {
    return this.request.delete(url, {
      timeout: ApiClient.DEFAULT_TIMEOUT_MS,
      ...options,
    });
  }
}
