# Test Data Example

## Environment & Credentials

```typescript
import { getEnvironment, getWikipediaUsername, getWikipediaPassword } from '../../utils/Config';

// Get URLs from environment JSON
const env = getEnvironment();
console.log(env.wikipedia.landingUrl);

// Get credentials from .env
const username = getWikipediaUsername();
const password = getWikipediaPassword();
```

---

## Random Data Generation

```typescript
import { testDataGenerator } from '../../utils/TestDataGenerator';

// Account data
const username = testDataGenerator.randomUsername();
const password = testDataGenerator.randomPassword(12);
const email = testDataGenerator.randomEmail();

// Contact data
const phone = testDataGenerator.randomMobileNumber();
const name = testDataGenerator.randomFullName();
```

---

## Complete Test Example

```typescript
import { test } from '../fixtures';
import { getEnvironment, getWikipediaUsername, getWikipediaPassword } from '../../utils/Config';
import { testDataGenerator } from '../../utils/TestDataGenerator';

test.describe('Wikipedia Tests', () => {
    const MIN_PASSWORD_LENGTH = 12;

    test('Create account with random credentials', async ({
        wikipediaLandingSteps,
        wikipediaNavigationSteps,
        wikipediaCreateAccountSteps
    }) => {
        // Random data for account creation
        const username = testDataGenerator.randomUsername();
        const password = testDataGenerator.randomPassword(MIN_PASSWORD_LENGTH);

        await wikipediaLandingSteps.openAndVerify();
        await wikipediaNavigationSteps.clickCreateAccount();
        await wikipediaCreateAccountSteps.fillAccountForm(username, password);
    });

    test('Login with existing account', async ({
        wikipediaLandingSteps,
        wikipediaNavigationSteps,
        wikipediaLoginSteps
    }) => {
        // Credentials from .env
        const username = getWikipediaUsername();
        const password = getWikipediaPassword();

        await wikipediaLandingSteps.openAndVerify();
        await wikipediaNavigationSteps.clickLogIn();
        await wikipediaLoginSteps.login(username, password);
    });
});
```

---

## Setup

### Local (.env file)
```
ENV=dev
WIKIPEDIA_USERNAME=your_username
WIKIPEDIA_PASSWORD=your_password
```

### CI (environment variables)
```yaml
env:
  ENV: prod
  WIKIPEDIA_USERNAME: ${{ secrets.WIKIPEDIA_USERNAME }}
  WIKIPEDIA_PASSWORD: ${{ secrets.WIKIPEDIA_PASSWORD }}
```

---

## See Also

- [patterns/test-data-management.md](../patterns/test-data-management.md) - Full pattern guide
