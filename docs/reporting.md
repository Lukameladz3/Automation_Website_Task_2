# Reporting

The framework uses **ReportPortal** as the primary reporter with **Playwright HTML Reporter** as a secondary local option.

---

## ReportPortal (Default)

### Configuration

Configured in `playwright.config.ts`:

```typescript
export default defineConfig({
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'retain-on-failure',
  },
});
```

### Viewing Reports

```bash
npx playwright show-report
```

### Features

| Feature | Description |
|---------|-------------|
| **Test Status** | Pass/Fail/Skipped for each test |
| **Steps** | Step-by-step execution log (`@step` decorators) |
| **Screenshots** | Automatically attached |
| **Traces** | DOM snapshots, network requests |
| **Videos** | Recording on failure |
| **Filtering** | By status, project, or search |

---

## ReportPortal Integration

Centralized test reporting with analytics, defect tracking, and ML-powered failure analysis.

### Setup

1. **Install package** (already included):
   ```bash
   pnpm add -D @reportportal/agent-js-playwright
   ```

2. **Configure `.env`**:
   ```
   REPORTPORTAL_ENDPOINT=http://localhost:8081/api/v1
   REPORTPORTAL_PROJECT=your-project-name
   REPORTPORTAL_API_KEY=your-api-key
   ```

3. **Run tests** - reports automatically sent to ReportPortal:
   ```bash
   npx playwright test --project='authenticated'
   ```

### Configuration Options

In `playwright.config.ts`:

```typescript
const rpConfig = {
  apiKey: process.env.REPORTPORTAL_API_KEY,
  endpoint: process.env.REPORTPORTAL_ENDPOINT,
  project: process.env.REPORTPORTAL_PROJECT,
  launch: 'Playwright SDD Tests',
  includeTestSteps: true,  // Show @step annotations as nested steps
  attributes: [
    { key: 'framework', value: 'playwright' },
    { key: 'env', value: process.env.ENV || 'dev' }
  ],
};
```

### Key Features

| Feature | Description |
|---------|-------------|
| **Centralized Dashboard** | All test runs in one place |
| **Nested Steps** | `@step` decorators appear as child items |
| **Screenshots** | Auto-attached to test results |
| **Defect Tracking** | Link failures to issues |
| **ML Analysis** | Auto-grouping of similar failures |
| **Historical Trends** | Charts over time |

### Disable Locally

Comment out or remove the env variables in `.env`. The framework falls back to HTML reporter only.

---

## CI/CD Integration

### GitHub Actions

```yaml
- name: Upload Playwright Report
  uses: actions/upload-artifact@v4
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
    retention-days: 30
```

### ReportPortal in CI

Set environment variables as secrets:

```yaml
env:
  REPORTPORTAL_ENDPOINT: ${{ secrets.RP_ENDPOINT }}
  REPORTPORTAL_PROJECT: ${{ secrets.RP_PROJECT }}
  REPORTPORTAL_API_KEY: ${{ secrets.RP_API_KEY }}
```
