/**
 * HTTP configuration for API clients
 * Reads from environment variables with fallback defaults
 */
export const HttpConfig = {
  /**
   * Default timeout for HTTP requests in milliseconds
   * Can be configured via API_TIMEOUT environment variable
   */
  DEFAULT_TIMEOUT: Number(process.env.API_TIMEOUT) || 30000,
} as const;
