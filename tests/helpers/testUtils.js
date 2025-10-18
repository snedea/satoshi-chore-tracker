/**
 * Test utilities and mocks
 */

// Mock localStorage
export class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }

  clear() {
    this.store = {};
  }

  get length() {
    return Object.keys(this.store).length;
  }

  key(index) {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  }
}

// Setup function for tests
export function setupLocalStorage() {
  global.localStorage = new LocalStorageMock();
}

// Cleanup function for tests
export function cleanupLocalStorage() {
  if (global.localStorage) {
    global.localStorage.clear();
  }
}

// Mock crypto.randomUUID
export function setupCrypto() {
  if (!global.crypto) {
    global.crypto = {};
  }

  let counter = 0;
  global.crypto.randomUUID = () => {
    counter++;
    return `test-uuid-${counter}`;
  };
}

// Create mock chore
export function createMockChore(overrides = {}) {
  return {
    id: crypto.randomUUID(),
    title: 'Test Chore',
    description: 'Test description',
    reward: 100,
    category: 'household',
    difficulty: 'medium',
    status: 'pending',
    createdAt: new Date().toISOString(),
    completedAt: null,
    recurring: false,
    recurrence: null,
    createdBy: 'parent',
    ...overrides
  };
}

// Create mock user
export function createMockUser(overrides = {}) {
  return {
    id: crypto.randomUUID(),
    name: 'Test User',
    avatar: '👤',
    balance: 0,
    level: 1,
    xp: 0,
    createdAt: new Date().toISOString(),
    parentMode: false,
    parentPin: null,
    settings: {
      difficulty: 'medium',
      soundEnabled: true,
      notificationsEnabled: false,
      theme: 'light'
    },
    ...overrides
  };
}

// Create mock transaction
export function createMockTransaction(overrides = {}) {
  return {
    id: crypto.randomUUID(),
    type: 'earn',
    amount: 100,
    description: 'Test transaction',
    choreId: null,
    timestamp: new Date().toISOString(),
    balanceAfter: 100,
    ...overrides
  };
}

// Wait for async operations
export function waitFor(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
