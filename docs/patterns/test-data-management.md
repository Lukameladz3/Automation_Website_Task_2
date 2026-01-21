# Test Data Management

## Configuration Utilities

The project uses two main utilities in `utils/`:

### `Config.ts` - Environment & Credentials

```typescript
import { getEnvironment, getWikipediaUsername, getWikipediaPassword } from '../../utils/Config';

// Get environment config (from JSON files)
const env = getEnvironment();
console.log(env.wikipedia.landingUrl);  // https://test.wikipedia.org

// Get credentials (from .env or CI env vars)
const username = getWikipediaUsername();
const password = getWikipediaPassword();
```

### `JsonLoader.ts` - JSON File Loading

```typescript
import { loadJson } from '../../utils/JsonLoader';

const data = loadJson('tests/data/common/users');
console.log(data.validUsers);
```

---

## Environment Setup

### Local Development

Create `.env` file in project root:
```
ENV=dev
WIKIPEDIA_USERNAME=your_username
WIKIPEDIA_PASSWORD=your_password
```

### CI/CD (GitHub Actions)

Set environment variables directly - no `.env` file needed:
```yaml
env:
  ENV: prod
  WIKIPEDIA_USERNAME: ${{ secrets.WIKIPEDIA_USERNAME }}
  WIKIPEDIA_PASSWORD: ${{ secrets.WIKIPEDIA_PASSWORD }}
```

---

## Environment JSON Files

**Location:** `tests/data/environment/`

### dev.json (test.wikipedia.org)
```json
{
    "environment": "test",
    "baseUrl": "https://test.wikipedia.org",
    "wikipedia": {
        "landingUrl": "https://test.wikipedia.org",
        "mainPageUrl": "https://test.wikipedia.org/wiki/Main_Page"
    }
}
```

### prod.json (www.wikipedia.org)
```json
{
    "environment": "production",
    "baseUrl": "https://www.wikipedia.org",
    "wikipedia": {
        "landingUrl": "https://www.wikipedia.org",
        "mainPageUrl": "https://en.wikipedia.org/wiki/Main_Page"
    }
}
```

---

## Running Tests

```bash
# Default (dev = test.wikipedia.org)
npx playwright test

# Explicit environments
ENV=dev npx playwright test   # test.wikipedia.org
ENV=prod npx playwright test  # www.wikipedia.org
```

---

## Random Data: TestDataGenerator

**Location:** `utils/TestDataGenerator.ts`

```typescript
import { testDataGenerator } from '../../utils/TestDataGenerator';

const username = testDataGenerator.randomUsername();
const password = testDataGenerator.randomPassword(12);
const email = testDataGenerator.randomEmail();
```

---

## Best Practices

### ✅ DO
- Use `getEnvironment()` for URLs
- Use `getWikipediaUsername()`/`getWikipediaPassword()` for credentials
- Use `testDataGenerator` for unique test data
- Pass data as parameters to Steps methods

### ❌ DON'T
- Hardcode URLs or credentials
- Read credentials inside Page Objects or Steps
