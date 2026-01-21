# Tech Stack

## Core Technologies
- **TypeScript 5.0+** - Implementation language
- **Playwright** - Browser automation with auto-waiting
- **Playwright Test Runner** - Native test runner
- **Playwright HTML Reporter** - Built-in reporting
- **Zod** - Runtime schema validation for API responses

## Framework Components
- **Page Object Model** - UI abstraction pattern (see `tests/pages/`)
- **Steps Classes** - Business logic layer (see `tests/steps/`)
- **API Layer** - API services, routes, schemas (see `tests/api/`)
- **Fixtures** - Dependency injection for tests (see `tests/fixtures/`)
- **BasePage Check Methods** - Centralized element state validation
- **Playwright MCP** - Locator extraction and browser interaction
- **HTML Reports** - Comprehensive reporting with screenshots, traces, and videos

## Directory Structure
```
tests/
├── api/              ← API Layer
│   ├── builders/     ← Request builders (BaseRequestBuilder)
│   ├── constants/    ← StatusCode, Headers, ContentType
│   ├── routes/       ← Endpoint definitions
│   ├── schemas/      ← Zod schemas for validation
│   └── services/     ← Domain services (SearchService)
├── pages/            ← Page Objects (atomic actions)
├── steps/            ← Steps Classes (receive PO via DI)
├── specs/            ← Test specs (.spec.ts)
├── fixtures/         ← Playwright fixtures
│   ├── context.fixture.ts ← Environment & File context
│   ├── pages.fixture.ts   ← Page Object instances
│   ├── steps.fixture.ts   ← Steps (injects POs)
│   ├── api.fixture.ts     ← API layer
│   └── index.ts           ← Merged export
└── data/             ← Test data (environment/, auth/)

utils/
├── api/              ← API Utilities (ApiClient)
├── Config.ts         ← Environment & secrets
├── Decorators.ts     ← @step decorator
├── parseResponse.ts  ← Zod validation utility
├── matchers.ts       ← Custom Playwright matchers
├── TestDataGenerator.ts
├── TestDataProvider.ts
└── JsonLoader.ts
```

## Architecture

```
Gherkin Spec Files       ← AI Input (Ephemeral, NOT committed)
     ↓
Test Files (.spec.ts)    ← Test Layer (uses fixtures)
     ↓
Steps Classes (.ts)      ← Business Logic (receives PO via DI)
     ↓
Page Objects (.ts)       ← Page Layer (atomic actions)
     ↓
Playwright API           ← Browser Automation

API Tests:
Test Files (.spec.ts)    ← Test Layer
     ↓
API Services (.ts)       ← Domain logic (SearchService)
     ↓
ApiClient                ← Thin wrapper around Playwright APIRequestContext
     ↓
Zod Schemas              ← Response validation (in tests)
```

## Fixture Chain
```
context.fixture → pages.fixture → api.fixture → steps.fixture → auth.fixture
```

## Supported Browsers
Chromium, Firefox, WebKit