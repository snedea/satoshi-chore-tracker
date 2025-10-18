/**
 * Date utility functions for formatting timestamps
 */

/**
 * Format a date as a relative time string (e.g., "2 hours ago")
 * @param {string|Date} date - ISO date string or Date object
 * @returns {string} Relative time string
 */
export function formatRelativeTime(date) {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now - then;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) {
    return 'just now';
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  } else {
    return formatDate(date);
  }
}

/**
 * Format a date as a short date string (e.g., "Oct 18, 2025")
 * @param {string|Date} date - ISO date string or Date object
 * @returns {string} Formatted date
 */
export function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Format a date with time (e.g., "Oct 18, 2025 at 3:45 PM")
 * @param {string|Date} date - ISO date string or Date object
 * @returns {string} Formatted date and time
 */
export function formatDateTime(date) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

/**
 * Check if a date is today
 * @param {string|Date} date - ISO date string or Date object
 * @returns {boolean} True if date is today
 */
export function isToday(date) {
  const d = new Date(date);
  const today = new Date();
  return d.toDateString() === today.toDateString();
}

/**
 * Check if a date is within the last N days
 * @param {string|Date} date - ISO date string or Date object
 * @param {number} days - Number of days to check
 * @returns {boolean} True if date is within last N days
 */
export function isWithinDays(date, days) {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now - d;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays <= days;
}

export const dateUtils = {
  formatRelativeTime,
  formatDate,
  formatDateTime,
  isToday,
  isWithinDays
};
