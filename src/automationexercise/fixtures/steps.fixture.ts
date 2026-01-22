import { Page } from "@playwright/test";
import { AuthSteps } from "../steps/AuthSteps";
import { CartSteps } from "../steps/CartSteps";
import { CheckoutSteps } from "../steps/CheckoutSteps";
import { NavigationSteps } from "../steps/NavigationSteps";
import { ProductSteps } from "../steps/ProductSteps";
import { RegistrationSteps } from "../steps/RegistrationSteps";
import { PageFixtures } from "./pages.fixture";

export type StepsFixtures = {
  authSteps: AuthSteps;
  cartSteps: CartSteps;
  checkoutSteps: CheckoutSteps;
  navigationSteps: NavigationSteps;
  productSteps: ProductSteps;
  registrationSteps: RegistrationSteps;
};

export const stepsFixtures = {
  authSteps: async (
    {
      accountCreatedPage,
      accountDeletedPage,
      homePage,
      loginPage,
      signupPage,
    }: PageFixtures,
    use: (s: AuthSteps) => Promise<void>,
  ) => {
    await use(
      new AuthSteps(
        homePage,
        loginPage,
        signupPage,
        accountCreatedPage,
        accountDeletedPage,
      ),
    );
  },

  cartSteps: async (
    { cartPage, homePage, productDetailPage, productsPage }: PageFixtures,
    use: (s: CartSteps) => Promise<void>,
  ) => {
    await use(
      new CartSteps(homePage, productsPage, productDetailPage, cartPage),
    );
  },

  checkoutSteps: async (
    {
      cartPage,
      checkoutPage,
      homePage,
      paymentDonePage,
      paymentPage,
    }: PageFixtures,
    use: (s: CheckoutSteps) => Promise<void>,
  ) => {
    await use(
      new CheckoutSteps(
        homePage,
        cartPage,
        checkoutPage,
        paymentPage,
        paymentDonePage,
      ),
    );
  },

  navigationSteps: async (
    { homePage, page }: PageFixtures & { page: Page },
    use: (s: NavigationSteps) => Promise<void>,
  ) => {
    await use(new NavigationSteps(page, homePage));
  },

  productSteps: async (
    { productDetailPage, productsPage }: PageFixtures,
    use: (s: ProductSteps) => Promise<void>,
  ) => {
    await use(new ProductSteps(productsPage, productDetailPage));
  },

  registrationSteps: async (
    {
      accountCreatedPage,
      homePage,
      loginPage,
      signupPage,
    }: PageFixtures & { page: Page },
    use: (s: RegistrationSteps) => Promise<void>,
  ) => {
    await use(
      new RegistrationSteps(
        homePage,
        loginPage,
        signupPage,
        accountCreatedPage,
      ),
    );
  },
};
