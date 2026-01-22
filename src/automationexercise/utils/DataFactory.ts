import { PaymentDetails } from "../models/PaymentModels";
import { User } from "../models/UserModels";
import { RandomDataGenerator } from "./RandomDataGenerator";

/**
 * DataFactory - Factory for generating test data objects
 *
 * This class uses RandomDataGenerator to create complete test data objects.
 * All random data generation is delegated to RandomDataGenerator,
 * keeping this factory focused on business logic and data structure.
 */
export class DataFactory {
  /**
   * Generate a complete User object with random data
   */
  static generateUser(options?: { workerIndex?: number }): User {
    const firstName = RandomDataGenerator.firstName();
    const lastName = RandomDataGenerator.lastName();

    return {
      address1: RandomDataGenerator.streetAddress(),
      address2: RandomDataGenerator.secondaryAddress(),
      birthDay: String(RandomDataGenerator.integer(1, 28)),
      birthMonth: RandomDataGenerator.monthName(),
      birthYear: String(RandomDataGenerator.integer(1980, 2000)),
      city: RandomDataGenerator.city(),
      company: RandomDataGenerator.companyName(),
      country: "United States",
      email: typeof options?.workerIndex === "number"
        ? RandomDataGenerator.uniqueEmailForWorker(options.workerIndex, firstName, lastName)
        : RandomDataGenerator.uniqueEmail(firstName, lastName),
      firstName, lastName,
      mobileNumber: RandomDataGenerator.phoneNumber(),
      name: `${firstName} ${lastName}`,
      password: RandomDataGenerator.password(10),
      // Fixed for dropdown selection
      state: RandomDataGenerator.state(),
      title: RandomDataGenerator.arrayElement(["Mr", "Mrs"]),
      zipcode: RandomDataGenerator.zipCode(),
    };
  }

  /**
   * Generate payment details with random data
   */
  static generatePaymentDetails(): PaymentDetails {
    return {
      cardNumber: RandomDataGenerator.creditCardNumber(),
      cvc: RandomDataGenerator.creditCardCVV(),
      expiryMonth: RandomDataGenerator.paddedNumber(
        RandomDataGenerator.integer(1, 12),
        2,
      ),
      expiryYear: String(RandomDataGenerator.integer(2025, 2030)),
      nameOnCard: RandomDataGenerator.fullName(),
    };
  }

  /**
   * Generate a random order comment/description
   */
  static generateOrderComment(): string {
    return RandomDataGenerator.orderComment();
  }

  /**
   * Set seed for deterministic data generation
   * @param seed Seed value
   */
  static setSeed(seed: number): void {
    RandomDataGenerator.setSeed(seed);
  }

  /**
   * Reset seed to random generation
   */
  static resetSeed(): void {
    RandomDataGenerator.resetSeed();
  }
}
