/**
 * Achievement service for checking and unlocking achievements
 */

import { achievementList } from '../data/achievements.js';
import { isToday } from '../utils/dateUtils.js';

/**
 * Check which achievements should be unlocked based on current state
 * @param {object} user - User object
 * @param {array} chores - All chores
 * @param {array} transactions - All transactions
 * @param {array} unlockedAchievements - Already unlocked achievements
 * @returns {array} Array of achievement IDs to unlock
 */
export function checkUnlocks(user, chores, transactions, unlockedAchievements) {
  const toUnlock = [];
  const unlockedIds = unlockedAchievements.map(a => a.id);

  achievementList.forEach(achievement => {
    // Skip if already unlocked
    if (unlockedIds.includes(achievement.id)) {
      return;
    }

    const progress = getProgress(achievement, user, chores, transactions);

    if (progress >= achievement.requirement.target) {
      toUnlock.push(achievement.id);
    }
  });

  return toUnlock;
}

/**
 * Get progress toward an achievement
 * @param {object} achievement - Achievement object
 * @param {object} user - User object
 * @param {array} chores - All chores
 * @param {array} transactions - All transactions
 * @returns {number} Current progress value
 */
export function getProgress(achievement, user, chores, transactions) {
  const { type } = achievement.requirement;

  switch (type) {
    case 'chores_completed': {
      const completedChores = chores.filter(c => c.status === 'completed');
      return completedChores.length;
    }

    case 'sats_earned': {
      const earnTransactions = transactions.filter(t => t.type === 'earn');
      const totalEarned = earnTransactions.reduce((sum, t) => sum + t.amount, 0);
      return totalEarned;
    }

    case 'lessons_completed': {
      // This will be checked from store.lessons
      // For now, return 0 as placeholder
      return 0;
    }

    case 'streak_days': {
      return calculateStreak(chores);
    }

    case 'level_reached': {
      return user.level;
    }

    case 'special': {
      return checkSpecialAchievement(achievement.requirement.target, chores);
    }

    default:
      return 0;
  }
}

/**
 * Calculate current streak of consecutive days with completed chores
 * @param {array} chores - All chores
 * @returns {number} Streak in days
 */
function calculateStreak(chores) {
  const completedChores = chores
    .filter(c => c.status === 'completed' && c.completedAt)
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

  if (completedChores.length === 0) return 0;

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  // Check if there's a chore completed today
  const hasToday = completedChores.some(c => isToday(c.completedAt));

  if (!hasToday) {
    // If no chore today, check yesterday
    currentDate.setDate(currentDate.getDate() - 1);
  }

  // Count consecutive days
  for (let i = 0; i < 365; i++) { // Max 365 day streak
    const dateStr = currentDate.toISOString().split('T')[0];
    const hasChoreOnDate = completedChores.some(c => {
      const choreDate = new Date(c.completedAt);
      choreDate.setHours(0, 0, 0, 0);
      return choreDate.toISOString().split('T')[0] === dateStr;
    });

    if (hasChoreOnDate) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Check special achievement conditions
 * @param {string} target - Special target type
 * @param {array} chores - All chores
 * @returns {number} 1 if achieved, 0 if not
 */
function checkSpecialAchievement(target, chores) {
  switch (target) {
    case 'early_completion': {
      // Check if any chore was completed before 9 AM
      const earlyChore = chores.find(c => {
        if (c.status !== 'completed' || !c.completedAt) return false;
        const completedDate = new Date(c.completedAt);
        return completedDate.getHours() < 9;
      });
      return earlyChore ? 1 : 0;
    }

    case 'five_in_one_day': {
      // Check if 5 chores were completed on any single day
      const completedChores = chores.filter(c => c.status === 'completed' && c.completedAt);
      const choresByDate = {};

      completedChores.forEach(chore => {
        const date = new Date(chore.completedAt).toISOString().split('T')[0];
        choresByDate[date] = (choresByDate[date] || 0) + 1;
      });

      const maxInOneDay = Math.max(...Object.values(choresByDate), 0);
      return maxInOneDay >= 5 ? 1 : 0;
    }

    default:
      return 0;
  }
}

/**
 * Get all achievements with their current progress
 * @param {object} user - User object
 * @param {array} chores - All chores
 * @param {array} transactions - All transactions
 * @param {array} completedLessons - Completed lesson IDs
 * @param {array} unlockedAchievements - Unlocked achievements
 * @returns {array} Achievements with progress data
 */
export function getAllAchievementsWithProgress(user, chores, transactions, completedLessons, unlockedAchievements) {
  return achievementList.map(achievement => {
    const unlocked = unlockedAchievements.find(a => a.id === achievement.id);

    // For lessons_completed type, use completedLessons count
    let progress;
    if (achievement.requirement.type === 'lessons_completed') {
      progress = completedLessons.length;
    } else {
      progress = getProgress(achievement, user, chores, transactions);
    }

    return {
      ...achievement,
      unlocked: !!unlocked,
      unlockedAt: unlocked ? unlocked.unlockedAt : null,
      progress,
      percentage: Math.min(100, Math.round((progress / achievement.requirement.target) * 100))
    };
  });
}

export const achievements = {
  checkUnlocks,
  getProgress,
  getAllAchievementsWithProgress
};
