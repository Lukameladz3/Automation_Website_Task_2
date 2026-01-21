# PAGES
# BasePage.ts:
* Do we really need helper methods for scrolling to bottom and to top? Method for checking if element is in viewport also seems not necessary?
Other than that, the BasePage looks clean
# HomePage.ts:
* h1 and h2 locators in super() may cause flakiness. All locators should have describe('') to improve readability and grouping reports.
# LoginPage.ts:
* Every locator should have describe(). 
# CartPage.ts:
* Could locators be improved? Currently CartPage has complicated locators with CSS classes, but I myself couldn't come up with better solution for this page.
# CheckoutPage.ts:
* Shouldn't verification be part of steps and not Page objects? Instead of chaining expects inside of a page object method it could be done in the steps layer. Or not?
# ContactUsPage.ts:
* 'data-qa' locators could be implemented as getByTestId() locators by setting a custom test id attribute in playwright config file.
# Page Objects verdict:
* Page objects are well implemented. They are clean and easy to read. There are some ireas for improvement and some pages do not fully adhere to best practices and requirements, but nothing critical.

# STEPS
* Some assertions in steps layer are missing the comment.


# TESTS
* Some tests are using test.step(), but you already have created steps layer in src/steps folder. No need for test.step(). Implement actual steps layer.
