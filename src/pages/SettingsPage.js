/**
 * Settings page - App preferences
 */

import { store } from '../state/store.js';

/**
 * Render settings page
 */
export function SettingsPage() {
  const container = document.getElementById('app');
  container.innerHTML = '';

  const page = document.createElement('div');
  page.className = 'page settings-page';

  // Header section
  const header = document.createElement('div');
  header.className = 'page-header';

  const title = document.createElement('h1');
  title.className = 'page-title';
  title.textContent = 'Settings ⚙️';

  header.appendChild(title);
  page.appendChild(header);

  const user = store.getUser();

  // Settings container
  const settingsContainer = document.createElement('div');
  settingsContainer.className = 'settings-container';

  // Display settings
  const displaySection = document.createElement('div');
  displaySection.className = 'setting-section';

  const displayTitle = document.createElement('h2');
  displayTitle.textContent = 'Display';
  displaySection.appendChild(displayTitle);

  // Theme setting
  const themeSetting = createToggleSetting(
    'Theme',
    'Dark Mode',
    user.settings.theme === 'dark',
    (enabled) => {
      user.settings.theme = enabled ? 'dark' : 'light';
      store.setUser(user);
      document.body.dataset.theme = user.settings.theme;
    }
  );
  displaySection.appendChild(themeSetting);

  settingsContainer.appendChild(displaySection);

  // Sound settings
  const soundSection = document.createElement('div');
  soundSection.className = 'setting-section';

  const soundTitle = document.createElement('h2');
  soundTitle.textContent = 'Sound';
  soundSection.appendChild(soundTitle);

  const soundSetting = createToggleSetting(
    'Sound Effects',
    'Enable sound effects',
    user.settings.soundEnabled,
    (enabled) => {
      user.settings.soundEnabled = enabled;
      store.setUser(user);
    }
  );
  soundSection.appendChild(soundSetting);

  settingsContainer.appendChild(soundSection);

  // Difficulty settings
  const difficultySection = document.createElement('div');
  difficultySection.className = 'setting-section';

  const difficultyTitle = document.createElement('h2');
  difficultyTitle.textContent = 'Difficulty';
  difficultySection.appendChild(difficultyTitle);

  const difficultySetting = createSelectSetting(
    'Learning Difficulty',
    user.settings.difficulty,
    [
      { value: 'easy', label: 'Easy' },
      { value: 'medium', label: 'Medium' },
      { value: 'hard', label: 'Hard' }
    ],
    (value) => {
      user.settings.difficulty = value;
      store.setUser(user);
    }
  );
  difficultySection.appendChild(difficultySetting);

  settingsContainer.appendChild(difficultySection);

  // About section
  const aboutSection = document.createElement('div');
  aboutSection.className = 'setting-section';

  const aboutTitle = document.createElement('h2');
  aboutTitle.textContent = 'About';
  aboutSection.appendChild(aboutTitle);

  const aboutText = document.createElement('div');
  aboutText.className = 'about-text';
  aboutText.innerHTML = `
    <p><strong>Satoshi's Chore Tracker</strong></p>
    <p>Version 1.0.0</p>
    <p>An educational app to teach children about Bitcoin and blockchain through gamified chore tracking.</p>
    <p class="disclaimer">⚠️ This app uses simulated Bitcoin only. No real cryptocurrency is involved.</p>
  `;
  aboutSection.appendChild(aboutText);

  settingsContainer.appendChild(aboutSection);

  page.appendChild(settingsContainer);
  container.appendChild(page);
}

/**
 * Create a toggle setting
 * @param {string} label - Setting label
 * @param {string} description - Setting description
 * @param {boolean} value - Current value
 * @param {function} onChange - Change handler
 * @returns {HTMLElement} Setting element
 */
function createToggleSetting(label, description, value, onChange) {
  const setting = document.createElement('div');
  setting.className = 'setting-item';

  const labelDiv = document.createElement('div');
  labelDiv.className = 'setting-label';
  labelDiv.innerHTML = `
    <div class="setting-title">${label}</div>
    <div class="setting-description">${description}</div>
  `;

  const toggle = document.createElement('label');
  toggle.className = 'toggle-switch';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = value;

  checkbox.addEventListener('change', () => {
    onChange(checkbox.checked);
  });

  const slider = document.createElement('span');
  slider.className = 'toggle-slider';

  toggle.appendChild(checkbox);
  toggle.appendChild(slider);

  setting.appendChild(labelDiv);
  setting.appendChild(toggle);

  return setting;
}

/**
 * Create a select setting
 * @param {string} label - Setting label
 * @param {string} value - Current value
 * @param {array} options - Select options
 * @param {function} onChange - Change handler
 * @returns {HTMLElement} Setting element
 */
function createSelectSetting(label, value, options, onChange) {
  const setting = document.createElement('div');
  setting.className = 'setting-item';

  const labelDiv = document.createElement('div');
  labelDiv.className = 'setting-label';
  labelDiv.textContent = label;

  const select = document.createElement('select');
  select.className = 'setting-select';

  options.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option.value;
    optionElement.textContent = option.label;
    optionElement.selected = option.value === value;
    select.appendChild(optionElement);
  });

  select.addEventListener('change', () => {
    onChange(select.value);
  });

  setting.appendChild(labelDiv);
  setting.appendChild(select);

  return setting;
}
