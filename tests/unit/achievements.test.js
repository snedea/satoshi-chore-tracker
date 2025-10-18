/**
 * Tests for achievements service
 */

import { describe, test, expect } from 'vitest';
import { checkUnlocks, getProgress } from '../../src/services/achievements.js';
import { achievementList } from '../../src/data/achievements.js';
import { createMockUser, createMockChore, createMockTransaction } from '../helpers/testUtils.js';

describe('Achievements Service', () => {
  describe('checkUnlocks', () => {
    test('should unlock "first-chore" achievement after 1 chore', () => {
      const user = createMockUser();
      const chores = [
        createMockChore({ status: 'completed' })
      ];
      const transactions = [];
      const unlocked = [];

      const newUnlocks = checkUnlocks(user, chores, transactions, unlocked);

      expect(newUnlocks).toContain('first-chore');
    });

    test('should unlock "chore-master-5" after 5 chores', () => {
      const user = createMockUser();
      const chores = Array(5).fill(null).map(() =>
        createMockChore({ status: 'completed' })
      );
      const transactions = [];
      const unlocked = [];

      const newUnlocks = checkUnlocks(user, chores, transactions, unlocked);

      expect(newUnlocks).toContain('chore-master-5');
    });

    test('should not unlock already unlocked achievements', () => {
      const user = createMockUser();
      const chores = [
        createMockChore({ status: 'completed' })
      ];
      const transactions = [];
      const unlocked = [{ id: 'first-chore', unlocked: true }];

      const newUnlocks = checkUnlocks(user, chores, transactions, unlocked);

      expect(newUnlocks).not.toContain('first-chore');
    });

    test('should unlock sat collector achievements', () => {
      const user = createMockUser();
      const chores = [];
      const transactions = [
        createMockTransaction({ type: 'earn', amount: 50 }),
        createMockTransaction({ type: 'earn', amount: 60 })
      ];
      const unlocked = [];

      const newUnlocks = checkUnlocks(user, chores, transactions, unlocked);

      expect(newUnlocks).toContain('sat-collector-100');
    });

    test('should unlock level achievement', () => {
      const user = createMockUser({ level: 5 });
      const chores = [];
      const transactions = [];
      const unlocked = [];

      const newUnlocks = checkUnlocks(user, chores, transactions, unlocked);

      expect(newUnlocks).toContain('level-5');
    });
  });

  describe('getProgress', () => {
    test('should calculate progress for chores_completed type', () => {
      const achievement = achievementList.find(a => a.id === 'first-chore');
      const user = createMockUser();
      const chores = [
        createMockChore({ status: 'completed' })
      ];
      const transactions = [];

      const progress = getProgress(achievement, user, chores, transactions);

      expect(progress).toBe(1);
    });

    test('should calculate progress for sats_earned type', () => {
      const achievement = achievementList.find(a => a.id === 'sat-collector-100');
      const user = createMockUser();
      const chores = [];
      const transactions = [
        createMockTransaction({ type: 'earn', amount: 50 }),
        createMockTransaction({ type: 'earn', amount: 30 })
      ];

      const progress = getProgress(achievement, user, chores, transactions);

      expect(progress).toBe(80);
    });

    test('should calculate progress for level_reached type', () => {
      const achievement = achievementList.find(a => a.id === 'level-5');
      const user = createMockUser({ level: 3 });
      const chores = [];
      const transactions = [];

      const progress = getProgress(achievement, user, chores, transactions);

      expect(progress).toBe(3);
    });
  });
});
