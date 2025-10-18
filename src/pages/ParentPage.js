/**
 * Parent page - Parent controls and settings
 */

import { store } from '../state/store.js';
import { router } from '../router.js';
import { Button } from '../components/Button.js';
import { Modal } from '../components/Modal.js';
import { validatePIN, validateUserName } from '../utils/validators.js';

/**
 * Render parent page
 */
export function ParentPage() {
  const container = document.getElementById('app');
  container.innerHTML = '';

  const user = store.getUser();

  // Check if parent mode is enabled
  if (!user.parentMode && user.parentPin) {
    showPINPrompt();
    return;
  }

  const page = document.createElement('div');
  page.className = 'page parent-page';

  // Header section
  const header = document.createElement('div');
  header.className = 'page-header';

  const title = document.createElement('h1');
  title.className = 'page-title';
  title.textContent = 'Parent Controls 👨‍👩‍👧';

  header.appendChild(title);
  page.appendChild(header);

  // Settings sections
  const settingsContainer = document.createElement('div');
  settingsContainer.className = 'settings-container';

  // User settings
  const userSection = createSettingSection('User Settings', [
    {
      label: 'Child Name',
      value: user.name,
      action: 'Change Name',
      onClick: showChangeNameModal
    },
    {
      label: 'Current Level',
      value: `Level ${user.level}`,
      action: null
    },
    {
      label: 'Total XP',
      value: user.xp,
      action: null
    }
  ]);

  settingsContainer.appendChild(userSection);

  // Parent PIN settings
  const pinSection = createSettingSection('Security', [
    {
      label: 'Parent PIN',
      value: user.parentPin ? 'Set' : 'Not Set',
      action: user.parentPin ? 'Change PIN' : 'Set PIN',
      onClick: showSetPINModal
    }
  ]);

  settingsContainer.appendChild(pinSection);

  // Data management
  const dataSection = createSettingSection('Data Management', [
    {
      label: 'Export Data',
      value: 'Download backup',
      action: 'Export',
      onClick: handleExport
    },
    {
      label: 'Import Data',
      value: 'Restore from backup',
      action: 'Import',
      onClick: handleImport
    },
    {
      label: 'Reset App',
      value: 'Clear all data',
      action: 'Reset',
      onClick: handleReset,
      danger: true
    }
  ]);

  settingsContainer.appendChild(dataSection);

  page.appendChild(settingsContainer);

  // Quick actions
  const actionsSection = document.createElement('div');
  actionsSection.className = 'actions-section';

  const manageChoresBtn = Button('Manage Chores', {
    variant: 'primary',
    icon: '✅',
    onClick: () => {
      user.parentMode = true;
      store.setUser(user);
      router.navigate('/chores');
    }
  });

  const exitParentModeBtn = Button('Exit Parent Mode', {
    variant: 'secondary',
    onClick: () => {
      user.parentMode = false;
      store.setUser(user);
      router.navigate('/');
    }
  });

  actionsSection.appendChild(manageChoresBtn);
  actionsSection.appendChild(exitParentModeBtn);

  page.appendChild(actionsSection);

  container.appendChild(page);
}

/**
 * Create a settings section
 * @param {string} title - Section title
 * @param {array} items - Setting items
 * @returns {HTMLElement} Settings section element
 */
function createSettingSection(title, items) {
  const section = document.createElement('div');
  section.className = 'setting-section';

  const sectionTitle = document.createElement('h2');
  sectionTitle.textContent = title;
  section.appendChild(sectionTitle);

  items.forEach(item => {
    const settingItem = document.createElement('div');
    settingItem.className = 'setting-item';

    const label = document.createElement('div');
    label.className = 'setting-label';
    label.textContent = item.label;

    const value = document.createElement('div');
    value.className = 'setting-value';
    value.textContent = item.value;

    settingItem.appendChild(label);
    settingItem.appendChild(value);

    if (item.action) {
      const actionBtn = Button(item.action, {
        variant: item.danger ? 'danger' : 'secondary',
        size: 'small',
        onClick: item.onClick
      });
      settingItem.appendChild(actionBtn);
    }

    section.appendChild(settingItem);
  });

  return section;
}

/**
 * Show PIN prompt modal
 */
function showPINPrompt() {
  const container = document.getElementById('app');
  container.innerHTML = '';

  const promptPage = document.createElement('div');
  promptPage.className = 'page pin-prompt-page';

  promptPage.innerHTML = `
    <div class="pin-prompt">
      <h1>Parent Mode 🔒</h1>
      <p>Enter parent PIN to continue</p>
      <input type="password" id="pin-input" maxlength="4" pattern="[0-9]*" inputmode="numeric" placeholder="Enter 4-digit PIN" />
      <div class="pin-error" id="pin-error"></div>
      <div class="pin-actions">
        <button class="btn btn-primary" id="pin-submit">Enter</button>
        <button class="btn btn-secondary" id="pin-cancel">Cancel</button>
      </div>
    </div>
  `;

  container.appendChild(promptPage);

  const input = document.getElementById('pin-input');
  const submitBtn = document.getElementById('pin-submit');
  const cancelBtn = document.getElementById('pin-cancel');
  const errorDiv = document.getElementById('pin-error');

  submitBtn.addEventListener('click', () => {
    const pin = input.value;
    const user = store.getUser();

    // Simple PIN check (in production, would hash)
    if (pin === user.parentPin) {
      user.parentMode = true;
      store.setUser(user);
      ParentPage();
    } else {
      errorDiv.textContent = 'Incorrect PIN';
      errorDiv.style.display = 'block';
      input.value = '';
    }
  });

  cancelBtn.addEventListener('click', () => {
    router.navigate('/');
  });

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      submitBtn.click();
    }
  });

  input.focus();
}

/**
 * Show change name modal
 */
function showChangeNameModal() {
  const form = document.createElement('form');
  form.innerHTML = `
    <div class="form-group">
      <label for="new-name">New Name</label>
      <input type="text" id="new-name" maxlength="50" required />
    </div>
    <button type="submit" class="btn btn-primary">Save</button>
  `;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const newName = document.getElementById('new-name').value.trim();

    const validation = validateUserName(newName);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    const user = store.getUser();
    user.name = newName;
    store.setUser(user);

    document.querySelector('.modal-overlay').remove();
    ParentPage();
  });

  Modal('Change Name', form);
}

/**
 * Show set/change PIN modal
 */
function showSetPINModal() {
  const form = document.createElement('form');
  form.innerHTML = `
    <div class="form-group">
      <label for="new-pin">New PIN (4 digits)</label>
      <input type="password" id="new-pin" maxlength="4" pattern="[0-9]*" inputmode="numeric" required />
    </div>
    <div class="form-group">
      <label for="confirm-pin">Confirm PIN</label>
      <input type="password" id="confirm-pin" maxlength="4" pattern="[0-9]*" inputmode="numeric" required />
    </div>
    <button type="submit" class="btn btn-primary">Save PIN</button>
  `;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const newPin = document.getElementById('new-pin').value;
    const confirmPin = document.getElementById('confirm-pin').value;

    const validation = validatePIN(newPin);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    if (newPin !== confirmPin) {
      alert('PINs do not match');
      return;
    }

    const user = store.getUser();
    user.parentPin = newPin; // In production, would hash this
    store.setUser(user);

    document.querySelector('.modal-overlay').remove();
    ParentPage();
  });

  Modal('Set Parent PIN', form);
}

/**
 * Handle data export
 */
function handleExport() {
  const data = store.exportData();
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `satoshi-chore-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();

  URL.revokeObjectURL(url);

  alert('Data exported successfully!');
}

/**
 * Handle data import
 */
function handleImport() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';

  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const jsonString = event.target.result;

      if (confirm('This will replace all current data. Continue?')) {
        const success = store.importData(jsonString);

        if (success) {
          alert('Data imported successfully!');
          ParentPage();
        } else {
          alert('Import failed. Invalid file format.');
        }
      }
    };

    reader.readAsText(file);
  });

  input.click();
}

/**
 * Handle app reset
 */
function handleReset() {
  if (confirm('Are you sure? This will delete ALL data and cannot be undone!')) {
    if (confirm('Last chance! Really delete everything?')) {
      store.reset();
      alert('App has been reset.');
      router.navigate('/');
    }
  }
}
