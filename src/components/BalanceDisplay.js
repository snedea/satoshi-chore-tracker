/**
 * Balance display component
 */

import { formatSats, formatBTC } from '../utils/bitcoin.js';

/**
 * Create balance display widget
 * @param {number} balance - Current balance in satoshis
 * @param {object} options - Display options
 * @param {boolean} options.showBTC - Show BTC conversion (default: true)
 * @param {boolean} options.large - Large display style (default: false)
 * @returns {HTMLElement} Balance display element
 */
export function BalanceDisplay(balance, options = {}) {
  const {
    showBTC = true,
    large = false
  } = options;

  const container = document.createElement('div');
  container.className = `balance-display ${large ? 'balance-large' : ''}`;

  const icon = document.createElement('div');
  icon.className = 'balance-icon';
  icon.textContent = '₿';

  const content = document.createElement('div');
  content.className = 'balance-content';

  const label = document.createElement('div');
  label.className = 'balance-label';
  label.textContent = 'Your Balance';

  const amount = document.createElement('div');
  amount.className = 'balance-amount';
  amount.textContent = formatSats(balance);

  content.appendChild(label);
  content.appendChild(amount);

  if (showBTC) {
    const btcAmount = document.createElement('div');
    btcAmount.className = 'balance-btc';
    btcAmount.textContent = formatBTC(balance);
    content.appendChild(btcAmount);
  }

  container.appendChild(icon);
  container.appendChild(content);

  return container;
}

/**
 * Animate balance change
 * @param {HTMLElement} balanceElement - Balance display element
 * @param {number} oldBalance - Previous balance
 * @param {number} newBalance - New balance
 */
export function animateBalanceChange(balanceElement, oldBalance, newBalance) {
  const change = newBalance - oldBalance;

  if (change === 0) return;

  // Add celebration animation
  balanceElement.classList.add('balance-change');

  // Create floating change indicator
  const changeIndicator = document.createElement('div');
  changeIndicator.className = 'balance-change-indicator';
  changeIndicator.textContent = change > 0 ? `+${formatSats(change)}` : formatSats(change);

  balanceElement.style.position = 'relative';
  balanceElement.appendChild(changeIndicator);

  // Animate counter
  const duration = 1000; // 1 second
  const steps = 30;
  const stepValue = (newBalance - oldBalance) / steps;
  let currentValue = oldBalance;
  let stepCount = 0;

  const amountElement = balanceElement.querySelector('.balance-amount');
  const btcElement = balanceElement.querySelector('.balance-btc');

  const interval = setInterval(() => {
    currentValue += stepValue;
    stepCount++;

    if (stepCount >= steps) {
      currentValue = newBalance;
      clearInterval(interval);

      // Remove animation class
      setTimeout(() => {
        balanceElement.classList.remove('balance-change');
        changeIndicator.remove();
      }, 500);
    }

    amountElement.textContent = formatSats(Math.round(currentValue));
    if (btcElement) {
      btcElement.textContent = formatBTC(Math.round(currentValue));
    }
  }, duration / steps);
}
