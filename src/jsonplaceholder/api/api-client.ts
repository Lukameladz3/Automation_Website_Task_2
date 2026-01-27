import { APIRequestContext, APIResponse } from "@playwright/test";
import { HttpConfig } from "../../config/http-config";

export class ApiClient {
  constructor(protected readonly request: APIRequestContext) {}

  protected async get(
    url: string,
    options?: Parameters<APIRequestContext["get"]>[1],
  ): Promise<APIResponse> {
    return this.request.get(url, {
      timeout: HttpConfig.DEFAULT_TIMEOUT,
      ...options,
    });
  }

  protected async post(
    url: string,
    options?: Parameters<APIRequestContext["post"]>[1],
  ): Promise<APIResponse> {
    return this.request.post(url, {
      timeout: HttpConfig.DEFAULT_TIMEOUT,
      ...options,
    });
  }

  protected async put(
    url: string,
    options?: Parameters<APIRequestContext["put"]>[1],
  ): Promise<APIResponse> {
    return this.request.put(url, {
      timeout: HttpConfig.DEFAULT_TIMEOUT,
      ...options,
    });
  }

  protected async delete(
    url: string,
    options?: Parameters<APIRequestContext["delete"]>[1],
  ): Promise<APIResponse> {
    return this.request.delete(url, {
      timeout: HttpConfig.DEFAULT_TIMEOUT,
      ...options,
    });
  }
}
