# Steps Map

⚠️ **CRITICAL: CHECK THIS FILE BEFORE CREATING ANY NEW STEPS OR METHODS!**

**MANDATORY BEFORE CODING:**
1. ✅ **SEARCH** this file for existing Steps methods
2. ✅ **CHECK** if functionality already exists (even with different names)
3. ✅ **REUSE** existing methods instead of creating duplicates
4. ✅ **UPDATE** this file immediately after creating new Steps/methods

---

## Existing Steps Classes (UI)

> UI Steps live under `src/steps/*Steps.ts` and are provided via fixtures from `src/fixtures/steps.fixture.ts`.
> All public methods should have the `@step('...')` decorator.

### RegistrationSteps (`src/steps/RegistrationSteps.ts`)
- **Fixture**: `registrationSteps`
- **Purpose**: User registration flows (UI)
- **Primary methods**: `openAndStartRegistration(user)`, `fillAccountDetails(user)`, `finishAccountCreation()`, `performFullRegistration(user)`, `registerNewAccount(user)`

### AuthSteps (`src/steps/AuthSteps.ts`)
- **Fixture**: `authSteps`
- **Purpose**: Auth flows (register/login/delete) (UI)
- **Primary methods**: `registerNewUser(userData)`, `loginUser(email, password)`, `deleteAccount()`, `startSignup(name, email)`, `completeAccountDetails(userData)`, `verifyAndContinue()`

### NavigationSteps (`src/steps/NavigationSteps.ts`)
- **Fixture**: `navigationSteps`
- **Purpose**: Common navigation + scroll/hero/subscription checks (UI)
- **Primary methods**: `openHomePage()`, `scrollToBottom()`, `scrollToTop()`, `verifySubscriptionVisible()`, `verifyHeroTextVisible()`

### CartSteps (`src/steps/CartSteps.ts`)
- **Fixture**: `cartSteps`
- **Purpose**: Cart operations (UI)
- **Primary methods**: `addProductToCart(productIndex?)`, `addMultipleProducts(productIndices)`, `verifyCartDisplayed()`

### CheckoutSteps (`src/steps/CheckoutSteps.ts`)
- **Fixture**: `checkoutSteps`
- **Purpose**: Checkout + payment flow (UI)
- **Primary methods**: `completeCheckout(userData, paymentData, comment?)`, `proceedToCheckout()`, `verifyAddresses(userData)`, `placeOrder(comment?)`, `completePayment(paymentData)`

### ProductSteps (`src/steps/ProductSteps.ts`)
- **Fixture**: `productSteps`
- **Purpose**: Product search/listing validations (UI)
- **Primary methods**: `verifySearchResultsVisible()`, `verifyProductsListVisible()`, `verifyCategoryTitle(expectedTitle)`, `verifyBrandTitle(brandName)`

---

## Existing API Steps

> API Steps live under `src/api/api-steps/*ApiSteps.ts` and are provided via fixtures from `src/fixtures/api.fixture.ts`.

### UserApiSteps (`src/api/api-steps/UserApiSteps.ts`)
- **Fixture**: `userApiSteps`
- **Purpose**: Faster user setup/teardown and user detail reads (API)
- **Primary methods**: `createUser(user)`, `deleteUser(email, password)`, `isLoginValid(email, password)`, `getUserDetailByEmail(email)`

### ProductApiSteps (`src/api/api-steps/ProductApiSteps.ts`)
- **Fixture**: `productApiSteps`
- **Purpose**: Product data validation between API and UI (API)
- **Primary methods**: `getAllProducts()`, `searchProducts(searchTerm)`, `getProductById(products, id)`, `getProductByName(products, name)`, `verifyProductPricesMatch(apiProduct, uiPrice)`, `parsePriceToNumber(priceString)`

### BrandApiSteps (`src/api/api-steps/BrandApiSteps.ts`)
- **Fixture**: `brandApiSteps`
- **Purpose**: Brand data validation between API and UI (API)
- **Primary methods**: `getAllBrands()`, `getBrandByName(brands, brandName)`, `isBrandExists(brandName)`, `getBrandNames(brands)`

---

## Update History

| Date | Change |
|------|--------|
| 2025-12-16 | Replaced outdated Wikipedia map with current AutomationExercise Steps + API Steps |


