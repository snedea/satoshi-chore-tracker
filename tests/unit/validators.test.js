/**
 * Tests for validators
 */

import { describe, test, expect } from 'vitest';
import {
  validateChoreTitle,
  validateReward,
  validateUserName,
  validatePIN,
  sanitizeHTML
} from '../../src/utils/validators.js';

describe('Validators', () => {
  describe('validateChoreTitle', () => {
    test('should validate valid titles', () => {
      const result = validateChoreTitle('Make bed');
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('should reject empty titles', () => {
      const result = validateChoreTitle('');
      expect(result.valid).toBe(false);
      expect(result.error).toBeTruthy();
    });

    test('should reject whitespace-only titles', () => {
      const result = validateChoreTitle('   ');
      expect(result.valid).toBe(false);
      expect(result.error).toBeTruthy();
    });

    test('should reject titles over 100 characters', () => {
      const longTitle = 'a'.repeat(101);
      const result = validateChoreTitle(longTitle);
      expect(result.valid).toBe(false);
      expect(result.error).toBeTruthy();
    });

    test('should reject non-string titles', () => {
      const result = validateChoreTitle(123);
      expect(result.valid).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe('validateReward', () => {
    test('should validate valid rewards', () => {
      const result = validateReward(100);
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('should reject rewards less than 1', () => {
      const result = validateReward(0);
      expect(result.valid).toBe(false);
      expect(result.error).toBeTruthy();
    });

    test('should reject rewards over 1,000,000', () => {
      const result = validateReward(1000001);
      expect(result.valid).toBe(false);
      expect(result.error).toBeTruthy();
    });

    test('should reject non-integer rewards', () => {
      const result = validateReward(100.5);
      expect(result.valid).toBe(false);
      expect(result.error).toBeTruthy();
    });

    test('should reject non-number rewards', () => {
      const result = validateReward('100');
      expect(result.valid).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe('validateUserName', () => {
    test('should validate valid names', () => {
      const result = validateUserName('Alice');
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('should reject empty names', () => {
      const result = validateUserName('');
      expect(result.valid).toBe(false);
      expect(result.error).toBeTruthy();
    });

    test('should reject names over 50 characters', () => {
      const longName = 'a'.repeat(51);
      const result = validateUserName(longName);
      expect(result.valid).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe('validatePIN', () => {
    test('should validate valid 4-digit PINs', () => {
      const result = validatePIN('1234');
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('should reject PINs with less than 4 digits', () => {
      const result = validatePIN('123');
      expect(result.valid).toBe(false);
      expect(result.error).toBeTruthy();
    });

    test('should reject PINs with more than 4 digits', () => {
      const result = validatePIN('12345');
      expect(result.valid).toBe(false);
      expect(result.error).toBeTruthy();
    });

    test('should reject PINs with non-digits', () => {
      const result = validatePIN('12a4');
      expect(result.valid).toBe(false);
      expect(result.error).toBeTruthy();
    });

    test('should reject empty PINs', () => {
      const result = validatePIN('');
      expect(result.valid).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe('sanitizeHTML', () => {
    test('should escape HTML tags', () => {
      expect(sanitizeHTML('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert("xss")&lt;/script&gt;');
      expect(sanitizeHTML('<b>bold</b>')).toBe('&lt;b&gt;bold&lt;/b&gt;');
    });

    test('should handle plain text', () => {
      expect(sanitizeHTML('Hello World')).toBe('Hello World');
    });

    test('should handle empty strings', () => {
      expect(sanitizeHTML('')).toBe('');
      expect(sanitizeHTML(null)).toBe('');
      expect(sanitizeHTML(undefined)).toBe('');
    });
  });
});
