/**
 * Transaction list component
 */

import { formatSats } from '../utils/bitcoin.js';
import { formatRelativeTime, formatDateTime } from '../utils/dateUtils.js';

/**
 * Create transaction list element
 * @param {array} transactions - Array of transaction objects
 * @param {object} options - Display options
 * @param {number} options.limit - Limit number of transactions shown
 * @returns {HTMLElement} Transaction list element
 */
export function TransactionList(transactions, options = {}) {
  const { limit } = options;

  const container = document.createElement('div');
  container.className = 'transaction-list';

  if (transactions.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'transaction-empty';
    emptyState.innerHTML = `
      <div class="empty-icon">📭</div>
      <p>No transactions yet. Complete a chore to earn your first satoshis!</p>
    `;
    container.appendChild(emptyState);
    return container;
  }

  const displayTransactions = limit ? transactions.slice(0, limit) : transactions;

  displayTransactions.forEach(transaction => {
    const item = createTransactionItem(transaction);
    container.appendChild(item);
  });

  return container;
}

/**
 * Create a single transaction item
 * @param {object} transaction - Transaction object
 * @returns {HTMLElement} Transaction item element
 */
function createTransactionItem(transaction) {
  const item = document.createElement('div');
  item.className = `transaction-item transaction-${transaction.type}`;

  const icon = document.createElement('div');
  icon.className = 'transaction-icon';
  icon.textContent = getTransactionIcon(transaction.type);

  const content = document.createElement('div');
  content.className = 'transaction-content';

  const description = document.createElement('div');
  description.className = 'transaction-description';
  description.textContent = transaction.description;

  const timestamp = document.createElement('div');
  timestamp.className = 'transaction-timestamp';
  timestamp.textContent = formatRelativeTime(transaction.timestamp);
  timestamp.title = formatDateTime(transaction.timestamp);

  content.appendChild(description);
  content.appendChild(timestamp);

  const amount = document.createElement('div');
  amount.className = 'transaction-amount';
  const prefix = transaction.type === 'earn' ? '+' : '-';
  amount.textContent = `${prefix}${formatSats(transaction.amount)}`;

  item.appendChild(icon);
  item.appendChild(content);
  item.appendChild(amount);

  return item;
}

/**
 * Get icon for transaction type
 * @param {string} type - Transaction type
 * @returns {string} Icon emoji
 */
function getTransactionIcon(type) {
  const icons = {
    earn: '⬆️',
    spend: '⬇️',
    bonus: '🎁'
  };
  return icons[type] || '•';
}
