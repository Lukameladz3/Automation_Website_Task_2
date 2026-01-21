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



** task 2 requirements **
Key Requirements
Success Criteria
### 1. Parallel Execution
- All hybrid tests must run with **at least 4 workers**
- Each worker creates its own unique user via API
- No shared state between tests
- Worker-specific email addresses (use worker index)



### 2. Test Data Management
- **Unique users per worker**
- **Use DataFactory** for user data generation
- **Cleanup after each test** via API
- **No hardcoded credentials**

### 3. Error Handling
- API failures should fail fast with clear messages
- UI failures should provide context about API setup
- Cleanup should run even if test fails

### 4. Performance
- API setup should be **faster than UI setup**
- Measure and compare execution times
- Parallel execution should not create bottlenecks

### 5. Code Quality
- Follow existing Page Object Model patterns
- Use `@step` decorator on all API Steps methods
- Reuse existing UI Steps and Page Objects
- No duplication of existing code
- Update Steps Map and documentation



Notes
**Keep original tests**: Don't delete original UI-only tests
**Naming convention**: Add `_Hybrid` suffix to new test files
**Reuse code**: Extend existing Steps and Page Objects
**API vs UI**: Use API for setup/teardown, UI for actual user flows
**Validation**: Always verify API-created data in UI when possible
For negative API scenarios, assert body.responseCode (HTTP may still be 200).
### Functional
- ✅ All hybrid tests pass consistently
- ✅ API-created users can login via UI
- ✅ User data matches between API and UI
- ✅ All cleanup operations succeed
- ✅ Tests are independent (no shared state)



### Technical
- ✅ API Steps follow framework patterns
- ✅ Proper error handling and assertions
- ✅ Parallel execution works correctly
- ✅ No race conditions or conflicts
- ✅ Execution time is faster than pure UI tests

### Code Quality
- ✅ Clean, maintainable code
- ✅ Proper TypeScript types
- ✅ Comprehensive assertions with messages
- ✅ Updated documentation and maps
- ✅ Follows all framework rules

