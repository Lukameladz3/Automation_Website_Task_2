Website: https://www.automationexercise.com/
You need to implement these test cases:

### Authentication (2 tests)
1. **TC01** - User Registration with complete profile
2. **TC02** - Login with registered user

### Cart Operations (3 tests)
3. **TC03** - Add multiple products to cart
4. **TC04** - Remove product from cart
5. **TC08** - Update product quantity in cart

### Product Features (2 tests)
6. **TC05** - Search products and verify results
7. **TC09** - Filter by category and brand

### Advanced Flows (2 tests)
8. **TC06** - End-to-end checkout flow (complex)
9. **TC07** - User logout functionality

### Other Features (1 test)
10. **TC10** - Contact form submission with file upload
## 🔑 Key Requirements (Critical!)
### 1. Parallel Execution ⚡
- Tests must run with **at least 4 workers** simultaneously
- All tests must pass when run in parallel
- No race conditions or conflicts

### 2. Unique Users Per Worker 👥
- Each worker needs its **own unique user account**
- Workers must NOT share credentials
- Users created via signup/registration flow
- User data must be managed and stored

### 3. Page Object Model 🏗️
- Implement proper POM pattern
- Separate page classes for each page
- Reusable methods and components
- Clean separation of concerns

### 4. TypeScript ✨
- Full TypeScript implementation
- Proper typing (avoid `any`)
- Interfaces for data structures
- Type-safe code

### 5. Test Quality 🎯
- All 10 tests must pass consistently
- Proper waits (no hard-coded timeouts)
- Comprehensive assertions
- Error handling
 
TC #1
### TC01: User Registration with Complete Profile
**Priority:** High
**Type:** Functional
**Requires:** Unique user per worker

**Objective:** Verify that a new user can successfully register with complete profile information and access their account.

**Preconditions:**
- Application is accessible
- User email must be unique (generate per worker)

**Test Steps:*
1. Navigate to homepage
2. Verify homepage is loaded successfully
3. Click on "Signup / Login" link
4. Verify "New User Signup!" section is visible
5. Enter unique name and email address (worker-specific)

6. Click "Signup" button
7. Verify "ENTER ACCOUNT INFORMATION" page is displayed
8. Fill in all account details:
- Title (Mr./Mrs.)
- Password
- Date of birth (day, month, year)
9. Select checkboxes:
- "Sign up for our newsletter!"
- "Receive special offers from our partners!"
10. Fill in address information:
- First name
- Last name
- Company
- Address
- Address2
- Country (dropdown)
- State
- City
- Zipcode
- Mobile Number
11. Click "Create Account" button
12. Verify "ACCOUNT CREATED!" message is displayed
13. Click "Continue" button
14. Verify "Logged in as [username]" is visible in header
15. Store user credentials for subsequent tests

**Expected Results:**
- User account is created successfully
- Confirmation message is displayed
- User is automatically logged in
- Username is visible in navigation bar
- Account can be used for login in other tests
**Test Data Requirements:**
- Use strong password meeting requirements
- Valid address information (can be dummy but realistic)
- Valid mobile number format
TC #2
### TC02: Login with Registered User
**Priority:** High
**Type:** Functional
**Requires:** Pre-registered user from TC01


**Objective:** Verify that a registered user can successfully login with valid credentials.

**Preconditions:**
- User account exists (created in TC01 or pre-registered)
- User credentials are available (email and password)

**Test Steps:**
1. Navigate to homepage
2. Click on "Signup / Login" link
3. Verify "Login to your account" section is visible
4. Enter correct email address (worker-specific user)
5. Enter correct password
6. Click "Login" button
7. Verify "Logged in as [username]" is visible
8. Verify user is on homepage (after login redirect)

**Expected Results:**
- Login is successful
- User is redirected to homepage
- Username displays in navigation bar
- No error messages appear
- User can access account-specific features

**Test Data Requirements:**
- Use credentials from TC01 (worker-specific user)
- Email and password must match registered account
TC #3
### TC03: Add Multiple Products to Cart and Verify
**Priority:** High
**Type:** Functional
**Requires:** Logged-in user


**Objective:** Verify that logged-in users can add multiple products to cart, verify quantities, prices, and total amount.

**Preconditions:**
- User is logged in (worker-specific account)
- Products are available on the website

**Test Steps:**
1. Login with worker-specific user credentials
2. Navigate to "Products" page
3. Verify products list is visible
4. Select first product and click "View Product"
5. Verify product detail page opens
6. Increase quantity to 3
7. Click "Add to cart" button
8. Click "Continue Shopping" in modal
9. Navigate back to products page
10. Select second product (different from first)
11. Click "Add to cart" button (quantity 1)
12. Click "View Cart" in modal
13. Verify both products are displayed in cart
14. Verify first product quantity is 3
15. Verify second product quantity is 1
16. Verify product prices are correct
17. Calculate and verify total price (price × quantity for each product)
18. Verify cart total matches sum of all items

**Expected Results:**
- Multiple products can be added to cart
- Quantities are maintained correctly
- Individual prices are displayed correctly
- Total price calculation is accurate
- Cart persists across page navigations
- Products can be viewed in cart with all details

**Test Data Requirements:**
- At least 2 different products must be selected
- Product names and prices should be captured dynamically
TC #4
### TC04: Remove Product from Cart
**Priority:** Medium
**Type:** Functional
**Requires:** Logged-in user, cart with products


**Objective:** Verify that users can remove products from cart and cart updates correctly.

**Preconditions:**
- User is logged in
- Cart contains at least 2 products

**Test Steps:**
1. Login with worker-specific user
2. Add at least 2 products to cart (or reuse from TC03)
3. Navigate to cart page
4. Note the total number of products
5. Note the cart total amount
6. Click the "X" (remove) button on first product
7. Verify product is removed from cart
8. Verify remaining product(s) still display
9. Verify cart total is updated correctly
10. Verify product count decreases
11. Remove all remaining products one by one
12. Verify cart becomes empty
13. Verify appropriate empty cart message or state

**Expected Results:**
- Products can be removed individually
- Cart updates immediately without page refresh
- Total amount recalculates correctly
- Empty cart shows appropriate message
- No errors occur during removal
- Cart icon updates with correct item count

**Test Data Requirements:**
- Start with at least 2-3 products in cart
- Track product names and prices for verification
TC #5
### TC05: Search Product and Verify Results
**Priority:** High
**Type:** Functional
**Requires:** Any user state (can be logged out)


**Objective:** Verify search functionality returns relevant products and displays correct information.

**Preconditions:**
- Application is accessible
- Products database contains searchable items

**Test Steps:**
1. Navigate to homepage
2. Navigate to "Products" page
3. Verify "ALL PRODUCTS" page is displayed
4. Verify search box is visible
5. Enter product name in search box (e.g., "Dress", "Jeans", "Top")
6. Click search button (or press Enter)
7. Verify "SEARCHED PRODUCTS" heading is visible
8. Verify search results contain only relevant products
9. Verify each product card displays:
- Product image
- Product name
- Price
- "View Product" button
10. Click on first product in search results
11. Verify product detail page opens with correct information
12. Perform search with different keyword
13. Verify results update accordingly
14. Perform search with non-existent product name
15. Verify appropriate "No products found" or empty results

**Expected Results:**
- Search returns relevant products only
- Search is case-insensitive
- All product information displays correctly
- Product details can be accessed from search results
- Invalid searches show appropriate feedback
- Search works for logged-in and guest users

**Test Data Requirements:**
- Valid search terms: "Dress", "Jeans", "Top", "Tshirt"
- Invalid search term: Random string like "XYZ123NOTFOUND"
TC #6
### TC06: Complete End-to-End Purchase Flow
**Priority:** Critical
**Type:** End-to-End
**Requires:** Registered and logged-in user


**Objective:** Verify complete purchase flow from product selection to order confirmation.

**Preconditions:**
- User is registered and logged in (worker-specific)
- Products are available
- Payment processing is functional (or mock)

**Test Steps:**
1. Login with worker-specific user credentials
2. Navigate to "Products" page
3. Add multiple products to cart (at least 2)
4. Navigate to cart page
5. Verify all products are in cart with correct details
6. Click "Proceed To Checkout" button
7. Verify delivery address is displayed correctly
8. Verify billing address is displayed correctly
9. Verify order details (products, quantities, prices)
10. Verify total amount including all charges
11. Enter payment details in "Payment" section:
- Name on Card
- Card Number
- CVC
- Expiration Date (MM/YYYY)
12. Click "Pay and Confirm Order" button
13. Verify order success message is displayed
14. Verify order confirmation details
15. Download invoice (if available)
16. Verify cart is empty after order completion
17. Navigate to orders history (if available)
18. Verify order appears in history with correct details

**Expected Results:**
- Complete checkout process works smoothly
- Address information auto-fills from registration
- Order total calculates correctly with all fees
- Payment processing completes (or shows appropriate mock)
- Order confirmation displays
- Cart clears after successful order
- Order appears in account history

**Test Data Requirements:**
- Worker-specific logged-in user with address
- Valid payment test data (use test card numbers if available)
- Example: Card: 4111 1111 1111 1111, CVV: 123, Exp: 12/2025
TC #7
### TC07: User Logout Functionality
**Priority:** Medium
**Type:** Functional
**Requires:** Logged-in user


**Objective:** Verify user can successfully logout and session is terminated.

**Preconditions:**
- User is logged in with worker-specific credentials

**Test Steps:**
1. Login with worker-specific user
2. Verify "Logged in as [username]" is visible
3. Navigate to different pages (products, cart, etc.)
4. Click "Logout" link in navigation
5. Verify user is redirected to login page
6. Verify "Logged in as" text is no longer visible
7. Verify login form is displayed
8. Attempt to access account-specific page directly (via URL)
9. Verify user is redirected to login page or blocked
10. Use browser back button
11. Verify user remains logged out
12. Verify session is truly terminated (no cache-based access)

**Expected Results:**
- Logout link is accessible
- User is logged out successfully
- Navigation bar updates (no username displayed)
- Session is terminated completely
- Protected pages require re-login
- Back button doesn't restore session
- User must login again to access account features

**Test Data Requirements:**
- Worker-specific logged-in user credentials
TC #8
### TC08: Update Product Quantity in Cart
**Priority:** Medium
**Type:** Functional
**Requires:** Logged-in user with products in cart


**Objective:** Verify user can update product quantities in cart and totals recalculate correctly.

**Preconditions:**
- User is logged in
- At least one product is in cart

**Test Steps:**
1. Login with worker-specific user
2. Add a product to cart with quantity 1
3. Navigate to cart page
4. Verify current quantity is 1
5. Note the current product price and cart total
6. Increase quantity to 5 (if quantity selector is available)
7. Verify quantity updates to 5
8. Verify product subtotal = price × 5
9. Verify cart total updates correctly
10. Decrease quantity to 2
11. Verify quantity updates to 2
12. Verify product subtotal = price × 2
13. Verify cart total updates correctly
14. Try updating quantity to 0 (or invalid value)
15. Verify appropriate handling (remove or validation message)
16. Add another product with different quantity
17. Update both products' quantities
18. Verify all calculations remain accurate

**Expected Results:**
- Quantity can be increased and decreased
- Subtotals recalculate immediately
- Cart total is always accurate
- Updates work without page reload (AJAX/dynamic)
- Invalid quantities are handled properly
- Multiple products can be updated independently
- No calculation errors occur

**Test Data Requirements:**
- Products with various prices
- Test quantities: 1, 2, 5, 10, 0 (if allowed)
TC #9
### TC09: Product Category and Brand Filtering
**Priority:** Medium
**Type:** Functional
**Requires:** Any user state


**Objective:** Verify users can filter products by categories and brands, and results are accurate.

**Preconditions:**
- Application is accessible
- Products are organized by categories and brands

**Test Steps:**
1. Navigate to homepage
2. Verify category sidebar is visible with options:
- Women (Dress, Tops, Saree)
- Men (Tshirts, Jeans)
- Kids (Dress, Tops & Shirts)
3. Click on "Women" > "Dress" category
4. Verify page displays only Women's dresses
5. Verify category title is displayed correctly
6. Count number of products and verify they match category
7. Verify each product belongs to selected category
8. Click on different category (e.g., "Men" > "Jeans")
9. Verify page updates with Men's jeans only
10. Verify previous category products are replaced
11. Navigate to brands section
12. Verify brands list is visible (Polo, H&M, Madame, etc.)
13. Click on a specific brand (e.g., "Polo")
14. Verify only Polo brand products are displayed
15. Verify brand title/filter is shown
16. Click on another brand
17. Verify filter updates correctly
18. Test combination of category and brand (if possible)
19. Verify no products from other categories/brands appear

**Expected Results:**
- Categories are clearly organized and clickable
- Filtering works accurately for each category
- Subcategories function correctly
- Brand filtering displays only selected brand products
- Page title/heading reflects active filter
- Product count matches filter criteria
- No cross-contamination between filters
- Filters work for both logged-in and guest users

**Test Data Requirements:**
- Know expected categories: Women, Men, Kids
- Know expected brands: Polo, H&M, Madame, Mast & Harbour, etc.
- Verify at least 3 different category filters
- Verify at least 2 different brand filters
TC #10
### TC10: Contact Form Submission with File Upload
**Priority:** Medium
**Type:** Functional
**Requires:** Any user state


**Objective:** Verify contact form can be submitted with all details including file attachment and confirmation is received.

**Preconditions:**
- Application is accessible
- Contact form is functional

**Test Steps:**
1. Navigate to homepage
2. Click on "Contact us" link in navigation
3. Verify "GET IN TOUCH" form is displayed
4. Verify all form fields are visible:
- Name
- Email
- Subject
- Message
- Upload file
- Submit button
5. Enter valid name
6. Enter valid email address (worker-specific)
7. Enter subject line (e.g., "Test Inquiry")
8. Enter detailed message (at least 50 characters)
9. Select and upload a file (image or document, under 5MB)
10. Verify file is attached successfully
11. Click "Submit" button
12. Verify success message is displayed (e.g., "Success! Your details have been submitted successfully.")
13. Verify success message contains appropriate confirmation
14. Verify form clears after successful submission (or redirects)
15. Submit form again with different data
16. Verify multiple submissions work correctly
17. Test form validation by submitting with empty fields
18. Verify appropriate validation messages appear
19. Test with invalid email format
20. Verify email validation works correctly

**Expected Results:**
- All form fields are functional
- File upload accepts valid file types
- File size restrictions are enforced (if any)
- Form validates required fields
- Email format is validated
- Success message displays after submission
- Form handles multiple submissions
- Appropriate error messages for invalid data
- No errors occur during submission
- User receives confirmation

**Test Data Requirements:**
- Valid test file (image: .jpg, .png, or document: .pdf, .txt)
- Valid email format
- Invalid email formats for validation testing: "invalidemail", "test@", "@test.com"
- Message text with special characters for testing


Your implementation will be evaluated on:
### Code Quality (30%)
- Clean, readable, and maintainable code
- Proper TypeScript usage with types and interfaces
- Consistent naming conventions
- Appropriate code comments
- DRY principle (Don't Repeat Yourself)

### Architecture (25%)
- Proper Page Object Model implementation
- Separation of concerns
- Reusable components and utilities
- Scalable and extensible design
- Proper use of fixtures and hooks

### Functionality (25%)
- All test cases pass reliably
- Proper assertions and verifications
- Edge cases are handled
- Error scenarios are tested
- Tests are independent and isolated

### Technical Skills (20%)
- Parallel execution works correctly
- User management per worker is implemented
- Proper synchronization (no flaky tests)
- Performance considerations
- Best practices followed
As a senior engineer, ask yourself:

- How will I handle test data dependencies?
- How can I make tests more maintainable?
- What if the UI changes tomorrow?
- How can I minimize test execution time?
- How will I handle flaky tests?
- What's my strategy for debugging failures?
- How can I make this framework scale to 100+ tests?
- What security considerations should I include?
- How will I handle different environments (dev, staging, prod)?