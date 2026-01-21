# Quick Reference

One-page summary of the most important rules. Full details in linked docs.

---

## Architecture

```
Test → Steps → Page Object → Playwright
```

---

## Before Coding

1. Check [page-object-map.md](maps/page-object-map.md)
2. Check [steps-map.md](maps/steps-map.md)
3. Use Playwright MCP for locators

---

## Page Object Checklist

```typescript
// ✅ Required
export class MyPage extends BasePage {
    private readonly element: Locator;  // private readonly
    
    constructor(page: Page) {
        super(page, page.locator('#container'), 'MyPage');
        this.element = page.locator('#x').describe('X');  // .describe()
    }
    
    async navigate(): Promise<void> {  // navigate() method
        await this.page.goto(getEnvironment().url);
    }
}
```

**Rules:** Inherit BasePage · `.describe()` on locators · `navigate()` for URLs · Atomic actions

---

## Steps Checklist

```typescript
// ✅ Required
export class MySteps {
    @step('Description')  // MANDATORY decorator
    async doSomething(param: string): Promise<void> {  // Accept params
        await this.myPage.method();  // Call PO only
    }
}
```

**Rules:** `@step` on ALL methods · Accept params · Call PO only · No `page.goto()`

---

## Test Checklist

```typescript
// ✅ Required
test('description', async ({ mySteps }) => {
    const VALUE = 'constant';  // Named constant inside test
    await mySteps.doSomething(VALUE);  // Call Steps only
});
```

**Rules:** Call Steps only · Named constants · Test-specific constants in test body

---

## Anti-Patterns

| ❌ Never | ✅ Instead |
|----------|-----------|
| `page.goto()` in Steps | PO `navigate()` |
| Magic values | Named constants |
| Direct PO in tests | Call Steps |
| Missing `@step` | Add decorator |
| Missing `.describe()` | Add to locator |

---

## Commands

```bash
pnpm test              # Run tests
pnpm validate          # Check @step, .describe(), maps
pnpm validate:steps    # Check @step decorators
pnpm validate:locators # Check .describe()
pnpm validate:maps     # Check documentation maps
```

---

## Snippets (VS Code)

| Prefix | Creates |
|--------|---------|
| `po` | Page Object |
| `st` | Steps class |
| `ts` | Test spec |
| `sm` | Step method |
| `loc` | Locator |

---

## After Coding

1. Update [page-object-map.md](maps/page-object-map.md)
2. Update [steps-map.md](maps/steps-map.md)
3. Run `pnpm validate`
