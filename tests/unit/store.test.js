/**
 * Tests for state store
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { setupLocalStorage, cleanupLocalStorage, setupCrypto, createMockChore } from '../helpers/testUtils.js';
import {
  init,
  getState,
  getUser,
  getChores,
  getPendingChores,
  getCompletedChores,
  addChore,
  updateChore,
  deleteChore,
  completeChore,
  subscribe,
  reset
} from '../../src/state/store.js';

describe('State Store', () => {
  beforeEach(() => {
    setupLocalStorage();
    setupCrypto();
    cleanupLocalStorage();
    reset();
    init();
  });

  describe('initialization', () => {
    test('should initialize with default state', () => {
      const state = getState();
      expect(state.user).toBeDefined();
      expect(state.chores).toEqual([]);
      expect(state.transactions).toEqual([]);
      expect(state.achievements).toEqual([]);
    });

    test('should create default user', () => {
      const user = getUser();
      expect(user.name).toBe('Satoshi Student');
      expect(user.balance).toBe(0);
      expect(user.level).toBe(1);
      expect(user.xp).toBe(0);
    });
  });

  describe('chore management', () => {
    test('should add chore to state', () => {
      const choreData = createMockChore({ title: 'Test Chore' });
      addChore(choreData);

      const chores = getChores();
      expect(chores).toHaveLength(1);
      expect(chores[0].title).toBe('Test Chore');
      expect(chores[0].id).toBeDefined();
    });

    test('should update chore in state', () => {
      const choreData = createMockChore({ title: 'Original' });
      addChore(choreData);

      const chores = getChores();
      const choreId = chores[0].id;

      updateChore(choreId, { title: 'Updated' });

      const updated = getChores();
      expect(updated[0].title).toBe('Updated');
    });

    test('should delete chore from state', () => {
      const choreData = createMockChore();
      addChore(choreData);

      let chores = getChores();
      expect(chores).toHaveLength(1);

      deleteChore(chores[0].id);

      chores = getChores();
      expect(chores).toHaveLength(0);
    });

    test('should get pending chores only', () => {
      addChore(createMockChore({ status: 'pending' }));
      addChore(createMockChore({ status: 'completed' }));

      const pending = getPendingChores();
      expect(pending).toHaveLength(1);
      expect(pending[0].status).toBe('pending');
    });

    test('should get completed chores only', () => {
      addChore(createMockChore({ status: 'pending' }));
      addChore(createMockChore({ status: 'completed' }));

      const completed = getCompletedChores();
      expect(completed).toHaveLength(1);
      expect(completed[0].status).toBe('completed');
    });
  });

  describe('chore completion', () => {
    test('should complete chore and award satoshis', () => {
      const choreData = createMockChore({ reward: 100 });
      addChore(choreData);

      const chores = getChores();
      const choreId = chores[0].id;

      completeChore(choreId);

      const user = getUser();
      expect(user.balance).toBe(100);

      const completedChores = getCompletedChores();
      expect(completedChores).toHaveLength(1);
      expect(completedChores[0].status).toBe('completed');
      expect(completedChores[0].completedAt).toBeDefined();
    });

    test('should create transaction on chore completion', () => {
      const choreData = createMockChore({ reward: 100, title: 'Test Chore' });
      addChore(choreData);

      const chores = getChores();
      completeChore(chores[0].id);

      const state = getState();
      expect(state.transactions).toHaveLength(1);
      expect(state.transactions[0].type).toBe('earn');
      expect(state.transactions[0].amount).toBe(100);
      expect(state.transactions[0].description).toContain('Test Chore');
    });

    test('should award XP and level up', () => {
      const choreData = createMockChore({ reward: 1000 });
      addChore(choreData);

      const chores = getChores();
      completeChore(chores[0].id);

      const user = getUser();
      expect(user.xp).toBe(1000);
      expect(user.level).toBe(2); // Level up at 1000 XP
    });

    test('should not complete already completed chore', () => {
      const choreData = createMockChore({ reward: 100 });
      addChore(choreData);

      const chores = getChores();
      const choreId = chores[0].id;

      completeChore(choreId);
      const balanceAfterFirst = getUser().balance;

      completeChore(choreId); // Try to complete again
      const balanceAfterSecond = getUser().balance;

      expect(balanceAfterFirst).toBe(balanceAfterSecond);
    });
  });

  describe('event system', () => {
    test('should emit events on state changes', (done) => {
      let eventFired = false;

      subscribe('chore:added', (chore) => {
        eventFired = true;
        expect(chore.title).toBe('Test Event');
        done();
      });

      addChore(createMockChore({ title: 'Test Event' }));

      expect(eventFired).toBe(true);
    });

    test('should emit balance change event', (done) => {
      subscribe('balance:changed', (data) => {
        expect(data.previous).toBe(0);
        expect(data.current).toBe(100);
        expect(data.change).toBe(100);
        done();
      });

      addChore(createMockChore({ reward: 100 }));
      const chores = getChores();
      completeChore(chores[0].id);
    });
  });
});
