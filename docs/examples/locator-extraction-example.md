# Locator Extraction Example

Complete walkthrough of extracting locators for a real element following [patterns/locators.md](../patterns/locators.md) methodology.

## Scenario

Extract locator for "Trending Free" tab button on Steam homepage.

---

## Step 1: MCP Visual Analysis

```bash
# Navigate to page via Playwright MCP
mcp__playwright__browser_navigate(url="https://store.steampowered.com/")
mcp__playwright__browser_snapshot()
```

**Visual Confirmation:**
- Element: Horizontal tab in category navigation
- Location: Below main banner, tabs row
- Container: Tab list with multiple tab buttons
- State: Visible, clickable

---

## Step 2: Container HTML Investigation

Extract COMPLETE container DOM (not just target element):

```html
<div role="tablist" class="home_tabs_row TabsRow">
    <button role="tab"
            id="tab_trendingfree_content_trigger"
            class="home_tab OverviewTab"
            data-usability="15"
            aria-selected="true">
        <div class="tab_content TabContent">
            Trending Free
        </div>
    </button>
    <!-- Other tabs... -->
</div>
```

**Key Observations:**
- Unique ID: `tab_trendingfree_content_trigger`
- Data attribute: `data-usability="15"`
- Role: `role="tab"`
- Class: Generic `home_tab` (shared with 175+ elements)

---

## Step 3: Priority Strategy

Create multiple options, verify uniqueness:

```bash
# Option 1: ID selector (Priority 1)
curl -s "https://store.steampowered.com/" | grep -c "tab_trendingfree_content_trigger"
# Result: 1 ✅ UNIQUE

# Option 2: Data attribute (Priority 2)
curl -s "https://store.steampowered.com/" | grep -c 'data-usability="15"'
# Result: 1 ✅ UNIQUE

# Option 3: Role + Text (Priority 3)
curl -s "https://store.steampowered.com/" | grep -c 'role="tab".*Trending Free'
# Result: 1 ✅ UNIQUE

# Option 4: Class selector (Priority 6)
curl -s "https://store.steampowered.com/" | grep -c 'home_tab'
# Result: 175+ ❌ NOT UNIQUE
```

**Options Ranked:**
1. `#tab_trendingfree_content_trigger` (ID) ✅
2. `button[data-usability="15"]` (Data attr) ✅
3. `//button[@role='tab' and contains(., 'Trending Free')]` (XPath) ✅
4. `.home_tab` ❌ NOT STABLE

---

## Step 4: Validation

### Uniqueness Check
```typescript
// MCP verification
await page.locator("#tab_trendingfree_content_trigger").count()  // Returns: 1 ✅
```

### Visual Confirmation
```bash
mcp__playwright__browser_snapshot()
# Screenshot confirms correct element highlighted
```

### Stability Test
- ✅ Same locator after page reload
- ✅ Same across logged-in/out states
- ✅ Independent of dynamic content

**SELECTED:** `#tab_trendingfree_content_trigger`

Reason: Highest priority (ID), unique, stable, shortest.

---

## Step 5: Documentation

```markdown
### Target Element: Trending Free Tab Button

**Visual Analysis:**
- Location: Category navigation tabs, horizontal layout
- Container: TabList with role="tablist"
- State: Visible, clickable, first tab

**Container HTML:**
```html
<div role="tablist" class="home_tabs_row TabsRow">
    <button role="tab" id="tab_trendingfree_content_trigger"...>
        <div class="tab_content">Trending Free</div>
    </button>
</div>
```

**Selected Locator:** `#tab_trendingfree_content_trigger`
- **Type:** ID selector
- **Priority:** 1 (highest)
- **Verified:** Unique ✅, Stable ✅

**Alternatives Considered:**
- `button[data-usability="15"]` - Valid but less readable
- `//button[@role='tab' and contains(., 'Trending Free')]` - Works but verbose
- `.home_tab` - Rejected (not unique)
```

---

## Step 6: Implementation in Page Object

```typescript
import { Page, Locator } from "@playwright/test";
import { BasePage } from "../pages/BasePage";

export class SteamHomePage extends BasePage {
    readonly trendingFreeTab: Locator;

    constructor(page: Page) {
        super(page, page.locator(".home_ctn"), "Steam Home");

        // ONE verified locator per element, with .describe() for debugging
        this.trendingFreeTab = page.locator("#tab_trendingfree_content_trigger")
            .describe("Trending Free Tab");
    }

    async clickTrendingFree(): Promise<void> {
        // Use BasePage methods for checks
        await this.elementToBeVisible(this.trendingFreeTab);
        // Use Playwright API for interactions
        await this.trendingFreeTab.click();
    }
}
```

---

## Key Takeaways

1. **Always start with MCP** - Visual confirmation prevents wrong targets
2. **Extract full container** - Context is critical for stable locators
3. **Create multiple options** - Then select ONE BEST based on priority
4. **Verify uniqueness** - Use grep/curl before committing
5. **ONE locator in Page Object** - No fallback logic

**Time invested:** 10 minutes
**Stability gained:** High (ID-based, verified unique)
**Maintenance:** Minimal (semantic, readable)

---

See [patterns/locators.md](../patterns/locators.md) for the full methodology.
