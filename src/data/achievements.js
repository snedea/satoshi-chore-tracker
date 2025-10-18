/**
 * Achievement/badge definitions
 */

export const achievementList = [
  {
    id: 'first-chore',
    title: 'First Steps',
    description: 'Complete your first chore',
    icon: '🎯',
    requirement: {
      type: 'chores_completed',
      target: 1
    }
  },
  {
    id: 'chore-master-5',
    title: 'Chore Champion',
    description: 'Complete 5 chores',
    icon: '🏆',
    requirement: {
      type: 'chores_completed',
      target: 5
    }
  },
  {
    id: 'chore-master-10',
    title: 'Super Worker',
    description: 'Complete 10 chores',
    icon: '⭐',
    requirement: {
      type: 'chores_completed',
      target: 10
    }
  },
  {
    id: 'chore-master-25',
    title: 'Chore Legend',
    description: 'Complete 25 chores',
    icon: '🌟',
    requirement: {
      type: 'chores_completed',
      target: 25
    }
  },
  {
    id: 'sat-collector-100',
    title: 'Sat Collector',
    description: 'Earn 100 satoshis',
    icon: '💰',
    requirement: {
      type: 'sats_earned',
      target: 100
    }
  },
  {
    id: 'sat-collector-1000',
    title: 'Sat Saver',
    description: 'Earn 1,000 satoshis',
    icon: '💎',
    requirement: {
      type: 'sats_earned',
      target: 1000
    }
  },
  {
    id: 'sat-collector-10000',
    title: 'Bitcoin Banker',
    description: 'Earn 10,000 satoshis',
    icon: '🏦',
    requirement: {
      type: 'sats_earned',
      target: 10000
    }
  },
  {
    id: 'bitcoin-student',
    title: 'Bitcoin Student',
    description: 'Complete 3 learning modules',
    icon: '📚',
    requirement: {
      type: 'lessons_completed',
      target: 3
    }
  },
  {
    id: 'bitcoin-scholar',
    title: 'Bitcoin Scholar',
    description: 'Complete all 6 learning modules',
    icon: '🎓',
    requirement: {
      type: 'lessons_completed',
      target: 6
    }
  },
  {
    id: 'week-warrior',
    title: 'Week Warrior',
    description: 'Complete chores for 7 days in a row',
    icon: '🔥',
    requirement: {
      type: 'streak_days',
      target: 7
    }
  },
  {
    id: 'level-5',
    title: 'Rising Star',
    description: 'Reach Level 5',
    icon: '🚀',
    requirement: {
      type: 'level_reached',
      target: 5
    }
  },
  {
    id: 'level-10',
    title: 'Bitcoin Expert',
    description: 'Reach Level 10',
    icon: '👑',
    requirement: {
      type: 'level_reached',
      target: 10
    }
  },
  {
    id: 'early-bird',
    title: 'Early Bird',
    description: 'Complete a chore before 9 AM',
    icon: '🌅',
    requirement: {
      type: 'special',
      target: 'early_completion'
    }
  },
  {
    id: 'perfect-day',
    title: 'Perfect Day',
    description: 'Complete 5 chores in one day',
    icon: '✨',
    requirement: {
      type: 'special',
      target: 'five_in_one_day'
    }
  }
];

/**
 * Get achievement by ID
 * @param {string} achievementId - Achievement ID
 * @returns {object|null} Achievement object or null if not found
 */
export function getAchievementById(achievementId) {
  return achievementList.find(a => a.id === achievementId) || null;
}

/**
 * Get all achievements
 * @returns {array} All achievements
 */
export function getAllAchievements() {
  return [...achievementList];
}
