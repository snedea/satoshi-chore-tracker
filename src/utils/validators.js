/**
 * Input validation utilities
 */

/**
 * Validate chore title
 * @param {string} title - Chore title to validate
 * @returns {{valid: boolean, error: string|null}}
 */
export function validateChoreTitle(title) {
  if (!title || typeof title !== 'string') {
    return { valid: false, error: 'Title is required' };
  }

  const trimmed = title.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: 'Title cannot be empty' };
  }

  if (trimmed.length > 100) {
    return { valid: false, error: 'Title must be 100 characters or less' };
  }

  return { valid: true, error: null };
}

/**
 * Validate reward amount
 * @param {number} reward - Reward amount in satoshis
 * @returns {{valid: boolean, error: string|null}}
 */
export function validateReward(reward) {
  if (typeof reward !== 'number') {
    return { valid: false, error: 'Reward must be a number' };
  }

  if (reward < 1) {
    return { valid: false, error: 'Reward must be at least 1 satoshi' };
  }

  if (reward > 1000000) {
    return { valid: false, error: 'Reward must be 1,000,000 satoshis or less' };
  }

  if (!Number.isInteger(reward)) {
    return { valid: false, error: 'Reward must be a whole number' };
  }

  return { valid: true, error: null };
}

/**
 * Validate user name
 * @param {string} name - User name to validate
 * @returns {{valid: boolean, error: string|null}}
 */
export function validateUserName(name) {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: 'Name is required' };
  }

  const trimmed = name.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: 'Name cannot be empty' };
  }

  if (trimmed.length > 50) {
    return { valid: false, error: 'Name must be 50 characters or less' };
  }

  return { valid: true, error: null };
}

/**
 * Validate PIN format (4 digits)
 * @param {string} pin - PIN to validate
 * @returns {{valid: boolean, error: string|null}}
 */
export function validatePIN(pin) {
  if (!pin || typeof pin !== 'string') {
    return { valid: false, error: 'PIN is required' };
  }

  if (!/^\d{4}$/.test(pin)) {
    return { valid: false, error: 'PIN must be exactly 4 digits' };
  }

  return { valid: true, error: null };
}

/**
 * Sanitize HTML to prevent XSS
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
export function sanitizeHTML(str) {
  if (!str) return '';

  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export const validators = {
  validateChoreTitle,
  validateReward,
  validateUserName,
  validatePIN,
  sanitizeHTML
};
