/**
 * Application entry point and bootstrap
 */

import { store } from './state/store.js';
import { router } from './router.js';
import { storage } from './services/storage.js';
import { checkUnlocks } from './services/achievements.js';
import { NavBar, updateNavBar } from './components/NavBar.js';

// Import pages
import { HomePage } from './pages/HomePage.js';
import { ChoresPage } from './pages/ChoresPage.js';
import { LearnPage } from './pages/LearnPage.js';
import { WalletPage } from './pages/WalletPage.js';
import { ParentPage } from './pages/ParentPage.js';
import { SettingsPage } from './pages/SettingsPage.js';

/**
 * Initialize application
 */
function init() {
  console.log('🚀 Initializing Satoshi\'s Chore Tracker...');

  // Check localStorage availability
  if (!storage.isAvailable()) {
    showError('localStorage is not available. This app requires localStorage to function.');
    return;
  }

  // Initialize store from localStorage
  store.init();

  // Apply theme
  const user = store.getUser();
  document.body.dataset.theme = user.settings.theme || 'light';

  // Set up routes
  router.addRoute('/', renderHome);
  router.addRoute('/chores', renderChores);
  router.addRoute('/learn', renderLearn);
  router.addRoute('/wallet', renderWallet);
  router.addRoute('/parent', renderParent);
  router.addRoute('/settings', renderSettings);

  // Initialize router
  router.init();

  // Render navigation
  renderNavigation();

  // Subscribe to events for achievement checking
  store.subscribe('chore:completed', checkAchievements);
  store.subscribe('lesson:completed', checkAchievements);
  store.subscribe('balance:changed', checkAchievements);

  console.log('✅ App initialized successfully');
}

/**
 * Render navigation bar
 */
function renderNavigation() {
  const existingNav = document.getElementById('main-nav');
  if (existingNav) {
    existingNav.remove();
  }

  const nav = NavBar(router.getCurrentRoute());
  nav.id = 'main-nav';

  document.body.insertBefore(nav, document.body.firstChild);
}

/**
 * Route handlers
 */
function renderHome() {
  HomePage();
  updateNavBar('/');
}

function renderChores() {
  ChoresPage();
  updateNavBar('/chores');
}

function renderLearn() {
  LearnPage();
  updateNavBar('/learn');
}

function renderWallet() {
  WalletPage();
  updateNavBar('/wallet');
}

function renderParent() {
  ParentPage();
  updateNavBar('/parent');
}

function renderSettings() {
  SettingsPage();
  updateNavBar('/settings');
}

/**
 * Check for new achievement unlocks
 */
function checkAchievements() {
  const user = store.getUser();
  const chores = store.getChores();
  const transactions = store.getTransactions();
  const unlockedAchievements = store.getAchievements();

  const newUnlocks = checkUnlocks(user, chores, transactions, unlockedAchievements);

  newUnlocks.forEach(achievementId => {
    store.unlockAchievement(achievementId);
    showAchievementNotification(achievementId);
  });
}

/**
 * Show achievement unlock notification
 * @param {string} achievementId - Achievement ID
 */
async function showAchievementNotification(achievementId) {
  const { getAchievementById } = await import('./data/achievements.js');
  const achievement = getAchievementById(achievementId);

  if (!achievement) return;

  const notification = document.createElement('div');
  notification.className = 'achievement-notification';
  notification.innerHTML = `
    <div class="achievement-notification-content">
      <div class="achievement-notification-icon">${achievement.icon}</div>
      <div class="achievement-notification-text">
        <div class="achievement-notification-title">Achievement Unlocked!</div>
        <div class="achievement-notification-name">${achievement.title}</div>
      </div>
    </div>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('achievement-notification-show');
  }, 100);

  setTimeout(() => {
    notification.classList.remove('achievement-notification-show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 4000);
}

/**
 * Show error message
 * @param {string} message - Error message
 */
function showError(message) {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="error-container">
      <h1>⚠️ Error</h1>
      <p>${message}</p>
    </div>
  `;
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
