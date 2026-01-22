import { faker } from "@faker-js/faker";

/**
 * RandomDataGenerator - Utility for generating random test data for API tests.
 * Focused on JSONPlaceholder API testing needs.
 */
export class RandomDataGenerator {
  /**
   * Generate a random post title
   * @param wordCount Number of words in the title (default: 3-6)
   */
  static postTitle(wordCount?: number): string {
    return faker.lorem
      .sentence(wordCount ?? faker.number.int({ min: 3, max: 6 }))
      .slice(0, -1);
  }

  /**
   * Generate a random post body/content
   * @param paragraphCount Number of paragraphs (default: 2-4)
   */
  static postBody(paragraphCount?: number): string {
    return faker.lorem.paragraphs(
      paragraphCount ?? faker.number.int({ min: 2, max: 4 })
    );
  }

  /**
   * Generate a random user ID
   * @param min Minimum user ID (default: 1)
   * @param max Maximum user ID (default: 10)
   */
  static userId(min: number = 1, max: number = 10): number {
    return faker.number.int({ min, max });
  }

  /**
   * Generate a random integer between min and max (inclusive)
   */
  static integer(min: number, max: number): number {
    return faker.number.int({ max, min });
  }

  /**
   * Set seed for deterministic random data generation
   * Useful for reproducible tests
   */
  static setSeed(seed: number): void {
    faker.seed(seed);
  }

  /**
   * Reset seed to random generation
   */
  static resetSeed(): void {
    faker.seed();
  }
}
