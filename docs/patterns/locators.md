# Locator Extraction Methodology

Universal process for creating stable, maintainable UI locators using Playwright MCP.

**📘 Full Example:** [locator-extraction-example.md](../examples/locator-extraction-example.md)

---

## Process: 5 Steps

### 1. MCP Visual Analysis 🚨 MANDATORY
1. Navigate to target page via Playwright MCP
2. Take page snapshot
3. Visually identify target element AND container
4. Confirm element visible and clickable

### 2. Container HTML Investigation
1. Extract COMPLETE parent container DOM (not just target element)
2. Use MCP evaluation, curl, or browser snapshot
3. Understand element position in hierarchy

### 3. Priority Strategy - Create Options, Select ONE BEST

**Reliability Order (most stable first):**
1. **ID Selectors** - `#unique-id` (not auto-generated)
2. **Data Attributes** - `[data-testid="value"]`
3. **Role + Text** - `//button[@role='tab' and contains(., 'Text')]`
4. **Partial Classes** - `//element[contains(@class, 'stable-part')]`
5. **Unique Attributes** - `[attribute="unique-value"]`
6. **Combined Selectors** - `button[role="tab"]#specific-id`

**Selection Criteria:**
- Highest priority from above
- Verified unique (returns exactly 1 element)
- Stable across page states
- Shortest and most readable

**NEVER use multiple locators for same element in Page Object**

### 4. Validation 🚨 MANDATORY

**Browser-Based Uniqueness Check (during extraction):**
```javascript
// Run in browser console or via browser_evaluate during locator extraction
document.querySelectorAll('your-selector').length  // Must return: 1
```

**AI Workflow - Always verify before using a locator:**
1. Execute `document.querySelectorAll('selector').length` on the live page
2. Confirm result is exactly **1**
3. Document results in verification table:

| Locator | Page/State | Match Count |
|---------|------------|:-----------:|
| `#my-id` | Main Page | 1 ✓ |
| `.my-class` | After login | 1 ✓ |

**Playwright Test Verification (optional):**
```typescript
const count = await page.locator('#element-id').count();
expect(count).toBe(1);
```

**Stability Testing:**
- Test across page states (logged in/out, different data)
- Verify after interactions
- Re-take snapshots after state changes

### 5. Documentation

```markdown
### Target: [Element Name]
**Visual:** Location and container type
**Selected:** `#locator` (Priority X, Unique ✅)
**Alternatives:** [other options tested]
```

---

## Priority Strategy Summary

| Priority | Type | Example | When to Use |
|----------|------|---------|-------------|
| 1 | ID | `#unique-id` | Always if available and not auto-generated |
| 2 | Data attrs | `[data-testid="btn"]` | Test-specific attributes |
| 3 | Role+Text | `//button[contains(.,'Submit')]` | Semantic HTML with stable text |
| 4 | Partial class | `//div[contains(@class,'stable')]` | Dynamic class names |
| 5 | Unique attrs | `[name="unique"]` | Unique HTML attributes |
| 6 | Combined | `button#id[role='tab']` | Multiple attributes needed |

---

## Success Criteria

Before Page Object implementation:
- ✅ MCP visual analysis completed
- ✅ Container HTML extracted and analyzed
- ✅ Multiple options created and evaluated
- ✅ Uniqueness verified (returns exactly 1)
- ✅ Stability tested across states
- ✅ ONE BEST locator selected
- ✅ Documented with verification results

---

## Key Benefits

- **Stability:** Container-first approach
- **Maintainability:** Centralized in Page Objects
- **Reliability:** MCP visual confirmation prevents wrong targets
- **Consistency:** Priority strategy ensures predictable selection

---

**📘 See complete walkthrough:** [locator-extraction-example.md](../examples/locator-extraction-example.md)
