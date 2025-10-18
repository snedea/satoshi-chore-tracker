/**
 * Reusable button component
 */

/**
 * Create a button element
 * @param {string} text - Button text
 * @param {object} options - Button options
 * @param {string} options.variant - Button style variant ('primary', 'secondary', 'danger')
 * @param {string} options.size - Button size ('small', 'medium', 'large')
 * @param {function} options.onClick - Click handler
 * @param {string} options.icon - Optional icon (emoji)
 * @param {boolean} options.disabled - Disabled state
 * @returns {HTMLElement} Button element
 */
export function Button(text, options = {}) {
  const {
    variant = 'primary',
    size = 'medium',
    onClick,
    icon,
    disabled = false
  } = options;

  const button = document.createElement('button');
  button.className = `btn btn-${variant} btn-${size}`;

  if (icon) {
    button.innerHTML = `<span class="btn-icon">${icon}</span><span>${text}</span>`;
  } else {
    button.textContent = text;
  }

  if (disabled) {
    button.disabled = true;
    button.classList.add('btn-disabled');
  }

  if (onClick) {
    button.addEventListener('click', onClick);
  }

  return button;
}
