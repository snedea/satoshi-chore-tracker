/**
 * Reactive state store for application state management
 * Implements event-driven updates with automatic localStorage persistence
 */

import { storage } from '../services/storage.js';
import { addSats } from '../utils/bitcoin.js';

// Default state structure
const defaultState = {
  user: {
    id: crypto.randomUUID(),
    name: 'Satoshi Student',
    avatar: '👤',
    balance: 0,
    level: 1,
    xp: 0,
    createdAt: new Date().toISOString(),
    parentMode: false,
    parentPin: null,
    settings: {
      difficulty: 'medium',
      soundEnabled: true,
      notificationsEnabled: false,
      theme: 'light'
    }
  },
  chores: [],
  transactions: [],
  achievements: [],
  lessons: []
};

// Internal state
let state = { ...defaultState };

// Event listeners registry
const listeners = {};

/**
 * Initialize store from localStorage
 */
export function init() {
  const savedUser = storage.load('user');
  const savedChores = storage.load('chores');
  const savedTransactions = storage.load('transactions');
  const savedAchievements = storage.load('achievements');
  const savedLessons = storage.load('lessons');

  if (savedUser) state.user = savedUser;
  if (savedChores) state.chores = savedChores;
  if (savedTransactions) state.transactions = savedTransactions;
  if (savedAchievements) state.achievements = savedAchievements;
  if (savedLessons) state.lessons = savedLessons;

  // If no user, initialize with defaults
  if (!savedUser) {
    storage.save('user', state.user);
  }

  emit('store:initialized', state);
}

/**
 * Get entire state
 * @returns {object} Current state
 */
export function getState() {
  return { ...state };
}

/**
 * Get user data
 * @returns {object} User object
 */
export function getUser() {
  return { ...state.user };
}

/**
 * Get all chores
 * @returns {array} Chores array
 */
export function getChores() {
  return [...state.chores];
}

/**
 * Get pending chores only
 * @returns {array} Pending chores
 */
export function getPendingChores() {
  return state.chores.filter(chore => chore.status === 'pending');
}

/**
 * Get completed chores
 * @returns {array} Completed chores
 */
export function getCompletedChores() {
  return state.chores.filter(chore => chore.status === 'completed');
}

/**
 * Get all transactions
 * @returns {array} Transactions array
 */
export function getTransactions() {
  return [...state.transactions];
}

/**
 * Get all achievements
 * @returns {array} Achievements array
 */
export function getAchievements() {
  return [...state.achievements];
}

/**
 * Get completed lessons
 * @returns {array} Completed lesson IDs
 */
export function getCompletedLessons() {
  return [...state.lessons];
}

/**
 * Set user data
 * @param {object} user - User object
 */
export function setUser(user) {
  state.user = { ...state.user, ...user };
  storage.save('user', state.user);
  emit('user:updated', state.user);
}

/**
 * Add a new chore
 * @param {object} chore - Chore object
 */
export function addChore(chore) {
  const newChore = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    completedAt: null,
    status: 'pending',
    ...chore
  };

  state.chores.push(newChore);
  storage.save('chores', state.chores);
  emit('chore:added', newChore);
}

/**
 * Update an existing chore
 * @param {string} id - Chore ID
 * @param {object} updates - Properties to update
 */
export function updateChore(id, updates) {
  const index = state.chores.findIndex(c => c.id === id);
  if (index === -1) return;

  state.chores[index] = { ...state.chores[index], ...updates };
  storage.save('chores', state.chores);
  emit('chore:updated', state.chores[index]);
}

/**
 * Delete a chore
 * @param {string} id - Chore ID
 */
export function deleteChore(id) {
  const index = state.chores.findIndex(c => c.id === id);
  if (index === -1) return;

  const deletedChore = state.chores[index];
  state.chores.splice(index, 1);
  storage.save('chores', state.chores);
  emit('chore:deleted', deletedChore);
}

/**
 * Complete a chore (awards satoshis and creates transaction)
 * @param {string} id - Chore ID
 */
export function completeChore(id) {
  const chore = state.chores.find(c => c.id === id);
  if (!chore || chore.status === 'completed') return;

  // Update chore status
  chore.status = 'completed';
  chore.completedAt = new Date().toISOString();

  // Award satoshis
  const previousBalance = state.user.balance;
  state.user.balance = addSats(state.user.balance, chore.reward);

  // Award XP (1 XP per satoshi earned)
  state.user.xp += chore.reward;

  // Check for level up (every 1000 XP = 1 level)
  const newLevel = Math.floor(state.user.xp / 1000) + 1;
  if (newLevel > state.user.level) {
    state.user.level = newLevel;
    emit('level:up', { level: newLevel });
  }

  // Create transaction record
  const transaction = {
    id: crypto.randomUUID(),
    type: 'earn',
    amount: chore.reward,
    description: `Completed: ${chore.title}`,
    choreId: chore.id,
    timestamp: new Date().toISOString(),
    balanceAfter: state.user.balance
  };

  state.transactions.unshift(transaction);

  // Save all changes
  storage.save('chores', state.chores);
  storage.save('user', state.user);
  storage.save('transactions', state.transactions);

  // Emit events
  emit('chore:completed', chore);
  emit('transaction:added', transaction);
  emit('balance:changed', {
    previous: previousBalance,
    current: state.user.balance,
    change: chore.reward
  });
}

/**
 * Add a transaction
 * @param {object} transaction - Transaction object
 */
export function addTransaction(transaction) {
  const newTransaction = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    balanceAfter: state.user.balance,
    ...transaction
  };

  state.transactions.unshift(newTransaction);
  storage.save('transactions', state.transactions);
  emit('transaction:added', newTransaction);
}

/**
 * Unlock an achievement
 * @param {string} achievementId - Achievement ID
 */
export function unlockAchievement(achievementId) {
  const achievement = state.achievements.find(a => a.id === achievementId);

  if (!achievement) {
    // Create new achievement record
    const newAchievement = {
      id: achievementId,
      unlocked: true,
      unlockedAt: new Date().toISOString()
    };
    state.achievements.push(newAchievement);
  } else if (!achievement.unlocked) {
    achievement.unlocked = true;
    achievement.unlockedAt = new Date().toISOString();
  } else {
    return; // Already unlocked
  }

  storage.save('achievements', state.achievements);
  emit('achievement:unlocked', achievementId);
}

/**
 * Mark a lesson as completed
 * @param {string} lessonId - Lesson ID
 */
export function completeLesson(lessonId) {
  if (!state.lessons.includes(lessonId)) {
    state.lessons.push(lessonId);
    storage.save('lessons', state.lessons);
    emit('lesson:completed', lessonId);
  }
}

/**
 * Subscribe to an event
 * @param {string} event - Event name
 * @param {function} callback - Callback function
 */
export function subscribe(event, callback) {
  if (!listeners[event]) {
    listeners[event] = [];
  }
  listeners[event].push(callback);
}

/**
 * Unsubscribe from an event
 * @param {string} event - Event name
 * @param {function} callback - Callback function to remove
 */
export function unsubscribe(event, callback) {
  if (!listeners[event]) return;

  const index = listeners[event].indexOf(callback);
  if (index > -1) {
    listeners[event].splice(index, 1);
  }
}

/**
 * Emit an event to all subscribers
 * @param {string} event - Event name
 * @param {any} data - Event data
 */
function emit(event, data) {
  if (listeners[event]) {
    listeners[event].forEach(callback => {
      try {
        callback(data);
      } catch (e) {
        console.error(`Error in event listener for ${event}:`, e);
      }
    });
  }
}

/**
 * Reset store to default state
 */
export function reset() {
  state = JSON.parse(JSON.stringify(defaultState));
  state.user.id = crypto.randomUUID();
  state.user.createdAt = new Date().toISOString();

  storage.clear();
  storage.save('user', state.user);

  emit('store:reset', state);
}

/**
 * Export all data
 * @returns {string} JSON string of all data
 */
export function exportData() {
  return storage.exportAll();
}

/**
 * Import data
 * @param {string} jsonString - JSON string to import
 * @returns {boolean} True if import succeeded
 */
export function importData(jsonString) {
  const success = storage.importAll(jsonString);

  if (success) {
    init(); // Reload state from storage
  }

  return success;
}

export const store = {
  init,
  getState,
  getUser,
  getChores,
  getPendingChores,
  getCompletedChores,
  getTransactions,
  getAchievements,
  getCompletedLessons,
  setUser,
  addChore,
  updateChore,
  deleteChore,
  completeChore,
  addTransaction,
  unlockAchievement,
  completeLesson,
  subscribe,
  unsubscribe,
  reset,
  exportData,
  importData
};
