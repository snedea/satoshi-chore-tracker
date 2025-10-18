# Architecture Document: Satoshi's Chore Tracker
## Technical Specifications & Implementation Plan

**Date:** October 18, 2025
**Architect:** Autonomous Build System
**Based on:** Scout Report (scout-report.md)

---

## 1. SYSTEM ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser (Client Side)                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────┐      ┌──────────────┐     ┌─────────────┐ │
│  │   index.html │────▶│   main.js    │────▶│   Router    │ │
│  │  (entry)    │      │ (bootstrap)  │     │  (SPA nav)  │ │
│  └─────────────┘      └──────────────┘     └──────┬──────┘ │
│                                                     │         │
│                       ┌─────────────────────────────┘         │
│                       │                                       │
│       ┌───────────────┴────────────────────┐                 │
│       │         Page Components            │                 │
│       ├────────────────┬───────────────────┤                 │
│       │  HomePage      │  ChoresPage       │                 │
│       │  LearnPage     │  WalletPage       │                 │
│       │  ParentPage    │  SettingsPage     │                 │
│       └────────┬───────┴──────────┬────────┘                 │
│                │                  │                           │
│       ┌────────▼──────────────────▼────────┐                 │
│       │      Reusable Components           │                 │
│       │  (ChoreCard, BalanceDisplay, etc)  │                 │
│       └────────┬────────────────────────────┘                 │
│                │                                              │
│       ┌────────▼────────────────────────────┐                │
│       │       State Store (Reactive)        │                │
│       │  - user, chores, transactions       │                │
│       └────────┬────────────────────────────┘                │
│                │                                              │
│       ┌────────▼────────────────────────────┐                │
│       │    Storage Service (localStorage)   │                │
│       │  - save, load, export, import       │                │
│       └─────────────────────────────────────┘                │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Architecture Pattern:** Single Page Application (SPA) with client-side routing
**State Management:** Reactive store pattern with event-driven updates
**Data Persistence:** localStorage with JSON serialization
**Rendering:** Manual DOM manipulation (vanilla JS)

---

## 2. COMPLETE FILE & DIRECTORY STRUCTURE

```
satoshi-chore-tracker/
├── index.html                    # Main HTML entry point
├── package.json                  # NPM dependencies & scripts
├── vite.config.js               # Vite build configuration
├── vitest.config.js             # Vitest test configuration
├── .gitignore                   # Git ignore file
├── README.md                    # Project documentation
│
├── public/                      # Static assets
│   ├── favicon.ico
│   ├── satoshi-icon.svg        # Bitcoin/satoshi icon
│   └── manifest.json           # PWA manifest
│
├── src/                         # Source code
│   ├── main.js                 # Application bootstrap
│   ├── router.js               # SPA routing logic
│   │
│   ├── state/
│   │   └── store.js            # Reactive state management
│   │
│   ├── services/
│   │   ├── storage.js          # localStorage abstraction
│   │   └── achievements.js     # Achievement/badge logic
│   │
│   ├── utils/
│   │   ├── bitcoin.js          # Bitcoin/satoshi calculations
│   │   ├── dateUtils.js        # Date formatting utilities
│   │   └── validators.js       # Input validation
│   │
│   ├── pages/
│   │   ├── HomePage.js         # Dashboard/home view
│   │   ├── ChoresPage.js       # Chore list & management
│   │   ├── LearnPage.js        # Bitcoin education modules
│   │   ├── WalletPage.js       # Transaction history
│   │   ├── ParentPage.js       # Parent controls
│   │   └── SettingsPage.js     # App settings
│   │
│   ├── components/
│   │   ├── ChoreCard.js        # Individual chore display
│   │   ├── BalanceDisplay.js   # Satoshi balance widget
│   │   ├── TransactionList.js  # Transaction history
│   │   ├── ProgressBar.js      # Visual progress indicator
│   │   ├── Modal.js            # Modal dialog component
│   │   ├── Button.js           # Reusable button
│   │   ├── NavBar.js           # Navigation bar
│   │   └── EducationCard.js    # Learning module card
│   │
│   ├── data/
│   │   ├── educationContent.js # Bitcoin education lessons
│   │   └── achievements.js     # Badge/achievement definitions
│   │
│   └── styles/
│       ├── main.css            # Global styles & variables
│       ├── components.css      # Component-specific styles
│       └── animations.css      # Animation definitions
│
├── tests/                       # Test files
│   ├── unit/
│   │   ├── storage.test.js     # Storage service tests
│   │   ├── bitcoin.test.js     # Bitcoin utils tests
│   │   ├── store.test.js       # State management tests
│   │   ├── validators.test.js  # Validation tests
│   │   └── achievements.test.js
│   │
│   ├── integration/
│   │   ├── choreFlow.test.js   # Complete chore workflow
│   │   ├── persistence.test.js # Data save/load
│   │   └── parentMode.test.js  # Parent controls
│   │
│   └── helpers/
│       └── testUtils.js        # Test utilities & mocks
│
└── docs/                        # Documentation (created later)
```

---

## 3. MODULE SPECIFICATIONS

### 3.1 State Store (`src/state/store.js`)

**Responsibilities:**
- Centralized application state
- Reactive updates via event system
- Automatic localStorage sync

**Public API:**
```javascript
export const store = {
  // State getters
  getState(): AppState,
  getUser(): User,
  getChores(): Chore[],
  getTransactions(): Transaction[],
  getAchievements(): Achievement[],

  // State setters (trigger events)
  setUser(user: User): void,
  addChore(chore: Chore): void,
  updateChore(id: string, updates: Partial<Chore>): void,
  deleteChore(id: string): void,
  completeChore(id: string): void,
  addTransaction(transaction: Transaction): void,
  unlockAchievement(achievementId: string): void,

  // Event subscription
  subscribe(event: string, callback: Function): void,
  unsubscribe(event: string, callback: Function): void,

  // Persistence
  save(): void,
  load(): void,
  reset(): void,
  exportData(): string,
  importData(jsonString: string): void
}
```

**Events Emitted:**
- `user:updated`
- `chore:added`, `chore:updated`, `chore:deleted`, `chore:completed`
- `transaction:added`
- `achievement:unlocked`
- `balance:changed`

### 3.2 Storage Service (`src/services/storage.js`)

**Responsibilities:**
- localStorage read/write abstraction
- Data serialization/deserialization
- Export/import functionality

**Public API:**
```javascript
export const storage = {
  save(key: string, data: any): boolean,
  load(key: string): any | null,
  remove(key: string): void,
  clear(): void,
  exportAll(): string,
  importAll(jsonString: string): boolean,
  isAvailable(): boolean
}
```

**Storage Keys:**
- `satoshi_user` - User profile
- `satoshi_chores` - Chore list
- `satoshi_transactions` - Transaction history
- `satoshi_achievements` - Unlocked achievements
- `satoshi_settings` - App settings

### 3.3 Router (`src/router.js`)

**Responsibilities:**
- URL-based page navigation
- Browser history management
- Route parameter extraction

**Public API:**
```javascript
export const router = {
  init(): void,
  navigate(path: string): void,
  getCurrentRoute(): Route,
  addRoute(path: string, handler: Function): void
}
```

**Routes:**
- `/` - HomePage
- `/chores` - ChoresPage
- `/learn` - LearnPage
- `/wallet` - WalletPage
- `/parent` - ParentPage
- `/settings` - SettingsPage

### 3.4 Bitcoin Utils (`src/utils/bitcoin.js`)

**Responsibilities:**
- Satoshi calculations and conversions
- Bitcoin formatting

**Public API:**
```javascript
export const bitcoin = {
  formatSats(amount: number): string,          // "1,234 sats"
  formatBTC(sats: number): string,             // "0.00001234 BTC"
  satsToBTC(sats: number): number,             // sats / 100000000
  btcToSats(btc: number): number,              // btc * 100000000
  addSats(a: number, b: number): number,
  subtractSats(a: number, b: number): number
}
```

### 3.5 Achievement Service (`src/services/achievements.js`)

**Responsibilities:**
- Check for achievement unlocks
- Track progress toward achievements

**Public API:**
```javascript
export const achievements = {
  checkUnlocks(user: User, chores: Chore[], transactions: Transaction[]): string[],
  getProgress(achievementId: string, user: User): number,
  getAllAchievements(): Achievement[]
}
```

---

## 4. DATA MODELS & SCHEMAS

### User Schema
```javascript
{
  id: string,              // UUID
  name: string,            // Child's name
  avatar: string,          // Avatar identifier
  balance: number,         // Satoshis (integer)
  level: number,           // User level (1-50)
  xp: number,              // Experience points
  createdAt: string,       // ISO date
  parentMode: boolean,     // Parent mode enabled
  parentPin: string | null,// PIN for parent mode (hashed)
  settings: {
    difficulty: 'easy' | 'medium' | 'hard',
    soundEnabled: boolean,
    notificationsEnabled: boolean,
    theme: 'light' | 'dark'
  }
}
```

### Chore Schema
```javascript
{
  id: string,              // UUID
  title: string,           // Chore name
  description: string,     // Details
  reward: number,          // Satoshis earned
  category: 'household' | 'homework' | 'behavior' | 'other',
  difficulty: 'easy' | 'medium' | 'hard',
  status: 'pending' | 'completed',
  createdAt: string,       // ISO date
  completedAt: string | null,
  recurring: boolean,
  recurrence: 'daily' | 'weekly' | null,
  createdBy: 'parent' | 'self'
}
```

### Transaction Schema
```javascript
{
  id: string,              // UUID
  type: 'earn' | 'spend' | 'bonus',
  amount: number,          // Satoshis (positive or negative)
  description: string,     // What was it for
  choreId: string | null,  // Associated chore (if any)
  timestamp: string,       // ISO date
  balanceAfter: number     // Balance after transaction
}
```

### Achievement Schema
```javascript
{
  id: string,              // Achievement ID
  title: string,           // Badge name
  description: string,     // How to earn
  icon: string,            // Icon identifier
  unlocked: boolean,
  unlockedAt: string | null,
  progress: number,        // 0-100
  requirement: {
    type: 'chores_completed' | 'sats_earned' | 'streak_days' | 'lessons_completed',
    target: number
  }
}
```

---

## 5. COMPONENT ARCHITECTURE

### Component Hierarchy
```
App (main.js)
├── NavBar
├── Router
    ├── HomePage
    │   ├── BalanceDisplay
    │   ├── ProgressBar (level/XP)
    │   ├── ChoreCard (x3, recent)
    │   └── Button (View All Chores)
    ├── ChoresPage
    │   ├── Button (Add Chore - parent mode)
    │   ├── ChoreCard (list)
    │   └── Modal (Add/Edit Chore)
    ├── LearnPage
    │   ├── ProgressBar (learning progress)
    │   └── EducationCard (lessons)
    ├── WalletPage
    │   ├── BalanceDisplay
    │   └── TransactionList
    ├── ParentPage
    │   └── Modal (PIN entry)
    └── SettingsPage
```

### Component Pattern (Example: ChoreCard)
```javascript
// src/components/ChoreCard.js
export function ChoreCard(chore, onComplete) {
  const card = document.createElement('div');
  card.className = 'chore-card';
  card.innerHTML = `
    <div class="chore-header">
      <h3>${chore.title}</h3>
      <span class="chore-reward">${formatSats(chore.reward)}</span>
    </div>
    <p class="chore-description">${chore.description}</p>
    <div class="chore-footer">
      <span class="chore-category">${chore.category}</span>
      ${chore.status === 'pending' ?
        '<button class="btn-complete">Complete</button>' :
        '<span class="completed-badge">✓ Done</span>'
      }
    </div>
  `;

  if (chore.status === 'pending') {
    card.querySelector('.btn-complete').addEventListener('click', () => {
      onComplete(chore.id);
    });
  }

  return card;
}
```

---

## 6. STATE MANAGEMENT DESIGN

### Store Implementation Pattern
```javascript
// Reactive store with event system
const state = {
  user: null,
  chores: [],
  transactions: [],
  achievements: []
};

const listeners = {};

function emit(event, data) {
  if (listeners[event]) {
    listeners[event].forEach(callback => callback(data));
  }
}

function setState(key, value) {
  state[key] = value;
  emit(`${key}:updated`, value);
  storage.save(`satoshi_${key}`, value);
}
```

### State Update Flow
1. User action triggers event (e.g., button click)
2. Event handler calls store method (e.g., `store.completeChore(id)`)
3. Store updates internal state
4. Store emits event (e.g., `chore:completed`)
5. Store saves to localStorage
6. Components subscribed to event re-render

---

## 7. ROUTING STRATEGY

### Hash-based Routing (for simplicity)
- URLs: `#/`, `#/chores`, `#/learn`, etc.
- No server configuration needed
- Works with file:// protocol and static hosting

### Router Implementation
```javascript
const routes = {
  '/': HomePage,
  '/chores': ChoresPage,
  '/learn': LearnPage,
  '/wallet': WalletPage,
  '/parent': ParentPage,
  '/settings': SettingsPage
};

function navigate(path) {
  window.location.hash = path;
}

function handleRoute() {
  const path = window.location.hash.slice(1) || '/';
  const page = routes[path] || routes['/'];
  renderPage(page);
}

window.addEventListener('hashchange', handleRoute);
```

---

## 8. UI/UX SPECIFICATIONS

### Color Palette
```css
:root {
  /* Primary Colors */
  --bitcoin-orange: #F7931A;
  --gold: #FFD700;
  --dark-blue: #1E3A5F;

  /* Semantic Colors */
  --success: #10B981;
  --warning: #F59E0B;
  --error: #EF4444;
  --info: #3B82F6;

  /* Neutral Colors */
  --white: #FFFFFF;
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-200: #E5E7EB;
  --gray-600: #4B5563;
  --gray-900: #111827;

  /* Background */
  --bg-primary: #F0F4F8;
  --bg-card: #FFFFFF;

  /* Text */
  --text-primary: #111827;
  --text-secondary: #6B7280;
}
```

### Typography
```css
:root {
  /* Font Families */
  --font-primary: 'Comic Neue', 'Comic Sans MS', cursive;
  --font-mono: 'Courier New', monospace;

  /* Font Sizes (ages 8-10) */
  --text-xs: 12px;
  --text-sm: 14px;
  --text-base: 16px;
  --text-lg: 20px;
  --text-xl: 24px;
  --text-2xl: 32px;
  --text-3xl: 40px;

  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-bold: 700;
}
```

### Spacing & Layout
```css
:root {
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  --border-radius: 12px;
  --border-radius-lg: 16px;

  /* Touch Targets (min 44x44px) */
  --touch-target: 44px;
}
```

### Responsive Breakpoints
```css
/* Mobile-first approach */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
```

### Animations
```css
/* Celebration animation for chore completion */
@keyframes celebrate {
  0% { transform: scale(1); }
  50% { transform: scale(1.2) rotate(5deg); }
  100% { transform: scale(1) rotate(0deg); }
}

/* Coin earn animation */
@keyframes coinEarn {
  0% { transform: translateY(0) scale(0); opacity: 0; }
  50% { transform: translateY(-20px) scale(1.5); opacity: 1; }
  100% { transform: translateY(-40px) scale(1); opacity: 0; }
}
```

---

## 9. EDUCATIONAL CONTENT STRUCTURE

### Learning Modules (Progressive)
```javascript
// src/data/educationContent.js
export const lessons = [
  {
    id: 'lesson-1',
    title: 'What is Bitcoin?',
    level: 1,
    duration: '3 min',
    content: {
      intro: 'Bitcoin is like digital money that lives on the internet!',
      analogy: 'Just like you have coins in your piggy bank, Bitcoin is money you can save on your computer.',
      keyPoints: [
        'Bitcoin is digital money',
        'You can send it anywhere in the world',
        'It\'s not controlled by any country or bank'
      ],
      quiz: [
        {
          question: 'What is Bitcoin?',
          options: ['Digital money', 'A video game', 'A toy'],
          correct: 0
        }
      ]
    },
    reward: 10 // sats for completing
  },
  {
    id: 'lesson-2',
    title: 'What are Satoshis?',
    level: 1,
    duration: '2 min',
    content: {
      intro: 'Satoshis (sats) are tiny pieces of Bitcoin!',
      analogy: 'If Bitcoin is a pizza, satoshis are tiny crumbs. 100 million crumbs make one whole pizza!',
      keyPoints: [
        '1 Bitcoin = 100,000,000 satoshis',
        'Satoshis are named after Bitcoin\'s creator',
        'You earn sats by completing chores!'
      ],
      quiz: [
        {
          question: 'How many satoshis are in 1 Bitcoin?',
          options: ['100', '1,000', '100,000,000'],
          correct: 2
        }
      ]
    },
    reward: 15
  }
  // ... more lessons
];
```

### Achievement Definitions
```javascript
// src/data/achievements.js
export const achievementList = [
  {
    id: 'first-chore',
    title: 'First Steps',
    description: 'Complete your first chore',
    icon: '🎯',
    requirement: { type: 'chores_completed', target: 1 }
  },
  {
    id: 'sat-collector',
    title: 'Sat Collector',
    description: 'Earn 1,000 satoshis',
    icon: '💰',
    requirement: { type: 'sats_earned', target: 1000 }
  },
  {
    id: 'bitcoin-student',
    title: 'Bitcoin Student',
    description: 'Complete 5 learning modules',
    icon: '📚',
    requirement: { type: 'lessons_completed', target: 5 }
  },
  {
    id: 'week-warrior',
    title: 'Week Warrior',
    description: 'Complete chores for 7 days in a row',
    icon: '🔥',
    requirement: { type: 'streak_days', target: 7 }
  }
  // ... more achievements
];
```

---

## 10. STEP-BY-STEP IMPLEMENTATION PLAN

### Phase 1: Project Setup (Step 1-5)
1. Initialize Vite project with vanilla JavaScript template
2. Install dependencies (Vitest, etc.)
3. Create complete directory structure
4. Set up Vite and Vitest configuration files
5. Create .gitignore file

### Phase 2: Core Infrastructure (Step 6-12)
6. Implement storage service (src/services/storage.js)
7. Implement Bitcoin utilities (src/utils/bitcoin.js)
8. Implement date utilities (src/utils/dateUtils.js)
9. Implement validators (src/utils/validators.js)
10. Implement state store (src/state/store.js)
11. Implement router (src/router.js)
12. Create main.js bootstrap logic

### Phase 3: Data Layer (Step 13-15)
13. Create education content data (src/data/educationContent.js)
14. Create achievements data (src/data/achievements.js)
15. Implement achievements service (src/services/achievements.js)

### Phase 4: UI Components (Step 16-23)
16. Create base HTML template (index.html)
17. Implement NavBar component
18. Implement BalanceDisplay component
19. Implement ChoreCard component
20. Implement TransactionList component
21. Implement ProgressBar component
22. Implement Button component
23. Implement Modal component
24. Implement EducationCard component

### Phase 5: Pages (Step 25-30)
25. Implement HomePage
26. Implement ChoresPage
27. Implement LearnPage
28. Implement WalletPage
29. Implement ParentPage
30. Implement SettingsPage

### Phase 6: Styling (Step 31-33)
31. Create main.css (variables, global styles)
32. Create components.css
33. Create animations.css

### Phase 7: Testing (Step 34-41)
34. Write storage service tests
35. Write Bitcoin utils tests
36. Write validators tests
37. Write store tests
38. Write achievements tests
39. Write chore flow integration test
40. Write persistence integration test
41. Write parent mode integration test

### Phase 8: Polish & Configuration (Step 42-45)
42. Create PWA manifest.json
43. Add favicon and icons
44. Create initial README
45. Test full application flow manually

---

## 11. COMPREHENSIVE TEST PLAN

### 11.1 Unit Tests

**Storage Service Tests** (`tests/unit/storage.test.js`)
```javascript
describe('Storage Service', () => {
  test('should save and load data correctly', () => {});
  test('should return null for missing keys', () => {});
  test('should handle invalid JSON gracefully', () => {});
  test('should export all data as JSON string', () => {});
  test('should import data from JSON string', () => {});
  test('should clear all storage', () => {});
  test('should detect localStorage availability', () => {});
});
```

**Bitcoin Utils Tests** (`tests/unit/bitcoin.test.js`)
```javascript
describe('Bitcoin Utils', () => {
  test('should format satoshis correctly', () => {
    expect(bitcoin.formatSats(1000)).toBe('1,000 sats');
  });
  test('should convert sats to BTC', () => {
    expect(bitcoin.satsToBTC(100000000)).toBe(1);
  });
  test('should convert BTC to sats', () => {
    expect(bitcoin.btcToSats(1)).toBe(100000000);
  });
  test('should add satoshis correctly', () => {});
  test('should subtract satoshis correctly', () => {});
});
```

**Store Tests** (`tests/unit/store.test.js`)
```javascript
describe('State Store', () => {
  test('should initialize with empty state', () => {});
  test('should add chore to state', () => {});
  test('should update chore in state', () => {});
  test('should delete chore from state', () => {});
  test('should emit events on state changes', () => {});
  test('should calculate balance correctly', () => {});
  test('should handle chore completion', () => {});
  test('should create transaction on chore completion', () => {});
});
```

**Validators Tests** (`tests/unit/validators.test.js`)
```javascript
describe('Validators', () => {
  test('should validate chore title', () => {});
  test('should validate reward amount', () => {});
  test('should validate user name', () => {});
  test('should validate PIN format', () => {});
});
```

**Achievements Tests** (`tests/unit/achievements.test.js`)
```javascript
describe('Achievements Service', () => {
  test('should unlock "First Steps" after 1 chore', () => {});
  test('should track progress toward achievements', () => {});
  test('should return all unlocked achievements', () => {});
  test('should calculate streak correctly', () => {});
});
```

### 11.2 Integration Tests

**Chore Flow Integration** (`tests/integration/choreFlow.test.js`)
```javascript
describe('Complete Chore Workflow', () => {
  test('should complete full chore cycle: create → complete → earn sats', () => {
    // 1. Initialize store
    // 2. Add chore
    // 3. Complete chore
    // 4. Verify balance increased
    // 5. Verify transaction created
    // 6. Verify achievement unlocked (if applicable)
  });

  test('should update UI after chore completion', () => {});
  test('should persist state after reload', () => {});
});
```

**Persistence Integration** (`tests/integration/persistence.test.js`)
```javascript
describe('Data Persistence', () => {
  test('should save state to localStorage on changes', () => {});
  test('should restore state from localStorage on load', () => {});
  test('should handle corrupted localStorage data', () => {});
  test('should export and import data correctly', () => {});
});
```

**Parent Mode Integration** (`tests/integration/parentMode.test.js`)
```javascript
describe('Parent Mode', () => {
  test('should require PIN to access parent page', () => {});
  test('should allow parents to create chores', () => {});
  test('should prevent children from deleting chores', () => {});
});
```

### 11.3 Browser/E2E Tests (Manual)

**Why Manual Tests:**
- ES6 modules in browser environment
- Visual verification of animations
- Touch interaction testing
- localStorage behavior in real browser

**Manual Test Checklist:**
1. **Initial Load**
   - [ ] App loads without errors
   - [ ] Navigation bar displays correctly
   - [ ] Default user is created
   - [ ] Balance shows 0 sats

2. **Chore Management**
   - [ ] Can create new chore
   - [ ] Chore appears in list
   - [ ] Can complete chore
   - [ ] Completion animation plays
   - [ ] Balance updates correctly

3. **Learning Modules**
   - [ ] Can view lesson
   - [ ] Quiz works correctly
   - [ ] Reward granted on completion
   - [ ] Progress tracked

4. **Persistence**
   - [ ] Reload page - data persists
   - [ ] Export data - downloads JSON
   - [ ] Import data - restores state

5. **Parent Mode**
   - [ ] PIN required for access
   - [ ] Can create chores for child

6. **Responsive Design**
   - [ ] Works on mobile (< 640px)
   - [ ] Works on tablet (768px)
   - [ ] Works on desktop (1024px+)

7. **Browser Compatibility**
   - [ ] Chrome/Edge (latest)
   - [ ] Firefox (latest)
   - [ ] Safari (latest)

### 11.4 Test Execution

**Run Unit Tests:**
```bash
npm run test
```

**Run Tests with Coverage:**
```bash
npm run test:coverage
```

**Watch Mode (during development):**
```bash
npm run test:watch
```

**Manual Browser Testing:**
```bash
npm run dev
# Open http://localhost:5173 in browser
# Follow manual test checklist
```

**Production Build Test:**
```bash
npm run build
npm run preview
# Test production build at http://localhost:4173
```

### 11.5 Test Success Criteria

- [ ] All unit tests pass (100%)
- [ ] All integration tests pass (100%)
- [ ] Test coverage ≥ 80% for critical paths
- [ ] Manual browser tests pass on 3+ browsers
- [ ] No console errors in browser
- [ ] localStorage persists across reloads
- [ ] Animations render smoothly (60fps)
- [ ] Touch targets ≥ 44x44px verified

---

## 12. PREVENTIVE MEASURES

### CORS Prevention
- Using Vite dev server (no file:// protocol issues)
- ES6 modules load correctly via HTTP
- `npm run dev` for development
- `npm run preview` for production testing

### Browser Compatibility
- Target: ES6+ (Chrome 90+, Firefox 88+, Safari 14+)
- Fallback messages for unsupported browsers
- localStorage availability check
- Graceful degradation if features unavailable

### Performance Optimization
- Minimal dependencies (vanilla JS)
- Lazy load education content
- Debounce localStorage writes
- Virtual scrolling for large chore lists (if needed)

### Error Handling
- Try-catch around localStorage operations
- Validation before state updates
- User-friendly error messages
- Error boundary pattern for crashes

### Data Backup
- Export/import functionality
- Automatic backup reminders (every 30 days)
- Clear instructions for data recovery

### Security
- No real Bitcoin integration (simulation only)
- Client-side only (no backend vulnerabilities)
- PIN hashing for parent mode
- Input sanitization to prevent XSS

---

## 13. BUILD & DEVELOPMENT CONFIGURATION

### Vite Configuration (`vite.config.js`)
```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  },
  server: {
    port: 5173,
    open: true
  }
});
```

### Vitest Configuration (`vitest.config.js`)
```javascript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/', '*.config.js']
    }
  }
});
```

### Package.json Dependencies
```json
{
  "name": "satoshi-chore-tracker",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "vitest": "^1.0.0",
    "@vitest/ui": "^1.0.0",
    "@vitest/coverage-v8": "^1.0.0",
    "jsdom": "^23.0.0"
  },
  "dependencies": {}
}
```

### NPM Scripts
- `npm run dev` - Start development server (localhost:5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run all tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report

---

## 14. SUCCESS CRITERIA

### Functional Requirements
- [ ] User can create and complete chores
- [ ] User earns satoshis for completing chores
- [ ] Balance updates correctly
- [ ] Transaction history displays accurately
- [ ] Learning modules are accessible and functional
- [ ] Achievements unlock based on progress
- [ ] Parent mode requires PIN authentication
- [ ] Data persists across browser sessions
- [ ] Export/import functionality works
- [ ] Responsive design works on mobile/tablet/desktop

### Performance Benchmarks
- [ ] Initial load time < 2 seconds (3G network)
- [ ] Time to interactive < 3 seconds
- [ ] Smooth animations (60fps)
- [ ] localStorage operations < 50ms

### Test Coverage Requirements
- [ ] Unit test coverage ≥ 80%
- [ ] All critical user flows have integration tests
- [ ] Manual browser tests pass on Chrome, Firefox, Safari

### Browser Compatibility
- [ ] Chrome 90+ ✓
- [ ] Firefox 88+ ✓
- [ ] Safari 14+ ✓
- [ ] Edge 90+ ✓

### Accessibility Standards
- [ ] Touch targets ≥ 44x44px
- [ ] Color contrast ratio ≥ 4.5:1
- [ ] Keyboard navigation support
- [ ] Screen reader friendly labels

### Educational Effectiveness
- [ ] Bitcoin concepts explained in age-appropriate language
- [ ] Learning modules follow progressive difficulty
- [ ] Gamification encourages engagement
- [ ] Clear connection between chores and rewards

### Code Quality
- [ ] Modular architecture (separation of concerns)
- [ ] Consistent code style
- [ ] Comprehensive error handling
- [ ] Well-documented functions
- [ ] No console errors or warnings

---

## 15. IMPLEMENTATION NOTES FOR BUILDER

### Key Priorities
1. **Simplicity First:** Vanilla JS is chosen for simplicity - don't overcomplicate
2. **Mobile-First:** Design for small screens, enhance for larger
3. **Offline-Capable:** All features work without internet
4. **Kid-Friendly:** Large buttons, clear text, fun animations
5. **Educational:** Every interaction teaches something about Bitcoin

### Critical Implementation Details
- Use ES6 modules (`import`/`export`)
- Event-driven architecture (pub/sub pattern)
- Automatic localStorage sync on state changes
- Hash-based routing for simplicity
- Manual DOM manipulation (no virtual DOM)

### Testing Reminders
- Write tests alongside code (TDD preferred)
- Test localStorage operations thoroughly
- Mock localStorage in tests using testUtils
- Verify animations in real browser
- Test on multiple devices/browsers

### Common Pitfalls to Avoid
- Don't use `file://` protocol - always use Vite dev server
- Don't forget to validate user inputs
- Don't store sensitive data (no real Bitcoin!)
- Don't make UI too complex for target age group
- Don't skip error handling for localStorage

---

**Architecture Complete. Ready for Builder Phase.**
