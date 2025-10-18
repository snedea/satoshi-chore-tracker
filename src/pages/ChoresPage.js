/**
 * Chores page - View and manage all chores
 */

import { store } from '../state/store.js';
import { ChoreCard } from '../components/ChoreCard.js';
import { Button } from '../components/Button.js';
import { Modal } from '../components/Modal.js';
import { validateChoreTitle, validateReward } from '../utils/validators.js';

/**
 * Render chores page
 */
export function ChoresPage() {
  const container = document.getElementById('app');
  container.innerHTML = '';

  const page = document.createElement('div');
  page.className = 'page chores-page';

  // Header section
  const header = document.createElement('div');
  header.className = 'page-header';

  const title = document.createElement('h1');
  title.className = 'page-title';
  title.textContent = 'My Chores';

  const user = store.getUser();
  const addBtn = Button('Add Chore', {
    variant: 'primary',
    icon: '+',
    onClick: () => showAddChoreModal()
  });

  header.appendChild(title);
  if (user.parentMode) {
    header.appendChild(addBtn);
  }

  page.appendChild(header);

  // Tabs for pending/completed
  const tabs = document.createElement('div');
  tabs.className = 'tabs';

  const pendingTab = document.createElement('button');
  pendingTab.className = 'tab tab-active';
  pendingTab.textContent = 'Pending';
  pendingTab.dataset.tab = 'pending';

  const completedTab = document.createElement('button');
  completedTab.className = 'tab';
  completedTab.textContent = 'Completed';
  completedTab.dataset.tab = 'completed';

  tabs.appendChild(pendingTab);
  tabs.appendChild(completedTab);
  page.appendChild(tabs);

  // Chores container
  const choresContainer = document.createElement('div');
  choresContainer.className = 'chores-container';
  choresContainer.id = 'chores-container';

  page.appendChild(choresContainer);

  // Initial render - show pending
  renderChoresList('pending');

  // Tab click handlers
  pendingTab.addEventListener('click', () => {
    pendingTab.classList.add('tab-active');
    completedTab.classList.remove('tab-active');
    renderChoresList('pending');
  });

  completedTab.addEventListener('click', () => {
    completedTab.classList.add('tab-active');
    pendingTab.classList.remove('tab-active');
    renderChoresList('completed');
  });

  container.appendChild(page);
}

/**
 * Render chores list based on filter
 * @param {string} filter - 'pending' or 'completed'
 */
function renderChoresList(filter) {
  const container = document.getElementById('chores-container');
  container.innerHTML = '';

  const chores = filter === 'pending'
    ? store.getPendingChores()
    : store.getCompletedChores();

  if (chores.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';

    if (filter === 'pending') {
      emptyState.innerHTML = `
        <div class="empty-icon">🎉</div>
        <p>No pending chores!</p>
        <p class="empty-subtext">All done for now. Great work!</p>
      `;
    } else {
      emptyState.innerHTML = `
        <div class="empty-icon">📋</div>
        <p>No completed chores yet</p>
        <p class="empty-subtext">Complete your first chore to see it here!</p>
      `;
    }

    container.appendChild(emptyState);
    return;
  }

  const user = store.getUser();

  chores.forEach(chore => {
    const choreCard = ChoreCard(chore, {
      onComplete: handleChoreComplete,
      onEdit: showEditChoreModal,
      onDelete: handleChoreDelete,
      parentMode: user.parentMode
    });
    container.appendChild(choreCard);
  });
}

/**
 * Show add chore modal
 */
function showAddChoreModal() {
  const form = createChoreForm();

  const modal = Modal('Add New Chore', form, {
    onClose: () => {}
  });
}

/**
 * Show edit chore modal
 * @param {object} chore - Chore to edit
 */
function showEditChoreModal(chore) {
  const form = createChoreForm(chore);

  const modal = Modal('Edit Chore', form, {
    onClose: () => {}
  });
}

/**
 * Create chore form
 * @param {object} chore - Existing chore (for edit mode)
 * @returns {HTMLElement} Form element
 */
function createChoreForm(chore = null) {
  const form = document.createElement('form');
  form.className = 'chore-form';

  form.innerHTML = `
    <div class="form-group">
      <label for="chore-title">Chore Title *</label>
      <input
        type="text"
        id="chore-title"
        name="title"
        value="${chore ? chore.title : ''}"
        placeholder="e.g., Make bed, Do homework"
        required
        maxlength="100"
      />
    </div>

    <div class="form-group">
      <label for="chore-description">Description (optional)</label>
      <textarea
        id="chore-description"
        name="description"
        placeholder="Any details or instructions..."
        rows="3"
        maxlength="500"
      >${chore ? chore.description : ''}</textarea>
    </div>

    <div class="form-group">
      <label for="chore-reward">Reward (satoshis) *</label>
      <input
        type="number"
        id="chore-reward"
        name="reward"
        value="${chore ? chore.reward : 100}"
        min="1"
        max="1000000"
        required
      />
    </div>

    <div class="form-group">
      <label for="chore-category">Category</label>
      <select id="chore-category" name="category">
        <option value="household" ${chore?.category === 'household' ? 'selected' : ''}>Household</option>
        <option value="homework" ${chore?.category === 'homework' ? 'selected' : ''}>Homework</option>
        <option value="behavior" ${chore?.category === 'behavior' ? 'selected' : ''}>Behavior</option>
        <option value="other" ${chore?.category === 'other' ? 'selected' : ''}>Other</option>
      </select>
    </div>

    <div class="form-group">
      <label for="chore-difficulty">Difficulty</label>
      <select id="chore-difficulty" name="difficulty">
        <option value="easy" ${chore?.difficulty === 'easy' ? 'selected' : ''}>Easy</option>
        <option value="medium" ${chore?.difficulty === 'medium' ? 'selected' : ''}>Medium</option>
        <option value="hard" ${chore?.difficulty === 'hard' ? 'selected' : ''}>Hard</option>
      </select>
    </div>

    <div class="form-error" id="form-error"></div>

    <div class="form-actions">
      <button type="submit" class="btn btn-primary">${chore ? 'Update' : 'Add'} Chore</button>
    </div>
  `;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const title = formData.get('title').trim();
    const description = formData.get('description').trim();
    const reward = parseInt(formData.get('reward'));
    const category = formData.get('category');
    const difficulty = formData.get('difficulty');

    // Validate
    const titleValidation = validateChoreTitle(title);
    if (!titleValidation.valid) {
      showFormError(titleValidation.error);
      return;
    }

    const rewardValidation = validateReward(reward);
    if (!rewardValidation.valid) {
      showFormError(rewardValidation.error);
      return;
    }

    const choreData = {
      title,
      description,
      reward,
      category,
      difficulty,
      recurring: false,
      recurrence: null,
      createdBy: 'parent'
    };

    if (chore) {
      // Update existing chore
      store.updateChore(chore.id, choreData);
    } else {
      // Add new chore
      store.addChore(choreData);
    }

    // Close modal and refresh
    document.querySelector('.modal-overlay').remove();
    ChoresPage();
  });

  return form;
}

/**
 * Show form error
 * @param {string} message - Error message
 */
function showFormError(message) {
  const errorDiv = document.getElementById('form-error');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';

  setTimeout(() => {
    errorDiv.style.display = 'none';
  }, 5000);
}

/**
 * Handle chore completion
 * @param {string} choreId - Chore ID
 */
function handleChoreComplete(choreId) {
  store.completeChore(choreId);

  // Show celebration
  const celebration = document.createElement('div');
  celebration.className = 'celebration-overlay';
  celebration.innerHTML = `
    <div class="celebration-content">
      <div class="celebration-emoji">🎉</div>
      <div class="celebration-text">Chore Complete!</div>
    </div>
  `;
  document.body.appendChild(celebration);

  setTimeout(() => {
    celebration.remove();
    ChoresPage();
  }, 1500);
}

/**
 * Handle chore deletion
 * @param {string} choreId - Chore ID
 */
function handleChoreDelete(choreId) {
  if (confirm('Are you sure you want to delete this chore?')) {
    store.deleteChore(choreId);
    ChoresPage();
  }
}
