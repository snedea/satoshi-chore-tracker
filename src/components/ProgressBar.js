/**
 * Progress bar component
 */

/**
 * Create a progress bar element
 * @param {number} current - Current value
 * @param {number} max - Maximum value
 * @param {object} options - Progress bar options
 * @param {string} options.label - Label text
 * @param {boolean} options.showPercentage - Show percentage (default: true)
 * @param {string} options.color - Bar color
 * @returns {HTMLElement} Progress bar element
 */
export function ProgressBar(current, max, options = {}) {
  const {
    label,
    showPercentage = true,
    color = 'var(--bitcoin-orange)'
  } = options;

  const percentage = Math.min(100, Math.round((current / max) * 100));

  const container = document.createElement('div');
  container.className = 'progress-bar-container';

  if (label) {
    const labelElement = document.createElement('div');
    labelElement.className = 'progress-label';

    const labelText = document.createElement('span');
    labelText.textContent = label;

    const valueText = document.createElement('span');
    valueText.className = 'progress-value';

    if (showPercentage) {
      valueText.textContent = `${percentage}%`;
    } else {
      valueText.textContent = `${current} / ${max}`;
    }

    labelElement.appendChild(labelText);
    labelElement.appendChild(valueText);
    container.appendChild(labelElement);
  }

  const barTrack = document.createElement('div');
  barTrack.className = 'progress-bar-track';

  const barFill = document.createElement('div');
  barFill.className = 'progress-bar-fill';
  barFill.style.width = `${percentage}%`;
  barFill.style.backgroundColor = color;

  barTrack.appendChild(barFill);
  container.appendChild(barTrack);

  return container;
}

/**
 * Update progress bar animation
 * @param {HTMLElement} progressBar - Progress bar container element
 * @param {number} newPercentage - New percentage value
 */
export function updateProgressBar(progressBar, newPercentage) {
  const barFill = progressBar.querySelector('.progress-bar-fill');
  const valueText = progressBar.querySelector('.progress-value');

  if (barFill) {
    barFill.style.width = `${Math.min(100, newPercentage)}%`;
  }

  if (valueText) {
    valueText.textContent = `${Math.min(100, newPercentage)}%`;
  }
}
