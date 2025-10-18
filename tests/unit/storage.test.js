/**
 * Tests for storage service
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { setupLocalStorage, cleanupLocalStorage } from '../helpers/testUtils.js';
import {
  isAvailable,
  save,
  load,
  remove,
  clear,
  exportAll,
  importAll
} from '../../src/services/storage.js';

describe('Storage Service', () => {
  beforeEach(() => {
    setupLocalStorage();
    cleanupLocalStorage();
  });

  describe('isAvailable', () => {
    test('should return true when localStorage is available', () => {
      expect(isAvailable()).toBe(true);
    });
  });

  describe('save and load', () => {
    test('should save and load data correctly', () => {
      const data = { name: 'Test', value: 123 };
      save('test', data);

      const loaded = load('test');
      expect(loaded).toEqual(data);
    });

    test('should return null for missing keys', () => {
      const loaded = load('nonexistent');
      expect(loaded).toBeNull();
    });

    test('should handle complex objects', () => {
      const data = {
        nested: { deep: { value: 'test' } },
        array: [1, 2, 3],
        bool: true,
        null: null
      };

      save('complex', data);
      const loaded = load('complex');
      expect(loaded).toEqual(data);
    });
  });

  describe('remove', () => {
    test('should remove data from storage', () => {
      save('test', { value: 123 });
      expect(load('test')).toBeTruthy();

      remove('test');
      expect(load('test')).toBeNull();
    });
  });

  describe('clear', () => {
    test('should clear all app data', () => {
      save('test1', { value: 1 });
      save('test2', { value: 2 });

      clear();

      expect(load('test1')).toBeNull();
      expect(load('test2')).toBeNull();
    });
  });

  describe('exportAll', () => {
    test('should export all data as JSON string', () => {
      save('user', { name: 'Alice' });
      save('chores', [{ id: 1, title: 'Test' }]);

      const exported = exportAll();
      const parsed = JSON.parse(exported);

      expect(parsed.user).toEqual({ name: 'Alice' });
      expect(parsed.chores).toEqual([{ id: 1, title: 'Test' }]);
    });

    test('should return empty object JSON when no data', () => {
      const exported = exportAll();
      expect(exported).toBe('{}');
    });
  });

  describe('importAll', () => {
    test('should import data from JSON string', () => {
      const data = {
        user: { name: 'Bob' },
        chores: [{ id: 1 }]
      };

      const jsonString = JSON.stringify(data);
      const success = importAll(jsonString);

      expect(success).toBe(true);
      expect(load('user')).toEqual({ name: 'Bob' });
      expect(load('chores')).toEqual([{ id: 1 }]);
    });

    test('should return false for invalid JSON', () => {
      const success = importAll('invalid json');
      expect(success).toBe(false);
    });
  });
});
