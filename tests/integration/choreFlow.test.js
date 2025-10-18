/**
 * Integration tests for complete chore workflow
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { setupLocalStorage, cleanupLocalStorage, setupCrypto, createMockChore } from '../helpers/testUtils.js';
import {
  init,
  getUser,
  getChores,
  getTransactions,
  addChore,
  completeChore,
  getPendingChores,
  getCompletedChores
} from '../../src/state/store.js';

describe('Complete Chore Workflow Integration', () => {
  beforeEach(() => {
    setupLocalStorage();
    setupCrypto();
    cleanupLocalStorage();
    init();
  });

  test('should complete full chore cycle: create → complete → earn sats', () => {
    // 1. Check initial state
    const initialUser = getUser();
    expect(initialUser.balance).toBe(0);
    expect(getChores()).toHaveLength(0);

    // 2. Add a chore
    const choreData = createMockChore({
      title: 'Make bed',
      reward: 100
    });

    addChore(choreData);

    // 3. Verify chore was added
    const chores = getChores();
    expect(chores).toHaveLength(1);
    expect(chores[0].status).toBe('pending');

    const pendingChores = getPendingChores();
    expect(pendingChores).toHaveLength(1);

    // 4. Complete the chore
    completeChore(chores[0].id);

    // 5. Verify balance increased
    const updatedUser = getUser();
    expect(updatedUser.balance).toBe(100);

    // 6. Verify chore status changed
    const completedChores = getCompletedChores();
    expect(completedChores).toHaveLength(1);
    expect(completedChores[0].status).toBe('completed');
    expect(completedChores[0].completedAt).toBeTruthy();

    // 7. Verify transaction was created
    const transactions = getTransactions();
    expect(transactions).toHaveLength(1);
    expect(transactions[0].type).toBe('earn');
    expect(transactions[0].amount).toBe(100);
    expect(transactions[0].balanceAfter).toBe(100);

    // 8. Verify pending chores updated
    const remainingPending = getPendingChores();
    expect(remainingPending).toHaveLength(0);
  });

  test('should handle multiple chore completions', () => {
    // Add multiple chores
    addChore(createMockChore({ reward: 100 }));
    addChore(createMockChore({ reward: 200 }));
    addChore(createMockChore({ reward: 300 }));

    expect(getChores()).toHaveLength(3);

    // Complete first chore
    const chores1 = getChores();
    completeChore(chores1[0].id);

    let user = getUser();
    expect(user.balance).toBe(100);
    expect(getPendingChores()).toHaveLength(2);
    expect(getCompletedChores()).toHaveLength(1);

    // Complete second chore
    const chores2 = getPendingChores();
    completeChore(chores2[0].id);

    user = getUser();
    expect(user.balance).toBe(300); // 100 + 200
    expect(getPendingChores()).toHaveLength(1);
    expect(getCompletedChores()).toHaveLength(2);

    // Complete third chore
    const chores3 = getPendingChores();
    completeChore(chores3[0].id);

    user = getUser();
    expect(user.balance).toBe(600); // 100 + 200 + 300
    expect(getPendingChores()).toHaveLength(0);
    expect(getCompletedChores()).toHaveLength(3);

    // Verify all transactions
    const transactions = getTransactions();
    expect(transactions).toHaveLength(3);
  });

  test('should award XP and level up', () => {
    // Add chore worth 1000 sats (and thus 1000 XP)
    addChore(createMockChore({ reward: 1000 }));

    const initialUser = getUser();
    expect(initialUser.level).toBe(1);
    expect(initialUser.xp).toBe(0);

    // Complete chore
    const chores = getChores();
    completeChore(chores[0].id);

    // Verify level up
    const updatedUser = getUser();
    expect(updatedUser.xp).toBe(1000);
    expect(updatedUser.level).toBe(2); // Levels up at 1000 XP
  });

  test('should maintain transaction history order', () => {
    // Add and complete multiple chores
    for (let i = 0; i < 3; i++) {
      addChore(createMockChore({ reward: 100 * (i + 1) }));
      const chores = getPendingChores();
      completeChore(chores[0].id);
    }

    const transactions = getTransactions();

    // Transactions should be in reverse chronological order (newest first)
    expect(transactions).toHaveLength(3);
    expect(transactions[0].amount).toBe(300); // Last completed
    expect(transactions[1].amount).toBe(200);
    expect(transactions[2].amount).toBe(100); // First completed
  });
});
