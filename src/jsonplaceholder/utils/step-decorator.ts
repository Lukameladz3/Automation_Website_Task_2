import { test } from "@playwright/test";

/**
 * Decorator that wraps a method in a Playwright test.step
 * Supports both standard (Stage 3) and legacy experimental decorators.
 * @param stepName The name of the step to display in the test report
 */
export function step(stepName: string): any {
  return function (
    target: any,
    context?: any,
    descriptor?: PropertyDescriptor
  ) {
    // Standard Decorator (Stage 3) - called with (value, context)
    if (
      typeof context === "object" &&
      context &&
      "kind" in context &&
      context.kind === "method"
    ) {
      const originalMethod = target;
      return async function (this: any, ...args: any[]) {
        return await test.step(stepName, async () => {
          return await originalMethod.apply(this, args);
        });
      };
    }

    // Legacy/Experimental Decorator - called with (target, propertyKey, descriptor)
    if (descriptor) {
      const originalMethod = descriptor.value;
      descriptor.value = async function (...args: any[]) {
        return await test.step(stepName, async () => {
          return await originalMethod.apply(this, args);
        });
      };
      return descriptor;
    }

    throw new Error(
      `@step decorator used with unsupported signature. Args: ${arguments.length}`
    );
  };
}
