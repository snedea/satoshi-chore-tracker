# Architecture Documentation
## Satoshi's Chore Tracker

Technical architecture overview for developers and contributors.

---

## System Overview

Satoshi's Chore Tracker is a client-side Single Page Application (SPA) built with vanilla JavaScript, using modern ES6+ features and a component-based architecture.

### Core Technologies

- **Frontend Framework:** Vanilla JavaScript (ES6+)
- **Build Tool:** Vite 5.0
- **Testing Framework:** Vitest 1.0 with jsdom
- **Module System:** ES6 Modules
- **State Management:** Custom reactive store
- **Routing:** Hash-based SPA routing
- **Storage:** Browser localStorage
- **Styling:** Custom CSS with CSS Variables

### Architecture Pattern

**Type:** Single Page Application (SPA)
**Pattern:** Component-based with unidirectional data flow
**State:** Centralized reactive store with event-driven updates

---

## High-Level Architecture

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

---

## Directory Structure

```
satoshi-chore-tracker/
├── index.html                 # HTML entry point
├── package.json               # Dependencies and scripts
├── vite.config.js            # Vite build configuration
├── vitest.config.js          # Testing configuration
│
├── public/                    # Static assets
│   ├── favicon.ico
│   ├── satoshi-icon.svg
│   └── manifest.json         # PWA manifest
│
├── src/                       # Source code
│   ├── main.js               # App initialization
│   ├── router.js             # SPA routing
│   │
│   ├── state/
│   │   └── store.js          # Global state management
│   │
│   ├── services/
│   │   ├── storage.js        # localStorage abstraction
│   │   └── achievements.js   # Achievement logic
│   │
│   ├── utils/
│   │   ├── bitcoin.js        # Bitcoin calculations
│   │   ├── dateUtils.js      # Date formatting
│   │   └── validators.js     # Input validation
│   │
│   ├── pages/
│   │   ├── HomePage.js       # Dashboard
│   │   ├── ChoresPage.js     # Chore management
│   │   ├── LearnPage.js      # Education modules
│   │   ├── WalletPage.js     # Transaction history
│   │   ├── ParentPage.js     # Parent controls
│   │   └── SettingsPage.js   # App settings
│   │
│   ├── components/
│   │   ├── ChoreCard.js
│   │   ├── BalanceDisplay.js
│   │   ├── TransactionList.js
│   │   ├── ProgressBar.js
│   │   ├── Modal.js
│   │   ├── Button.js
│   │   ├── NavBar.js
│   │   └── EducationCard.js
│   │
│   ├── data/
│   │   ├── educationContent.js  # Learning content
│   │   └── achievements.js      # Achievement definitions
│   │
│   └── styles/
│       ├── main.css            # Global styles
│       ├── components.css      # Component styles
│       └── animations.css      # Animations
│
├── tests/                      # Test files
│   ├── unit/                  # Unit tests
│   ├── integration/           # Integration tests
│   └── helpers/               # Test utilities
│
└── docs/                       # Documentation
```

---

## Core Modules

### 1. State Management (`src/state/store.js`)

**Responsibilities:**
- Centralized application state
- Reactive updates via event system
- Automatic localStorage persistence

**Key Concepts:**
- Single source of truth for all app data
- Event-driven: Components subscribe to state changes
- Automatic sync with localStorage on mutations

**API Surface:**
```javascript
// Getters
store.getState()
store.getUser()
store.getChores()
store.getTransactions()

// Setters (emit events)
store.setUser(user)
store.addChore(chore)
store.updateChore(id, updates)
store.completeChore(id)
store.addTransaction(transaction)

// Event subscription
store.subscribe('chore:completed', callback)
store.unsubscribe('chore:completed', callback)

// Persistence
store.save()
store.load()
store.exportData()
store.importData(json)
```

**Event Types:**
- `user:updated`
- `chore:added`, `chore:updated`, `chore:deleted`, `chore:completed`
- `transaction:added`
- `achievement:unlocked`
- `balance:changed`

### 2. Router (`src/router.js`)

**Responsibilities:**
- Hash-based navigation (#/path)
- Route handling and page rendering
- Browser history management

**Why Hash-Based?**
- Works with file:// protocol
- No server configuration needed
- Simpler than History API for this use case

**API:**
```javascript
router.init()                    // Initialize routing
router.navigate('/chores')       // Navigate to route
router.getCurrentRoute()         // Get current route
router.addRoute(path, handler)   // Register route
```

**Routes:**
- `#/` → HomePage
- `#/chores` → ChoresPage
- `#/learn` → LearnPage
- `#/wallet` → WalletPage
- `#/parent` → ParentPage
- `#/settings` → SettingsPage

### 3. Storage Service (`src/services/storage.js`)

**Responsibilities:**
- localStorage abstraction
- JSON serialization/deserialization
- Error handling for storage operations

**Why Abstract localStorage?**
- Centralized error handling
- Easier to mock in tests
- Could swap for IndexedDB or API later
- Consistent serialization

**API:**
```javascript
storage.save(key, data)         // Save with JSON.stringify
storage.load(key)               // Load with JSON.parse
storage.remove(key)             // Delete key
storage.clear()                 // Clear all
storage.exportAll()             // Export as JSON
storage.importAll(json)         // Import from JSON
storage.isAvailable()           // Check support
```

**Storage Keys:**
- `satoshi_user` - User profile
- `satoshi_chores` - Chore array
- `satoshi_transactions` - Transaction array
- `satoshi_achievements` - Achievement progress

---

## Data Flow

### User Action Flow

1. **User clicks "Complete Chore" button**
   ↓
2. **ChoreCard component** handles click event
   ↓
3. **Calls store.completeChore(choreId)**
   ↓
4. **Store updates state:**
   - Marks chore as completed
   - Calculates reward
   - Updates user balance
   - Creates transaction record
   - Checks for achievement unlocks
   ↓
5. **Store emits events:**
   - `chore:completed`
   - `balance:changed`
   - `transaction:added`
   - `achievement:unlocked` (if any)
   ↓
6. **Store saves to localStorage**
   ↓
7. **Subscribed components receive events:**
   - ChoreCard updates UI (shows "completed")
   - BalanceDisplay updates balance
   - TransactionList adds new transaction
   - Achievement notifications appear
   ↓
8. **UI reflects new state**

### Page Navigation Flow

1. **User clicks navigation link**
   ↓
2. **Router intercepts click**
   ↓
3. **Router updates URL hash**
   ↓
4. **hashchange event fires**
   ↓
5. **Router calls route handler**
   ↓
6. **Page component renders**
   ↓
7. **Page subscribes to store events**
   ↓
8. **Page displays current state**

---

## Component Architecture

### Component Pattern

All components follow this pattern:

```javascript
// src/components/ExampleComponent.js

export function ExampleComponent(props, onEvent) {
  // Create DOM element
  const component = document.createElement('div');
  component.className = 'example-component';

  // Render content
  function render(data) {
    component.innerHTML = `
      <h2>${data.title}</h2>
      <p>${data.description}</p>
      <button class="btn-action">Action</button>
    `;

    // Attach event listeners
    component.querySelector('.btn-action')
      .addEventListener('click', handleAction);
  }

  // Event handlers
  function handleAction() {
    onEvent('action', props.id);
  }

  // Initial render
  render(props);

  // Return DOM element
  return component;
}
```

### Page Pattern

Pages are components that:
1. Subscribe to store events
2. Render the full page layout
3. Compose smaller components
4. Handle page-level logic

```javascript
// src/pages/ExamplePage.js

export function ExamplePage() {
  const page = document.createElement('div');
  page.className = 'page example-page';

  function render() {
    const data = store.getExampleData();

    page.innerHTML = `
      <h1>Page Title</h1>
      <div id="component-container"></div>
    `;

    // Render child components
    const container = page.querySelector('#component-container');
    data.forEach(item => {
      const component = ExampleComponent(item, handleEvent);
      container.appendChild(component);
    });
  }

  function handleEvent(type, id) {
    // Handle component events
    store.updateExample(id);
  }

  // Subscribe to store updates
  store.subscribe('example:updated', render);

  // Initial render
  render();

  // Cleanup on navigation away
  page.destroy = () => {
    store.unsubscribe('example:updated', render);
  };

  return page;
}
```

---

## Data Models

### User
```javascript
{
  id: string,              // UUID
  name: string,
  avatar: string,
  balance: number,         // satoshis
  level: number,
  xp: number,
  createdAt: string,       // ISO 8601
  parentMode: boolean,
  parentPin: string | null,
  settings: {
    difficulty: 'easy' | 'medium' | 'hard',
    soundEnabled: boolean,
    notificationsEnabled: boolean,
    theme: 'light' | 'dark'
  }
}
```

### Chore
```javascript
{
  id: string,
  title: string,
  description: string,
  reward: number,          // satoshis
  category: 'household' | 'homework' | 'behavior' | 'other',
  difficulty: 'easy' | 'medium' | 'hard',
  status: 'pending' | 'completed',
  createdAt: string,
  completedAt: string | null,
  recurring: boolean,
  recurrence: 'daily' | 'weekly' | null,
  createdBy: 'parent' | 'self'
}
```

### Transaction
```javascript
{
  id: string,
  type: 'earn' | 'spend' | 'bonus',
  amount: number,
  description: string,
  choreId: string | null,
  timestamp: string,
  balanceAfter: number
}
```

### Achievement
```javascript
{
  id: string,
  title: string,
  description: string,
  icon: string,
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

## Styling Architecture

### CSS Organization

**main.css** - Global styles
- CSS Custom Properties (variables)
- Typography
- Layout utilities
- Responsive breakpoints

**components.css** - Component-specific styles
- BEM-like naming: `.component-name__element--modifier`
- Self-contained component styles
- Reusable utility classes

**animations.css** - Animation definitions
- @keyframes rules
- Animation utilities
- Transition definitions

### Design System

**Colors:**
```css
--bitcoin-orange: #F7931A
--gold: #FFD700
--dark-blue: #1E3A5F
--success: #10B981
--warning: #F59E0B
--error: #EF4444
```

**Typography:**
```css
--font-primary: 'Comic Neue', 'Comic Sans MS', cursive
--text-base: 16px
--text-lg: 20px
--text-xl: 24px
```

**Spacing:**
```css
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 16px
--spacing-lg: 24px
--spacing-xl: 32px
```

---

## Build System

### Vite Configuration

```javascript
// vite.config.js
export default defineConfig({
  root: '.',
  base: './',              // Relative paths for portability
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true        // For debugging
  },
  server: {
    port: 5173,
    open: true             // Auto-open browser
  }
});
```

### Build Output

```
dist/
├── index.html           # Optimized HTML
├── assets/
│   ├── index-[hash].js   # Bundled, minified JS
│   ├── index-[hash].css  # Bundled, minified CSS
│   └── satoshi-icon-[hash].svg
└── manifest.json
```

**Performance:**
- Gzipped: ~20 kB total
- Initial load: < 2 seconds on 3G
- Time to interactive: < 3 seconds

---

## Testing Architecture

### Test Organization

**Unit Tests** (`tests/unit/`)
- Test individual functions and modules
- Mock dependencies (localStorage, DOM)
- Fast execution (< 1 second total)

**Integration Tests** (`tests/integration/`)
- Test complete workflows
- Multiple modules working together
- Realistic scenarios

**Test Utilities** (`tests/helpers/testUtils.js`)
- Mock localStorage
- Mock store
- Fixture data
- Assertion helpers

### Testing Tools

**Vitest Configuration:**
```javascript
// vitest.config.js
export default defineConfig({
  test: {
    globals: true,         // No imports needed
    environment: 'jsdom',  // Browser-like environment
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'tests/']
    }
  }
});
```

### Coverage Goals

- **Overall:** ≥ 80%
- **Critical paths:** 100%
  - Storage operations
  - State mutations
  - Bitcoin calculations
  - Chore completion flow

---

## Security Considerations

### XSS Prevention
- All user input sanitized via `validators.sanitizeHTML()`
- No `innerHTML` with unsanitized data
- CSP-friendly (no inline scripts)

### Data Privacy
- No external network requests
- All data stored locally
- No analytics or tracking
- No third-party scripts

### PIN Security
- Parent PIN hashed before storage
- Simple SHA-256 hash (crypto-js or Web Crypto API)
- Not bank-level security (educational app)

### No Real Bitcoin
- Clearly labeled as simulation
- No wallet integration
- No real transactions
- No seed phrases or real keys

---

## Performance Optimizations

### Bundle Size
- Vanilla JS (no framework overhead)
- Tree-shaking via Vite
- Code splitting for pages
- Lazy loading of education content

### Runtime Performance
- Debounced localStorage writes
- Event delegation for lists
- Virtual scrolling for long lists (if needed)
- RequestAnimationFrame for animations

### Memory Management
- Event listener cleanup on page navigation
- Component destroy methods
- No memory leaks in long sessions

---

## Browser Compatibility

**Minimum Requirements:**
- ES6 module support
- localStorage API
- CSS Custom Properties
- Flexbox/Grid

**Supported Browsers:**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

**Graceful Degradation:**
- Check localStorage availability
- Fallback messages for old browsers
- Progressive enhancement

---

## Future Architecture Considerations

### Potential Enhancements

**Multi-User Support:**
- User switching
- Separate localStorage namespaces
- User authentication (local, no server)

**Backend Integration (Optional):**
- RESTful API adapter
- Keep storage.js interface
- Sync across devices

**PWA Features:**
- Service Worker
- Offline caching
- Install prompt
- Push notifications (local)

**Advanced Features:**
- Data visualization (charts)
- Export to PDF
- Printable reports
- Custom themes

---

## Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Start dev server with hot reload
npm run dev

# Run tests in watch mode
npm run test:watch
```

### Before Committing

```bash
# Run all tests
npm test

# Check test coverage
npm run test:coverage

# Build for production (verify it works)
npm run build

# Preview production build
npm run preview
```

### Code Style

- **Formatting:** 2-space indentation, semicolons
- **Naming:** camelCase for functions/variables, PascalCase for components
- **Comments:** JSDoc for public APIs, inline for complex logic
- **Modules:** One component/service per file
- **Exports:** Named exports preferred

---

## Design Decisions

### Why Vanilla JS Instead of React?

1. **Performance:** Smaller bundle, faster load
2. **Simplicity:** No build complexity, easier to understand
3. **Educational:** Shows how SPAs work fundamentally
4. **Offline:** No CDN dependencies

### Why localStorage Instead of IndexedDB?

1. **Simplicity:** Easier API for small data
2. **Sufficient:** Data size < 5 MB easily
3. **Synchronous:** Simpler to reason about
4. **Universal:** Better browser support

### Why Hash Routing Instead of History API?

1. **File Protocol:** Works with file://
2. **Static Hosting:** No server config needed
3. **Simpler:** No backend routing considerations

### Why Vitest Instead of Jest?

1. **Vite Native:** Same tool for dev and test
2. **Faster:** ESM-native, no transpilation
3. **Modern:** Better DX and error messages

---

## Contributing

When contributing to the architecture:

1. **Follow patterns:** Match existing code style
2. **Test thoroughly:** Add tests for new features
3. **Document changes:** Update this doc if architecture changes
4. **Keep it simple:** Vanilla JS, no unnecessary complexity
5. **Think offline-first:** No external dependencies at runtime

---

## Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Bitcoin Documentation](https://bitcoin.org/en/developer-documentation)

---

**Architecture Version:** 1.0.0
**Last Updated:** October 18, 2025
