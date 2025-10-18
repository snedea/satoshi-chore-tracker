/**
 * Integration tests for data persistence
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { setupLocalStorage, cleanupLocalStorage, setupCrypto, createMockChore } from '../helpers/testUtils.js';
import {
  init,
  getUser,
  getChores,
  addChore,
  completeChore,
  exportData,
  importData,
  reset
} from '../../src/state/store.js';
import { storage } from '../../src/services/storage.js';

describe('Data Persistence Integration', () => {
  beforeEach(() => {
    setupLocalStorage();
    setupCrypto();
    cleanupLocalStorage();
    init();
  });

  test('should save state to localStorage on changes', () => {
    // Add a chore
    addChore(createMockChore({ title: 'Test Persistence' }));

    // Check localStorage directly
    const savedChores = storage.load('chores');
    expect(savedChores).toBeTruthy();
    expect(savedChores).toHaveLength(1);
    expect(savedChores[0].title).toBe('Test Persistence');
  });

  test('should restore state from localStorage on load', () => {
    // Add and complete a chore
    addChore(createMockChore({ title: 'Test Load', reward: 100 }));
    const chores = getChores();
    completeChore(chores[0].id);

    const balance = getUser().balance;
    expect(balance).toBe(100);

    // Simulate page reload by reinitializing
    init();

    // State should be restored
    const restoredUser = getUser();
    expect(restoredUser.balance).toBe(100);

    const restoredChores = getChores();
    expect(restoredChores).toHaveLength(1);
    expect(restoredChores[0].title).toBe('Test Load');
    expect(restoredChores[0].status).toBe('completed');
  });

  test('should export and import data correctly', () => {
    // Create some data
    addChore(createMockChore({ title: 'Chore 1', reward: 100 }));
    addChore(createMockChore({ title: 'Chore 2', reward: 200 }));

    const chores = getChores();
    completeChore(chores[0].id);

    // Export data
    const exportedData = exportData();
    expect(exportedData).toBeTruthy();

    const parsed = JSON.parse(exportedData);
    expect(parsed.chores).toHaveLength(2);
    expect(parsed.user).toBeTruthy();
    expect(parsed.transactions).toHaveLength(1);

    // Reset state
    reset();

    // Verify state is reset
    expect(getChores()).toHaveLength(0);
    expect(getUser().balance).toBe(0);

    // Import data
    const success = importData(exportedData);
    expect(success).toBe(true);

    // Reinitialize to load imported data
    init();

    // Verify data was restored
    const restoredChores = getChores();
    expect(restoredChores).toHaveLength(2);
    expect(restoredChores.find(c => c.title === 'Chore 1')).toBeTruthy();
    expect(restoredChores.find(c => c.title === 'Chore 2')).toBeTruthy();

    const restoredUser = getUser();
    expect(restoredUser.balance).toBe(100);
  });

  test('should handle import of invalid data gracefully', () => {
    const invalidJSON = 'this is not json';
    const success = importData(invalidJSON);

    expect(success).toBe(false);
  });

  test('should persist user settings', () => {
    // Update user settings
    const user = getUser();
    user.settings.theme = 'dark';
    user.settings.soundEnabled = false;

    // Save to storage
    storage.save('user', user);

    // Reinitialize
    init();

    // Settings should be restored
    const restoredUser = getUser();
    expect(restoredUser.settings.theme).toBe('dark');
    expect(restoredUser.settings.soundEnabled).toBe(false);
  });
});
