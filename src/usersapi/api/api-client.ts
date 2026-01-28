import { APIRequestContext, APIResponse } from "@playwright/test";
import { HttpConfig } from "../../config/http-config";

/**
 * Base API client for making HTTP requests
 * Provides protected methods for common HTTP operations
 */
export class ApiClient {
  constructor(protected readonly request: APIRequestContext) {}

  /**
   * Performs a GET request
   */
  protected async get(
    url: string,
    options?: { timeout?: number },
  ): Promise<APIResponse> {
    return this.request.get(url, {
      timeout: options?.timeout ?? HttpConfig.DEFAULT_TIMEOUT,
    });
  }

  /**
   * Performs a POST request
   */
  protected async post(
    url: string,
    data?: unknown,
    options?: { timeout?: number },
  ): Promise<APIResponse> {
    return this.request.post(url, {
      data,
      timeout: options?.timeout ?? HttpConfig.DEFAULT_TIMEOUT,
    });
  }

  /**
   * Performs a PUT request
   */
  protected async put(
    url: string,
    data?: unknown,
    options?: { timeout?: number },
  ): Promise<APIResponse> {
    return this.request.put(url, {
      data,
      timeout: options?.timeout ?? HttpConfig.DEFAULT_TIMEOUT,
    });
  }

  /**
   * Performs a DELETE request
   */
  protected async delete(
    url: string,
    options?: { timeout?: number },
  ): Promise<APIResponse> {
    return this.request.delete(url, {
      timeout: options?.timeout ?? HttpConfig.DEFAULT_TIMEOUT,
    });
  }
}
