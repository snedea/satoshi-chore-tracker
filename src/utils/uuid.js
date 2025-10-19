/**
 * UUID generation utility with browser compatibility fallback
 *
 * Uses crypto.randomUUID() when available (Chrome 92+, Firefox 95+, Safari 15.4+)
 * Falls back to RFC4122 v4 compliant implementation for older browsers
 */

/**
 * Generate a RFC4122 v4 UUID
 * @returns {string} UUID string
 */
export function generateUUID() {
  // Use native crypto.randomUUID() if available (modern browsers + secure context)
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    try {
      return crypto.randomUUID();
    } catch (e) {
      // Fall through to polyfill if crypto.randomUUID() throws
      // (can happen in insecure contexts or some browser configurations)
      console.warn('crypto.randomUUID() failed, using fallback:', e.message);
    }
  }

  // Fallback: RFC4122 v4 UUID implementation
  // Template: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  // where x is random hex digit, y is one of 8, 9, A, or B
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Check if crypto.randomUUID() is available
 * @returns {boolean} True if native UUID generation is available
 */
export function hasNativeUUID() {
  return typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function';
}
