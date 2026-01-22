# Page Object Map

⚠️ **CRITICAL: CHECK THIS FILE BEFORE CREATING ANY NEW PAGE OBJECTS OR METHODS!**

**MANDATORY BEFORE CODING:**
1. ✅ **SEARCH** this file for existing Page Objects and methods
2. ✅ **CHECK** if functionality already exists (even with different names)
3. ✅ **REUSE** existing code instead of creating duplicates
4. ✅ **UPDATE** this file immediately after creating new Page Objects/methods

**ANTI-DUPLICATION RULES:**
- 🔴 **NEVER** create a new Page Object if one exists for the same page
- 🔴 **NEVER** create a new method if similar functionality exists
- 🟢 **ALWAYS** extend existing Page Objects with new methods
- 🟢 **ALWAYS** update this map after ANY changes

---

## App Under Test

- **Base URL**: `https://www.automationexercise.com` (default via `playwright.config.ts` `use.baseURL`)
- **Routes constants**: `src/constants/Routes.ts` (`Routes.WEB.*`)

---

## Existing Page Objects (Web)

> All Page Objects live under `src/pages/*Page.ts` and extend `src/pages/BasePage.ts`.
> For exact method signatures, open the referenced file (this map lists the *primary* methods).

### BasePage (`src/pages/BasePage.ts`)
- **Purpose**: Base navigation + “page opened” verification helpers used by all pages.

### HomePage (`src/pages/HomePage.ts`)
- **Route**: `Routes.WEB.HOME` (`/`)
- **Primary methods**: `goto()`, `clickSignupLogin()`, `clickLogout()`, `clickProducts()`, `clickContactUs()`, `verifyLoggedInVisible()`, `verifyLoggedInNotVisible()`, `scrollToBottom()`, `scrollToTop()`, `verifySubscriptionVisible()`, `verifyFullFledgedTextVisible()`, `clickScrollUpArrow()`, `verifyRecommendedItemsVisible()`, `addRecommendedItemToCart()`, `clickViewCartFromModal()`

### LoginPage (`src/pages/LoginPage.ts`)
- **Route**: `Routes.WEB.LOGIN`
- **Primary methods**: `login(email, password)`, `signup(name, email)`

### SignupPage (`src/pages/SignupPage.ts`)
- **Route**: `Routes.WEB.SIGNUP`
- **Primary methods**: `fillAccountDetails(user)`, `clickCreateAccount()`

### AccountCreatedPage (`src/pages/AccountCreatedPage.ts`)
- **Route**: `Routes.WEB.ACCOUNT_CREATED`
- **Primary methods**: `clickContinue()`

### AccountDeletedPage (`src/pages/AccountDeletedPage.ts`)
- **Primary methods**: `verifyAccountDeleted()`, `clickContinue()`

### ProductsPage (`src/pages/ProductsPage.ts`)
- **Route**: `Routes.WEB.PRODUCTS`
- **Primary methods**: `goto()`, `search(keyword)`, `getProductNames()`, `getProductCount()`, `clickViewProduct(index)`, `addProductToCart(index)`, `clickContinueShopping()`, `clickViewCart()`, `selectCategory(mainCategory, subCategory)`, `selectBrand(brandName)`, `getProductPrice(index)`

### ProductDetailPage (`src/pages/ProductDetailPage.ts`)
- **Primary methods**: `verifyProductDetailVisible()`, `getProductName()`, `getProductPrice()`, `setQuantity(quantity)`, `addToCart()`, `clickContinueShopping()`, `clickViewCart()`, `verifyReviewSectionVisible()`, `submitReview(name, email, review)`, `verifyReviewSuccess()`

### CartPage (`src/pages/CartPage.ts`)
- **Route**: `Routes.WEB.VIEW_CART`
- **Primary methods**: `goto()`, `getCartItems()`, `getCartItemCount()`, `clearCart()`, `removeProduct(index)`, `removeProductByName(name)`, `verifyProductInCart(name)`, `verifyProductNotInCart(name)`, `verifyCartEmpty()`, `getProductQuantity(name)`, `getProductTotal(name)`, `getCartTotal()`, `clickProceedToCheckout()`, `verifyCartTableVisible()`, `subscribeWithEmail(email)`, `verifySubscriptionVisible()`, `verifySubscriptionSuccess()`

### CheckoutPage (`src/pages/CheckoutPage.ts`)
- **Route**: `Routes.WEB.CHECKOUT`
- **Primary methods**: `verifyDeliveryAddress(user)`, `verifyBillingAddress(user)`, `verifyOrderContainsProduct(productName)`, `enterComment(text)`, `clickPlaceOrder()`

### PaymentPage (`src/pages/PaymentPage.ts`)
- **Route**: `Routes.WEB.PAYMENT`
- **Primary methods**: `verifyPaymentPageVisible()`, `fillPaymentDetails(paymentDetails)`, `clickPayAndConfirm()`

### PaymentDonePage (`src/pages/PaymentDonePage.ts`)
- **Route**: `Routes.WEB.PAYMENT_DONE`
- **Primary methods**: `verifyOrderSuccess()`, `getOrderConfirmation()`, `clickContinue()`

### ContactUsPage (`src/pages/ContactUsPage.ts`)
- **Route**: `Routes.WEB.CONTACT_US`
- **Primary methods**: `goto()`, `verifyFormVisible()`, `fillContactForm(data)`, `uploadFile(filePath)`, `submitForm()`, `verifySuccessMessage()`, `clickHomeButton()`

---

## Shared Components

### NavigationMenu (`src/components/NavigationMenu.ts`)
- **Purpose**: Shared top navigation actions (Cart, Products, Signup/Login, Logout, Delete Account, Contact Us, etc.)

---

## Update History

| Date | Change |
|------|--------|
| 2025-12-16 | Replaced outdated Wikipedia map with current AutomationExercise Page Objects |


