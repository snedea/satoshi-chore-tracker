/**
 * Wallet page - Transaction history and balance
 */

import { store } from '../state/store.js';
import { BalanceDisplay } from '../components/BalanceDisplay.js';
import { TransactionList } from '../components/TransactionList.js';
import { getAllAchievementsWithProgress } from '../services/achievements.js';

/**
 * Render wallet page
 */
export function WalletPage() {
  const container = document.getElementById('app');
  container.innerHTML = '';

  const page = document.createElement('div');
  page.className = 'page wallet-page';

  // Header section
  const header = document.createElement('div');
  header.className = 'page-header';

  const title = document.createElement('h1');
  title.className = 'page-title';
  title.textContent = 'My Wallet 💼';

  header.appendChild(title);
  page.appendChild(header);

  // Balance display
  const user = store.getUser();
  const balanceSection = BalanceDisplay(user.balance, { showBTC: true, large: true });
  page.appendChild(balanceSection);

  // Achievements preview
  const achievementsPreview = document.createElement('div');
  achievementsPreview.className = 'achievements-preview';

  const achievementsTitle = document.createElement('h2');
  achievementsTitle.textContent = 'Recent Achievements 🏆';

  achievementsPreview.appendChild(achievementsTitle);

  const achievements = getAllAchievementsWithProgress(
    user,
    store.getChores(),
    store.getTransactions(),
    store.getCompletedLessons(),
    store.getAchievements()
  );

  const unlockedAchievements = achievements.filter(a => a.unlocked);

  if (unlockedAchievements.length === 0) {
    const emptyState = document.createElement('p');
    emptyState.className = 'empty-text';
    emptyState.textContent = 'No achievements yet. Keep completing chores and lessons!';
    achievementsPreview.appendChild(emptyState);
  } else {
    const achievementsList = document.createElement('div');
    achievementsList.className = 'achievements-list';

    // Show up to 3 most recent
    unlockedAchievements.slice(0, 3).forEach(achievement => {
      const achievementItem = document.createElement('div');
      achievementItem.className = 'achievement-item';
      achievementItem.innerHTML = `
        <span class="achievement-icon">${achievement.icon}</span>
        <div class="achievement-info">
          <div class="achievement-title">${achievement.title}</div>
          <div class="achievement-description">${achievement.description}</div>
        </div>
      `;
      achievementsList.appendChild(achievementItem);
    });

    achievementsPreview.appendChild(achievementsList);
  }

  page.appendChild(achievementsPreview);

  // Transaction history
  const transactionsSection = document.createElement('div');
  transactionsSection.className = 'section';

  const transactionsTitle = document.createElement('h2');
  transactionsTitle.textContent = 'Transaction History';

  transactionsSection.appendChild(transactionsTitle);

  const transactions = store.getTransactions();
  const transactionList = TransactionList(transactions);

  transactionsSection.appendChild(transactionList);
  page.appendChild(transactionsSection);

  container.appendChild(page);
}
