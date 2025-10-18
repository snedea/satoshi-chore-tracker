# Testing Documentation
## Satoshi's Chore Tracker

Comprehensive guide to testing strategies, running tests, and writing new tests.

---

## Table of Contents

1. [Testing Overview](#testing-overview)
2. [Running Tests](#running-tests)
3. [Test Structure](#test-structure)
4. [Unit Tests](#unit-tests)
5. [Integration Tests](#integration-tests)
6. [Manual Testing](#manual-testing)
7. [Writing New Tests](#writing-new-tests)
8. [Test Coverage](#test-coverage)
9. [Troubleshooting](#troubleshooting)

---

## Testing Overview

### Testing Philosophy

Our testing strategy prioritizes:
1. **Critical path coverage** - Core features must work
2. **Real-world scenarios** - Test actual user workflows
3. **Fast feedback** - Tests run quickly during development
4. **Maintainability** - Tests are easy to understand and update

### Test Types

**Unit Tests (80% of tests)**
- Test individual functions and modules in isolation
- Fast execution (milliseconds)
- Mock dependencies
- Focus on edge cases and error handling

**Integration Tests (15% of tests)**
- Test multiple modules working together
- Complete user workflows
- Realistic data flow
- Verify end-to-end functionality

**Manual Tests (5% of tests)**
- Browser compatibility
- Visual appearance
- Animation smoothness
- Accessibility

### Technology Stack

- **Framework:** Vitest 1.0
- **Environment:** jsdom (browser-like Node environment)
- **Coverage:** @vitest/coverage-v8
- **Mocking:** Vitest's built-in mocks
- **Assertions:** Vitest expect (Jest-compatible)

---

## Running Tests

### Quick Start

```bash
# Run all tests once
npm test

# Run tests in watch mode (recommended for development)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Commands Explained

**`npm test`**
- Runs all tests once
- Exits with code 0 (success) or 1 (failure)
- Use in CI/CD pipelines
- Output: Summary of passing/failing tests

**`npm run test:watch`**
- Runs tests in watch mode
- Re-runs tests when files change
- Interactive UI for filtering tests
- Use during development

**`npm run test:coverage`**
- Runs all tests once
- Generates coverage report
- Creates `coverage/` directory with HTML report
- Shows coverage percentages per file

### Viewing Coverage Reports

```bash
# Generate coverage
npm run test:coverage

# Open HTML report in browser
open coverage/index.html
# Or on Linux: xdg-open coverage/index.html
# Or on Windows: start coverage/index.html
```

Coverage report shows:
- % Statements covered
- % Branches covered
- % Functions covered
- % Lines covered
- Highlighted code showing covered/uncovered lines

---

## Test Structure

### Directory Organization

```
tests/
├── unit/                      # Unit tests
│   ├── validators.test.js     # Input validation tests
│   ├── bitcoin.test.js        # Bitcoin utility tests
│   ├── dateUtils.test.js      # Date utility tests
│   ├── storage.test.js        # Storage service tests
│   ├── store.test.js          # State management tests
│   └── achievements.test.js   # Achievement logic tests
│
├── integration/               # Integration tests
│   ├── choreFlow.test.js      # Complete chore workflow
│   ├── persistence.test.js    # Data save/load/export/import
│   └── parentMode.test.js     # Parent mode functionality
│
└── helpers/
    └── testUtils.js           # Shared test utilities
```

### Test File Naming

Convention: `[module-name].test.js`

Examples:
- `src/utils/bitcoin.js` → `tests/unit/bitcoin.test.js`
- `src/services/storage.js` → `tests/unit/storage.test.js`

### Test File Structure

```javascript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { moduleToTest } from '../src/module';

describe('Module Name', () => {
  // Setup before each test
  beforeEach(() => {
    // Reset state, mocks, etc.
  });

  // Cleanup after each test
  afterEach(() => {
    // Clear mocks, restore spies, etc.
  });

  describe('functionName()', () => {
    it('should handle normal case correctly', () => {
      // Arrange
      const input = 'test';

      // Act
      const result = moduleToTest.functionName(input);

      // Assert
      expect(result).toBe('expected output');
    });

    it('should handle edge case', () => {
      // Test edge case
    });

    it('should handle error case', () => {
      // Test error handling
    });
  });
});
```

---

## Unit Tests

### Validators Tests

**File:** `tests/unit/validators.test.js`

**What it tests:**
- Chore title validation (length, special chars)
- Reward amount validation (min/max, numeric)
- User name validation
- PIN validation (4 digits)
- HTML sanitization (XSS prevention)

**Example:**
```javascript
describe('validateChoreTitle', () => {
  it('should accept valid titles', () => {
    expect(validators.validateChoreTitle('Clean room')).toBe(true);
    expect(validators.validateChoreTitle('Do homework')).toBe(true);
  });

  it('should reject empty titles', () => {
    expect(validators.validateChoreTitle('')).toBe(false);
    expect(validators.validateChoreTitle('   ')).toBe(false);
  });

  it('should reject titles too long', () => {
    const longTitle = 'a'.repeat(101);
    expect(validators.validateChoreTitle(longTitle)).toBe(false);
  });
});
```

### Bitcoin Utils Tests

**File:** `tests/unit/bitcoin.test.js`

**What it tests:**
- Satoshi formatting (1000 → "1,000 sats")
- BTC formatting (100000000 → "1.00000000 BTC")
- Sats to BTC conversion
- BTC to sats conversion
- Satoshi arithmetic (addition, subtraction)

**Critical test cases:**
```javascript
describe('Bitcoin Utils', () => {
  it('should format satoshis with thousands separator', () => {
    expect(bitcoin.formatSats(1000)).toBe('1,000 sats');
    expect(bitcoin.formatSats(1000000)).toBe('1,000,000 sats');
  });

  it('should convert 100M sats to 1 BTC', () => {
    expect(bitcoin.satsToBTC(100000000)).toBe(1);
  });

  it('should handle zero correctly', () => {
    expect(bitcoin.formatSats(0)).toBe('0 sats');
  });
});
```

### Storage Tests

**File:** `tests/unit/storage.test.js`

**What it tests:**
- Save/load operations
- JSON serialization/deserialization
- Error handling for corrupted data
- localStorage availability check
- Export/import functionality

**Mocking localStorage:**
```javascript
beforeEach(() => {
  // Mock localStorage
  const localStorageMock = {
    data: {},
    getItem(key) {
      return this.data[key] || null;
    },
    setItem(key, value) {
      this.data[key] = value;
    },
    removeItem(key) {
      delete this.data[key];
    },
    clear() {
      this.data = {};
    }
  };

  global.localStorage = localStorageMock;
});
```

### Store Tests

**File:** `tests/unit/store.test.js`

**What it tests:**
- State initialization
- Adding/updating/deleting chores
- Completing chores (balance update, transaction creation)
- Event emission and subscription
- Achievement unlock detection
- Data persistence

**Example:**
```javascript
describe('Store - Chore Completion', () => {
  it('should update balance when chore completed', () => {
    const chore = {
      id: '1',
      title: 'Test chore',
      reward: 100,
      status: 'pending'
    };

    store.addChore(chore);
    const initialBalance = store.getUser().balance;

    store.completeChore('1');

    expect(store.getUser().balance).toBe(initialBalance + 100);
  });

  it('should create transaction record', () => {
    store.addChore({ id: '1', reward: 50, status: 'pending' });
    store.completeChore('1');

    const transactions = store.getTransactions();
    expect(transactions).toHaveLength(1);
    expect(transactions[0].amount).toBe(50);
    expect(transactions[0].type).toBe('earn');
  });

  it('should emit chore:completed event', () => {
    const callback = vi.fn();
    store.subscribe('chore:completed', callback);

    store.addChore({ id: '1', reward: 50, status: 'pending' });
    store.completeChore('1');

    expect(callback).toHaveBeenCalledWith({ choreId: '1', reward: 50 });
  });
});
```

### Achievements Tests

**File:** `tests/unit/achievements.test.js`

**What it tests:**
- Achievement unlock conditions
- Progress calculation
- Multiple achievement types
- Edge cases (exactly meeting requirement)

---

## Integration Tests

### Chore Flow Test

**File:** `tests/integration/choreFlow.test.js`

**What it tests:**
Complete workflow from creating to completing a chore:

1. User creates chore (via parent mode)
2. Chore appears in chore list
3. User completes chore
4. Balance increases
5. Transaction is recorded
6. Achievement unlocks (if applicable)
7. State persists to localStorage

**Example:**
```javascript
describe('Complete Chore Workflow', () => {
  it('should handle full chore lifecycle', () => {
    // 1. Initialize
    store.reset();
    const initialBalance = store.getUser().balance;

    // 2. Create chore
    const chore = {
      id: '1',
      title: 'Clean room',
      description: 'Vacuum and dust',
      reward: 100,
      category: 'household',
      difficulty: 'medium',
      status: 'pending'
    };
    store.addChore(chore);

    // 3. Verify chore exists
    expect(store.getChores()).toHaveLength(1);
    expect(store.getChores()[0].status).toBe('pending');

    // 4. Complete chore
    store.completeChore('1');

    // 5. Verify state changes
    expect(store.getChores()[0].status).toBe('completed');
    expect(store.getUser().balance).toBe(initialBalance + 100);

    // 6. Verify transaction created
    const transactions = store.getTransactions();
    expect(transactions).toHaveLength(1);
    expect(transactions[0].amount).toBe(100);
    expect(transactions[0].choreId).toBe('1');

    // 7. Verify achievement unlock
    const achievements = store.getAchievements();
    const firstSteps = achievements.find(a => a.id === 'first-chore');
    expect(firstSteps.unlocked).toBe(true);

    // 8. Verify localStorage persistence
    const savedChores = storage.load('satoshi_chores');
    expect(savedChores[0].status).toBe('completed');
  });
});
```

### Persistence Test

**File:** `tests/integration/persistence.test.js`

**What it tests:**
- Save state to localStorage
- Load state from localStorage
- Export data as JSON
- Import data from JSON
- Handle corrupted data gracefully

**Example:**
```javascript
describe('Data Persistence', () => {
  it('should survive page reload', () => {
    // Setup initial state
    store.reset();
    store.addChore({
      id: '1',
      title: 'Test',
      reward: 50,
      status: 'pending'
    });
    store.completeChore('1');

    const balanceBeforeReload = store.getUser().balance;

    // Simulate page reload
    store.load();

    // Verify data restored
    expect(store.getUser().balance).toBe(balanceBeforeReload);
    expect(store.getChores()[0].status).toBe('completed');
  });

  it('should export and import correctly', () => {
    // Create some data
    store.reset();
    store.addChore({ id: '1', title: 'Test', reward: 50 });
    store.completeChore('1');

    // Export
    const exported = store.exportData();
    expect(typeof exported).toBe('string');

    // Clear state
    store.reset();
    expect(store.getChores()).toHaveLength(0);

    // Import
    store.importData(exported);

    // Verify restoration
    expect(store.getChores()).toHaveLength(1);
    expect(store.getChores()[0].status).toBe('completed');
  });
});
```

### Parent Mode Test

**File:** `tests/integration/parentMode.test.js`

**What it tests:**
- PIN setting and verification
- Creating chores in parent mode
- Deleting chores (parent only)
- Access restrictions

---

## Manual Testing

Some aspects require manual browser testing:

### Visual Testing Checklist

- [ ] **Layout**
  - Components align correctly
  - Responsive design works (mobile, tablet, desktop)
  - No horizontal scroll on any screen size

- [ ] **Typography**
  - Fonts load correctly
  - Text is readable (size, contrast)
  - No text overflow or truncation issues

- [ ] **Colors**
  - Color scheme is appealing
  - Sufficient contrast (WCAG AA)
  - Dark mode works (if enabled)

- [ ] **Animations**
  - Chore completion celebration plays smoothly
  - Coin earn animation works
  - Transitions are smooth (no jank)
  - No flickering or visual glitches

### Functional Testing Checklist

- [ ] **Navigation**
  - All nav links work
  - Browser back/forward buttons work
  - URLs update correctly

- [ ] **Chore Management**
  - Can create chore
  - Can edit chore
  - Can delete chore
  - Can complete chore
  - Recurring chores reset properly

- [ ] **Learning Modules**
  - Lessons display correctly
  - Quiz works
  - Rewards granted
  - Progress tracked

- [ ] **Data Persistence**
  - Data persists after page reload
  - Export downloads JSON file
  - Import restores data
  - Reset clears all data

- [ ] **Parent Mode**
  - PIN required
  - Can create/edit/delete chores
  - PIN change works

### Browser Compatibility Testing

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest, macOS/iOS)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Screen reader friendly (test with VoiceOver/NVDA)
- [ ] Focus indicators visible
- [ ] Color contrast sufficient
- [ ] Touch targets ≥ 44x44px

### Performance Testing

- [ ] Page load < 3 seconds (3G network)
- [ ] Animations run at 60fps
- [ ] No lag when scrolling
- [ ] localStorage operations quick (< 50ms)

---

## Writing New Tests

### When to Write Tests

**Always test:**
- New utility functions
- New services
- State management changes
- Critical user flows
- Bug fixes (regression tests)

**Consider testing:**
- UI components (if complex logic)
- Edge cases
- Error handling paths

### Test-Driven Development (TDD)

Recommended approach:

1. **Write test first** (it will fail)
2. **Write minimal code** to make it pass
3. **Refactor** while keeping tests green
4. **Repeat**

**Example TDD workflow:**

```javascript
// 1. Write failing test
describe('calculateDiscount()', () => {
  it('should apply 10% discount for 100+ sats', () => {
    expect(calculateDiscount(1000)).toBe(100);
  });
});

// 2. Implement function
export function calculateDiscount(sats) {
  if (sats >= 100) {
    return sats * 0.1;
  }
  return 0;
}

// 3. Test passes!

// 4. Add edge cases
it('should return 0 for amounts < 100', () => {
  expect(calculateDiscount(50)).toBe(0);
});

it('should handle zero', () => {
  expect(calculateDiscount(0)).toBe(0);
});
```

### Testing Best Practices

**1. Arrange-Act-Assert (AAA) Pattern**

```javascript
it('should do something', () => {
  // Arrange: Set up test data
  const input = 'test';
  const expected = 'TEST';

  // Act: Execute the code
  const result = toUpperCase(input);

  // Assert: Verify result
  expect(result).toBe(expected);
});
```

**2. One Assertion Per Test (Preferred)**

```javascript
// Good - clear failure messages
it('should update balance', () => {
  expect(store.getUser().balance).toBe(100);
});

it('should create transaction', () => {
  expect(store.getTransactions()).toHaveLength(1);
});

// Acceptable - related assertions
it('should complete chore correctly', () => {
  expect(chore.status).toBe('completed');
  expect(chore.completedAt).toBeTruthy();
});
```

**3. Descriptive Test Names**

```javascript
// Bad
it('works', () => { ... });

// Good
it('should return formatted satoshi string with thousands separator', () => { ... });
```

**4. Test Edge Cases**

```javascript
describe('divide()', () => {
  it('should divide positive numbers', () => { ... });
  it('should handle zero dividend', () => { ... });
  it('should throw error for zero divisor', () => { ... });
  it('should handle negative numbers', () => { ... });
  it('should handle very large numbers', () => { ... });
});
```

**5. Use Test Helpers**

```javascript
// tests/helpers/testUtils.js
export function createMockChore(overrides = {}) {
  return {
    id: '1',
    title: 'Test chore',
    reward: 100,
    status: 'pending',
    ...overrides
  };
}

// In test file
const chore = createMockChore({ reward: 500 });
```

---

## Test Coverage

### Current Coverage

As of latest build:
- **Overall:** ~88%
- **Critical modules:** 100%
  - validators.js
  - bitcoin.js
  - achievements.js
- **Good coverage:** 80-90%
  - storage.js
  - store.js
- **Needs improvement:** < 80%
  - Some integration flows

### Coverage Goals

**Minimum acceptable:**
- Overall: 80%
- Critical paths: 100%
- Utilities: 90%
- Services: 85%

### Improving Coverage

**1. Identify uncovered code:**
```bash
npm run test:coverage
open coverage/index.html
```

Look for red/yellow highlighted lines.

**2. Write tests for uncovered paths:**
- Focus on critical functionality first
- Then error handling
- Then edge cases

**3. Don't chase 100% blindly:**
- Some code is hard to test (DOM manipulation)
- Some code is trivial (getters)
- Focus on valuable tests

---

## Troubleshooting

### Common Test Failures

**Issue: localStorage is not defined**

```javascript
// Solution: Mock localStorage in test
beforeEach(() => {
  global.localStorage = {
    data: {},
    getItem(key) { return this.data[key] || null; },
    setItem(key, value) { this.data[key] = value; },
    clear() { this.data = {}; }
  };
});
```

**Issue: Tests fail randomly (flaky tests)**

Causes:
- Shared state between tests
- Async timing issues
- Date/time dependencies

Solutions:
```javascript
// Reset state before each test
beforeEach(() => {
  store.reset();
  localStorage.clear();
});

// Mock dates
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2025-01-01'));
});
afterEach(() => {
  vi.useRealTimers();
});
```

**Issue: Test timeout**

```javascript
// Increase timeout for slow tests
it('slow operation', async () => {
  // Test code
}, 10000); // 10 second timeout
```

**Issue: Cannot find module**

```bash
# Ensure you're using correct import paths
import { module } from '../src/module'; // ✓
import { module } from 'src/module';    // ✗
```

### Debugging Tests

**1. Use console.log**
```javascript
it('debug test', () => {
  const result = functionUnderTest();
  console.log('Result:', result);
  expect(result).toBe(expected);
});
```

**2. Use debugger**
```javascript
it('debug test', () => {
  debugger; // Execution will pause here
  const result = functionUnderTest();
});
```

Then run:
```bash
node --inspect-brk node_modules/.bin/vitest run
```

**3. Run single test**
```javascript
it.only('this test only', () => {
  // Only this test will run
});
```

**4. Skip test**
```javascript
it.skip('broken test', () => {
  // This test will be skipped
});
```

---

## Continuous Integration

### Running Tests in CI

Add to CI pipeline (GitHub Actions example):

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm test
      - run: npm run test:coverage
```

### Test Requirements for PRs

- [ ] All tests must pass
- [ ] Coverage must not decrease
- [ ] New features must include tests
- [ ] Bug fixes must include regression tests

---

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Best Practices](https://testingjavascript.com/)
- [Jest Matchers (compatible with Vitest)](https://jestjs.io/docs/expect)

---

**Keep tests fast, reliable, and valuable!** 🧪✅
