/**
 * localStorage abstraction service
 * Handles data persistence with JSON serialization
 */

const STORAGE_PREFIX = 'satoshi_';

/**
 * Check if localStorage is available
 * @returns {boolean} True if localStorage is available
 */
export function isAvailable() {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Save data to localStorage
 * @param {string} key - Storage key (will be prefixed)
 * @param {any} data - Data to save (will be JSON stringified)
 * @returns {boolean} True if save succeeded
 */
export function save(key, data) {
  try {
    const prefixedKey = STORAGE_PREFIX + key;
    const jsonString = JSON.stringify(data);
    localStorage.setItem(prefixedKey, jsonString);
    return true;
  } catch (e) {
    console.error(`Failed to save to localStorage: ${key}`, e);
    return false;
  }
}

/**
 * Load data from localStorage
 * @param {string} key - Storage key (will be prefixed)
 * @returns {any|null} Parsed data or null if not found
 */
export function load(key) {
  try {
    const prefixedKey = STORAGE_PREFIX + key;
    const jsonString = localStorage.getItem(prefixedKey);

    if (jsonString === null) {
      return null;
    }

    return JSON.parse(jsonString);
  } catch (e) {
    console.error(`Failed to load from localStorage: ${key}`, e);
    return null;
  }
}

/**
 * Remove data from localStorage
 * @param {string} key - Storage key (will be prefixed)
 */
export function remove(key) {
  try {
    const prefixedKey = STORAGE_PREFIX + key;
    localStorage.removeItem(prefixedKey);
  } catch (e) {
    console.error(`Failed to remove from localStorage: ${key}`, e);
  }
}

/**
 * Clear all app data from localStorage
 */
export function clear() {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (e) {
    console.error('Failed to clear localStorage', e);
  }
}

/**
 * Export all app data as JSON string
 * @returns {string} JSON string of all app data
 */
export function exportAll() {
  const data = {};

  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        const shortKey = key.replace(STORAGE_PREFIX, '');
        data[shortKey] = JSON.parse(localStorage.getItem(key));
      }
    });

    return JSON.stringify(data, null, 2);
  } catch (e) {
    console.error('Failed to export data', e);
    return '{}';
  }
}

/**
 * Import data from JSON string
 * @param {string} jsonString - JSON string to import
 * @returns {boolean} True if import succeeded
 */
export function importAll(jsonString) {
  try {
    const data = JSON.parse(jsonString);

    Object.keys(data).forEach(key => {
      save(key, data[key]);
    });

    return true;
  } catch (e) {
    console.error('Failed to import data', e);
    return false;
  }
}

export const storage = {
  isAvailable,
  save,
  load,
  remove,
  clear,
  exportAll,
  importAll
};
