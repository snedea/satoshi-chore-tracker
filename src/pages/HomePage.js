/**
 * Home page - Dashboard view
 */

import { store } from '../state/store.js';
import { router } from '../router.js';
import { BalanceDisplay, animateBalanceChange } from '../components/BalanceDisplay.js';
import { ChoreCard } from '../components/ChoreCard.js';
import { ProgressBar } from '../components/ProgressBar.js';
import { Button } from '../components/Button.js';

let balanceElement = null;
let previousBalance = 0;

/**
 * Render home page
 */
export function HomePage() {
  const container = document.getElementById('app');
  container.innerHTML = '';

  const page = document.createElement('div');
  page.className = 'page home-page';

  // Header section
  const header = document.createElement('div');
  header.className = 'page-header';

  const user = store.getUser();
  const greeting = document.createElement('h1');
  greeting.className = 'page-title';
  greeting.textContent = `Hello, ${user.name}! 👋`;

  header.appendChild(greeting);
  page.appendChild(header);

  // Balance section
  balanceElement = BalanceDisplay(user.balance, { showBTC: true, large: true });
  page.appendChild(balanceElement);
  previousBalance = user.balance;

  // Level progress section
  const levelSection = document.createElement('div');
  levelSection.className = 'level-section';

  const levelTitle = document.createElement('h2');
  levelTitle.textContent = `Level ${user.level} 🚀`;

  const currentXP = user.xp % 1000; // XP in current level
  const nextLevelXP = 1000;

  const levelProgress = ProgressBar(currentXP, nextLevelXP, {
    label: `XP to Level ${user.level + 1}`,
    showPercentage: false
  });

  levelSection.appendChild(levelTitle);
  levelSection.appendChild(levelProgress);
  page.appendChild(levelSection);

  // Available chores section
  const choresSection = document.createElement('div');
  choresSection.className = 'section';

  const choresHeader = document.createElement('div');
  choresHeader.className = 'section-header';

  const choresTitle = document.createElement('h2');
  choresTitle.textContent = 'Available Chores';

  const viewAllBtn = Button('View All', {
    variant: 'secondary',
    size: 'small',
    onClick: () => router.navigate('/chores')
  });

  choresHeader.appendChild(choresTitle);
  choresHeader.appendChild(viewAllBtn);
  choresSection.appendChild(choresHeader);

  const pendingChores = store.getPendingChores();

  if (pendingChores.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.innerHTML = `
      <div class="empty-icon">🎉</div>
      <p>All chores completed! Great job!</p>
      <p class="empty-subtext">Ask a parent to add more chores.</p>
    `;
    choresSection.appendChild(emptyState);
  } else {
    // Show up to 3 pending chores
    const displayChores = pendingChores.slice(0, 3);
    displayChores.forEach(chore => {
      const choreCard = ChoreCard(chore, {
        onComplete: handleChoreComplete
      });
      choresSection.appendChild(choreCard);
    });

    if (pendingChores.length > 3) {
      const moreText = document.createElement('p');
      moreText.className = 'more-chores-text';
      moreText.textContent = `+${pendingChores.length - 3} more chore${pendingChores.length - 3 !== 1 ? 's' : ''} available`;
      choresSection.appendChild(moreText);
    }
  }

  page.appendChild(choresSection);

  // Quick stats section
  const statsSection = document.createElement('div');
  statsSection.className = 'stats-section';

  const stats = [
    {
      icon: '✅',
      value: store.getCompletedChores().length,
      label: 'Chores Completed'
    },
    {
      icon: '💰',
      value: user.balance,
      label: 'Total Satoshis'
    },
    {
      icon: '📚',
      value: store.getCompletedLessons().length,
      label: 'Lessons Completed'
    }
  ];

  stats.forEach(stat => {
    const statCard = document.createElement('div');
    statCard.className = 'stat-card';

    statCard.innerHTML = `
      <div class="stat-icon">${stat.icon}</div>
      <div class="stat-value">${stat.value}</div>
      <div class="stat-label">${stat.label}</div>
    `;

    statsSection.appendChild(statCard);
  });

  page.appendChild(statsSection);

  container.appendChild(page);

  // Subscribe to balance changes
  store.subscribe('balance:changed', handleBalanceChange);
}

/**
 * Handle chore completion
 * @param {string} choreId - Chore ID
 */
function handleChoreComplete(choreId) {
  store.completeChore(choreId);

  // Show celebration
  showCelebration();

  // Refresh page after animation
  setTimeout(() => {
    HomePage();
  }, 1000);
}

/**
 * Handle balance change event
 * @param {object} data - Balance change data
 */
function handleBalanceChange(data) {
  if (balanceElement) {
    animateBalanceChange(balanceElement, data.previous, data.current);
  }
}

/**
 * Show celebration animation
 */
function showCelebration() {
  const celebration = document.createElement('div');
  celebration.className = 'celebration-overlay';
  celebration.innerHTML = `
    <div class="celebration-content">
      <div class="celebration-emoji">🎉</div>
      <div class="celebration-text">Awesome!</div>
      <div class="celebration-subtext">Satoshis earned!</div>
    </div>
  `;

  document.body.appendChild(celebration);

  setTimeout(() => {
    celebration.classList.add('celebration-fade-out');
    setTimeout(() => {
      celebration.remove();
    }, 500);
  }, 1500);
}

/**
 * Cleanup function
 */
export function cleanup() {
  store.unsubscribe('balance:changed', handleBalanceChange);
}
