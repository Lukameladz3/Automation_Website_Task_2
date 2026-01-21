import { faker } from "@faker-js/faker";

/**
 * RandomDataGenerator - Centralized utility for all random data generation
 *
 * This class provides a single entry point for generating random test data.
 * It abstracts the underlying random data library (faker.js) to allow easy replacement
 * or modification of data generation logic without affecting the rest of the codebase.
 *
 * Benefits:
 * - Single Responsibility: All random data generation in one place
 * - Easy Library Replacement: Change faker to another package by updating only this file
 * - Consistent Prefixing: Add test data prefixes/suffixes in one location
 * - Testability: Can be easily mocked for deterministic tests
 *
 * @example
 * const email = RandomDataGenerator.email('John', 'Doe');
 * const password = RandomDataGenerator.password(12);
 * const firstName = RandomDataGenerator.firstName();
 */
export class RandomDataGenerator {
  /**
   * Generate a random first name
   */
  static firstName(): string {
    return faker.person.firstName();
  }

  /**
   * Generate a random last name
   */
  static lastName(): string {
    return faker.person.lastName();
  }

  /**
   * Generate a random full name
   */
  static fullName(): string {
    return faker.person.fullName();
  }

  /**
   * Generate a random email address
   * @param firstName Optional first name for the email
   * @param lastName Optional last name for the email
   * @param provider Optional email provider domain
   */
  static email(
    firstName?: string,
    lastName?: string,
    provider?: string,
  ): string {
    return faker.internet.email({ firstName, lastName, provider });
  }

  /**
   * Generate a unique email address with random suffix
   * Useful for ensuring email uniqueness across test runs
   */
  static uniqueEmail(firstName?: string, lastName?: string): string {
    const uniqueSuffix = this.alphanumeric(8);
    return this.email(firstName, lastName, `test${uniqueSuffix}.com`);
  }

  /**
   * Generate a unique email address that includes the Playwright worker index.
   * This helps ensure each worker uses distinct credentials in parallel runs.
   */
  static uniqueEmailForWorker(
    workerIndex: number,
    firstName?: string,
    lastName?: string,
  ): string {
    const uniqueSuffix = this.alphanumeric(8);
    return this.email(
      firstName,
      lastName,
      `w${workerIndex}-test${uniqueSuffix}.com`,
    );
  }

  /**
   * Generate a random password
   * @param length Password length (default: 10)
   */
  static password(length: number = 10): string {
    return faker.internet.password({ length });
  }

  /**
   * Generate a random alphanumeric string
   * @param length String length
   */
  static alphanumeric(length: number): string {
    return faker.string.alphanumeric(length);
  }

  /**
   * Generate a random company name
   */
  static companyName(): string {
    return faker.company.name();
  }

  /**
   * Generate a random street address
   */
  static streetAddress(): string {
    return faker.location.streetAddress();
  }

  /**
   * Generate a random secondary address (apartment, suite, etc.)
   */
  static secondaryAddress(): string {
    return faker.location.secondaryAddress();
  }

  /**
   * Generate a random state name
   */
  static state(): string {
    return faker.location.state();
  }

  /**
   * Generate a random city name
   */
  static city(): string {
    return faker.location.city();
  }

  /**
   * Generate a random zip/postal code
   */
  static zipCode(): string {
    return faker.location.zipCode();
  }

  /**
   * Generate a random phone number
   */
  static phoneNumber(): string {
    return faker.phone.number();
  }

  /**
   * Generate a random month name
   */
  static monthName(): string {
    return faker.date.month();
  }

  /**
   * Generate a random integer between min and max (inclusive)
   * @param min Minimum value
   * @param max Maximum value
   */
  static integer(min: number, max: number): number {
    return faker.number.int({ max, min });
  }

  /**
   * Generate a random credit card number
   */
  static creditCardNumber(): string {
    return faker.finance.creditCardNumber();
  }

  /**
   * Generate a random CVV/CVC code
   */
  static creditCardCVV(): string {
    return faker.finance.creditCardCVV();
  }

  /**
   * Pick a random element from an array
   * @param array Array to pick from
   */
  static arrayElement<T>(array: T[]): T {
    return faker.helpers.arrayElement(array);
  }

  /**
   * Generate a random order comment/description
   * Useful for order notes, delivery instructions, etc.
   */
  static orderComment(): string {
    return faker.lorem.sentence();
  }

  /**
   * Generate a padded number string
   * @param value Number to pad
   * @param length Target length
   * @param padChar Character to pad with (default: '0')
   */
  static paddedNumber(
    value: number,
    length: number,
    padChar: string = "0",
  ): string {
    return String(value).padStart(length, padChar);
  }

  /**
   * Set seed for deterministic random data generation
   * Useful for reproducible tests
   * @param seed Seed value
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
      paragraphCount ?? faker.number.int({ min: 2, max: 4 }),
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
}
