/**
 * Bitcoin utility functions for satoshi calculations and formatting
 */

const SATS_PER_BTC = 100000000;

/**
 * Format satoshis with thousands separator
 * @param {number} sats - Amount in satoshis
 * @returns {string} Formatted string (e.g., "1,234 sats")
 */
export function formatSats(sats) {
  return `${sats.toLocaleString()} sats`;
}

/**
 * Format satoshis as BTC
 * @param {number} sats - Amount in satoshis
 * @returns {string} Formatted BTC string (e.g., "0.00001234 BTC")
 */
export function formatBTC(sats) {
  const btc = satsToBTC(sats);
  return `${btc.toFixed(8)} BTC`;
}

/**
 * Convert satoshis to BTC
 * @param {number} sats - Amount in satoshis
 * @returns {number} Amount in BTC
 */
export function satsToBTC(sats) {
  return sats / SATS_PER_BTC;
}

/**
 * Convert BTC to satoshis
 * @param {number} btc - Amount in BTC
 * @returns {number} Amount in satoshis
 */
export function btcToSats(btc) {
  return Math.round(btc * SATS_PER_BTC);
}

/**
 * Add two satoshi amounts
 * @param {number} a - First amount
 * @param {number} b - Second amount
 * @returns {number} Sum
 */
export function addSats(a, b) {
  return a + b;
}

/**
 * Subtract satoshi amounts
 * @param {number} a - First amount
 * @param {number} b - Second amount
 * @returns {number} Difference
 */
export function subtractSats(a, b) {
  return a - b;
}

export const bitcoin = {
  formatSats,
  formatBTC,
  satsToBTC,
  btcToSats,
  addSats,
  subtractSats
};
