# Git Workflow with GitHub MCP

Git workflow for code submission using GitHub MCP tools.

---

## When to Use

**ONLY when explicitly asked to commit/submit code.**

Use this workflow when:
- ✅ User explicitly asks to "commit code" or "create PR"
- ✅ All tests are written and verified
- ✅ All code implementation is complete
- ✅ Feature execution is 100% successful

**DO NOT use proactively** - wait for explicit request.

---

## Workflow Steps

### 1. Get Current Branch

```bash
git branch --show-current
```

**Purpose**: Identify the base branch for creating new branch.

---

### 2. Create New Branch

**Branch naming convention**:
- `feature/<feature-name>` - for new features
- `fix/<issue-name>` - for bug fixes
- `test/<test-name>` - for test implementations

**Create branch from current**:

```bash
git checkout -b feature/your-feature-name
```

**Example**:
```bash
# Current branch: main
git checkout -b feature/authentication-tests
```

---

### 3. Write All Code

- Extract locators using Playwright MCP
- Implement/update Page Objects
- Implement/update Steps classes
- Create Playwright spec files
- Follow all patterns from `docs/patterns/`
- Verify all tests pass with `npx playwright test`

**Code must be complete before proceeding!**

---

### 4. Verify Tests

**Run complete test suite**:

```bash
npx playwright test
```

**Success criteria**:
- ✅ All tests PASS (100%)
- ✅ No errors or failures
- ✅ Playwright Report generated correctly

**If tests fail** → Fix code, DO NOT proceed to commit!

---

### 5. Stage Changes

**Check what changed**:

```bash
git status
```

**Stage all new/modified files**:

```bash
# Stage all changes
git add .

# Or stage specific files
git add tests/pages/LoginPage.ts
git add tests/steps/LoginSteps.ts
git add tests/specs/login.spec.ts
```

**⚠️ DO NOT commit**:
- Generated files (`test-results/`, `playwright-report/`)
- IDE settings (`.vscode/`, `.idea/`)
- Secrets or credentials

---

### 6. Create Commit

**Using GitHub MCP** for commit creation.

**Commit message format**:
```
<type>: <short description>

<detailed description>

Tests: <test IDs implemented (e.g., Test 21-22)>
```

**Types**:
- `feat` - New feature implementation
- `test` - New test implementation
- `fix` - Bug fix
- `refactor` - Code refactoring
- `docs` - Documentation changes

**Example commit message**:
```
test: Implement landing page navigation tests

- Added eventsLink to HomePage with ID-based locator
- Updated signInModal locator to use data-testid
- Implemented navigateToEvents in HomePageSteps
- Created landing_page_21_30.spec.ts with 2 tests
- All locators extracted via Playwright MCP

Tests: Test 21-22 (Store and Events navigation)
```

**Create commit**:

```bash
git commit -m "test: Implement landing page navigation tests

- Added eventsLink to HomePage with ID-based locator
- Updated signInModal locator to use data-testid
- Implemented navigateToEvents in HomePageSteps
- Created landing_page_21_30.spec.ts with 2 tests
- All locators extracted via Playwright MCP

Tests: Test 21-22 (Store and Events navigation)"
```

---

### 7. Push Branch to Remote

```bash
git push -u origin feature/your-feature-name
```

**Example**:
```bash
git push -u origin feature/authentication-tests
```

---

### 8. Create Pull Request (GitHub MCP)

**Using `mcp__github__create_pull_request` tool.**

**PR Title Format**:
```
[Feature] Short description of implementation
```

**PR Body Format**:
```markdown
## Summary
- Brief description of what was implemented
- Key files added/modified
- Test IDs implemented (e.g., Test 21-22)

## Specification Reference
(Include relevant Gherkin scenarios from the specification)

## Implementation Details
- Page Objects updated: <list>
- Steps created/updated: <list>
- Spec files created: <list>
- Locators verified via MCP: Yes/No

## Testing
- [ ] All tests pass locally
- [ ] Playwright report generated successfully
- [ ] Page Object Map updated
- [ ] All patterns followed (locators, page-objects, steps)

## Checklist
- [ ] Locators extracted via Playwright MCP
- [ ] Page Objects updated with robust selectors
- [ ] Steps classes implement business logic
- [ ] Playwright spec files created
- [ ] Tests pass 100%
- [ ] Code follows coding standards

## Test Execution
\`\`\`bash
npx playwright test tests/landing_page_21_30.spec.ts
\`\`\`

**Result**: ✅ All tests PASSED (2 passed)
```

**MCP Tool Call**:
```python
mcp__github__create_pull_request(
    owner="<repo-owner>",
    repo="<repo-name>",
    title="[Test] Landing page navigation tests (Test 21-22)",
    head="test/landing-page-navigation",  # Your new branch
    base="main",                           # Target branch (where you branched from)
    body="""<PR body from template above>""",
    draft=False
)
```

---

### 9. Result

**Successful workflow produces**:
1. ✅ New branch created from base branch
2. ✅ All code committed with descriptive message
3. ✅ Branch pushed to remote
4. ✅ **Open Pull Request** (NOT merged!)

**DO NOT merge** - Leave PR open for review.

---

## Important Rules

### DO:
- ✅ Create branch from current branch
- ✅ Verify ALL tests pass before commit
- ✅ Use descriptive commit messages
- ✅ Update page-object-map.md before commit
- ✅ Create detailed PR description
- ✅ Leave PR open (not merged)

### DON'T:
- ❌ Commit without testing
- ❌ Commit failing tests
- ❌ Merge PR automatically
- ❌ Use vague commit messages
- ❌ Commit generated files
- ❌ Skip PR creation
- ❌ Skip locator verification via MCP

---

## Troubleshooting

### Tests Fail Before Commit
**Problem**: Tests don't pass 100%

**Solution**:
1. ❌ DO NOT commit failing code
2. Fix the failing tests
3. Re-run test suite
4. Only proceed when all tests PASS

### Merge Conflicts
**Problem**: Base branch has changed since you branched

**Solution**:
1. Fetch latest changes: `git fetch origin`
2. Rebase your branch: `git rebase origin/main`
3. Resolve conflicts if any
4. Force push: `git push -f origin feature/your-branch`

### Forgot to Update Map
**Problem**: Created PR but forgot to update page-object-map.md

**Solution**:
1. Update `docs/maps/page-object-map.md`
2. Stage: `git add docs/maps/page-object-map.md`
3. Amend commit: `git commit --amend --no-edit`
4. Force push: `git push -f origin feature/your-branch`

---

## GitHub MCP Tools Reference

### Create Pull Request
```python
mcp__github__create_pull_request(
    owner: str,        # Repository owner
    repo: str,         # Repository name
    title: str,        # PR title
    head: str,         # Source branch (your feature branch)
    base: str,         # Target branch (usually main)
    body: str,         # PR description (markdown)
    draft: bool        # False for regular PR, True for draft
)
```

### Get Repository Info
```python
mcp__github__get_me()  # Get authenticated user info
```

### List Branches
```python
mcp__github__list_branches(
    owner: str,
    repo: str
)
```

---

## Summary

**Git workflow execution order**:

1. Get current branch → Identify base
2. Create new branch → Feature branch from base
3. Write code → Complete implementation
4. Verify tests → 100% pass required
5. Stage changes → git add
6. Commit → Descriptive message
7. Push branch → To remote
8. Create PR → GitHub MCP tool
9. **Result** → Open PR (NOT merged)

**Final deliverable**: Open Pull Request ready for review.

---

**See also:**
- [workflow.md](../workflow.md) - Complete BDD workflow
- [coding-standards.md](../coding-standards.md) - Code style
- [page-object.md](page-object.md) - Page Object rules
