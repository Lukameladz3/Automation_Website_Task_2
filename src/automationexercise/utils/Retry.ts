export class RetryableError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'RetryableError';
    }
}

export interface RetryOptions {
    attempts?: number;
    baseDelayMs?: number;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
    attempts: 3,
    baseDelayMs: 300,
};

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry an async operation when it throws RetryableError.
 * - Non-retryable errors are re-thrown immediately
 * - Uses linear backoff: baseDelayMs * attempt
 */
export async function retry<T>(
    operation: (attempt: number) => Promise<T>,
    options?: RetryOptions
): Promise<T> {
    const { attempts, baseDelayMs } = { ...DEFAULT_OPTIONS, ...options };
    let lastError: unknown;

    for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
            return await operation(attempt);
        } catch (error) {
            lastError = error;
            const isRetryable = error instanceof RetryableError;
            if (!isRetryable || attempt === attempts) {
                throw error;
            }
            await delay(baseDelayMs * attempt);
        }
    }

    // Should be unreachable due to throw above, but keeps TS happy.
    throw lastError;
}


