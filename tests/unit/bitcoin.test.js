/**
 * Tests for Bitcoin utilities
 */

import { describe, test, expect } from 'vitest';
import {
  formatSats,
  formatBTC,
  satsToBTC,
  btcToSats,
  addSats,
  subtractSats
} from '../../src/utils/bitcoin.js';

describe('Bitcoin Utilities', () => {
  describe('formatSats', () => {
    test('should format satoshis with thousands separator', () => {
      expect(formatSats(1000)).toBe('1,000 sats');
      expect(formatSats(1234567)).toBe('1,234,567 sats');
      expect(formatSats(100)).toBe('100 sats');
      expect(formatSats(0)).toBe('0 sats');
    });
  });

  describe('formatBTC', () => {
    test('should format satoshis as BTC with 8 decimals', () => {
      expect(formatBTC(100000000)).toBe('1.00000000 BTC');
      expect(formatBTC(50000000)).toBe('0.50000000 BTC');
      expect(formatBTC(1)).toBe('0.00000001 BTC');
    });
  });

  describe('satsToBTC', () => {
    test('should convert satoshis to BTC', () => {
      expect(satsToBTC(100000000)).toBe(1);
      expect(satsToBTC(50000000)).toBe(0.5);
      expect(satsToBTC(1)).toBe(0.00000001);
      expect(satsToBTC(0)).toBe(0);
    });
  });

  describe('btcToSats', () => {
    test('should convert BTC to satoshis', () => {
      expect(btcToSats(1)).toBe(100000000);
      expect(btcToSats(0.5)).toBe(50000000);
      expect(btcToSats(0.00000001)).toBe(1);
      expect(btcToSats(0)).toBe(0);
    });

    test('should round to nearest satoshi', () => {
      expect(btcToSats(0.000000015)).toBe(2);
      expect(btcToSats(0.000000014)).toBe(1);
    });
  });

  describe('addSats', () => {
    test('should add satoshi amounts', () => {
      expect(addSats(100, 50)).toBe(150);
      expect(addSats(1000, 2000)).toBe(3000);
      expect(addSats(0, 100)).toBe(100);
    });
  });

  describe('subtractSats', () => {
    test('should subtract satoshi amounts', () => {
      expect(subtractSats(100, 50)).toBe(50);
      expect(subtractSats(1000, 200)).toBe(800);
      expect(subtractSats(100, 100)).toBe(0);
    });
  });
});
