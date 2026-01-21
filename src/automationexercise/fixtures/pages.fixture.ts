import { Page } from '@playwright/test';
import { NavigationMenu } from '@components/NavigationMenu';
import { AccountCreatedPage } from '@pages/AccountCreatedPage';
import { AccountDeletedPage } from '@pages/AccountDeletedPage';
import { CartPage } from '@pages/CartPage';
import { CheckoutPage } from '@pages/CheckoutPage';
import { ContactUsPage } from '@pages/ContactUsPage';
import { HomePage } from '@pages/HomePage';
import { LoginPage } from '@pages/LoginPage';
import { PaymentDonePage } from '@pages/PaymentDonePage';
import { PaymentPage } from '@pages/PaymentPage';
import { ProductDetailPage } from '@pages/ProductDetailPage';
import { ProductsPage } from '@pages/ProductsPage';
import { SignupPage } from '@pages/SignupPage';

export type PageFixtures = {
  accountCreatedPage: AccountCreatedPage;
  accountDeletedPage: AccountDeletedPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  contactUsPage: ContactUsPage;
  homePage: HomePage;
  loginPage: LoginPage;
  navigation: NavigationMenu;
  paymentDonePage: PaymentDonePage;
  paymentPage: PaymentPage;
  productDetailPage: ProductDetailPage;
  productsPage: ProductsPage;
  signupPage: SignupPage;
};

export const pageFixtures = {
  accountCreatedPage: async ({ page }: { page: Page }, use: (p: AccountCreatedPage) => Promise<void>) => {
    await use(new AccountCreatedPage(page));
  },
  accountDeletedPage: async ({ page }: { page: Page }, use: (p: AccountDeletedPage) => Promise<void>) => {
    await use(new AccountDeletedPage(page));
  },
  cartPage: async ({ page }: { page: Page }, use: (p: CartPage) => Promise<void>) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }: { page: Page }, use: (p: CheckoutPage) => Promise<void>) => {
    await use(new CheckoutPage(page));
  },
  contactUsPage: async ({ page }: { page: Page }, use: (p: ContactUsPage) => Promise<void>) => {
    await use(new ContactUsPage(page));
  },
  homePage: async ({ navigation, page }: { navigation: NavigationMenu; page: Page }, use: (p: HomePage) => Promise<void>) => {
    await use(new HomePage(page, navigation));
  },
  loginPage: async ({ page }: { page: Page }, use: (p: LoginPage) => Promise<void>) => {
    await use(new LoginPage(page));
  },
  navigation: async ({ page }: { page: Page }, use: (n: NavigationMenu) => Promise<void>) => {
    await use(new NavigationMenu(page));
  },
  paymentDonePage: async ({ page }: { page: Page }, use: (p: PaymentDonePage) => Promise<void>) => {
    await use(new PaymentDonePage(page));
  },
  paymentPage: async ({ page }: { page: Page }, use: (p: PaymentPage) => Promise<void>) => {
    await use(new PaymentPage(page));
  },
  productDetailPage: async ({ page }: { page: Page }, use: (p: ProductDetailPage) => Promise<void>) => {
    await use(new ProductDetailPage(page));
  },
  productsPage: async ({ page }: { page: Page }, use: (p: ProductsPage) => Promise<void>) => {
    await use(new ProductsPage(page));
  },
  signupPage: async ({ page }: { page: Page }, use: (p: SignupPage) => Promise<void>) => {
    await use(new SignupPage(page));
  },
};