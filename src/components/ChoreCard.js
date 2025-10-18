/**
 * Chore card component
 */

import { formatSats } from '../utils/bitcoin.js';
import { formatRelativeTime } from '../utils/dateUtils.js';
import { Button } from './Button.js';

/**
 * Create a chore card element
 * @param {object} chore - Chore object
 * @param {object} options - Card options
 * @param {function} options.onComplete - Complete handler
 * @param {function} options.onEdit - Edit handler (parent mode)
 * @param {function} options.onDelete - Delete handler (parent mode)
 * @param {boolean} options.parentMode - Show edit/delete buttons
 * @returns {HTMLElement} Chore card element
 */
export function ChoreCard(chore, options = {}) {
  const {
    onComplete,
    onEdit,
    onDelete,
    parentMode = false
  } = options;

  const card = document.createElement('div');
  card.className = `chore-card ${chore.status === 'completed' ? 'chore-completed' : ''}`;
  card.dataset.choreId = chore.id;

  const header = document.createElement('div');
  header.className = 'chore-header';

  const titleContainer = document.createElement('div');
  titleContainer.className = 'chore-title-container';

  const title = document.createElement('h3');
  title.className = 'chore-title';
  title.textContent = chore.title;

  const category = document.createElement('span');
  category.className = `chore-category chore-category-${chore.category}`;
  category.textContent = getCategoryLabel(chore.category);

  titleContainer.appendChild(title);
  titleContainer.appendChild(category);

  const reward = document.createElement('div');
  reward.className = 'chore-reward';
  reward.innerHTML = `<span class="reward-icon">💰</span><span class="reward-amount">${formatSats(chore.reward)}</span>`;

  header.appendChild(titleContainer);
  header.appendChild(reward);

  card.appendChild(header);

  if (chore.description) {
    const description = document.createElement('p');
    description.className = 'chore-description';
    description.textContent = chore.description;
    card.appendChild(description);
  }

  const footer = document.createElement('div');
  footer.className = 'chore-footer';

  if (chore.status === 'pending') {
    const completeBtn = Button('Complete Chore', {
      variant: 'primary',
      icon: '✓',
      onClick: () => {
        if (onComplete) {
          onComplete(chore.id);
          // Add completion animation
          card.classList.add('chore-completing');
          setTimeout(() => {
            card.classList.remove('chore-completing');
            card.classList.add('chore-completed');
          }, 500);
        }
      }
    });
    footer.appendChild(completeBtn);

    if (parentMode) {
      const editBtn = Button('Edit', {
        variant: 'secondary',
        size: 'small',
        onClick: () => {
          if (onEdit) onEdit(chore);
        }
      });
      const deleteBtn = Button('Delete', {
        variant: 'danger',
        size: 'small',
        onClick: () => {
          if (onDelete) onDelete(chore.id);
        }
      });
      footer.appendChild(editBtn);
      footer.appendChild(deleteBtn);
    }
  } else {
    const completedBadge = document.createElement('div');
    completedBadge.className = 'completed-badge';
    completedBadge.innerHTML = `<span class="badge-icon">✓</span><span class="badge-text">Completed ${formatRelativeTime(chore.completedAt)}</span>`;
    footer.appendChild(completedBadge);
  }

  card.appendChild(footer);

  return card;
}

/**
 * Get category display label
 * @param {string} category - Category ID
 * @returns {string} Display label
 */
function getCategoryLabel(category) {
  const labels = {
    household: 'Household',
    homework: 'Homework',
    behavior: 'Behavior',
    other: 'Other'
  };
  return labels[category] || category;
}
