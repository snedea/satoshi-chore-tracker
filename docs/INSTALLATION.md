# Installation Guide
## Satoshi's Chore Tracker

This guide will walk you through installing and setting up Satoshi's Chore Tracker on your local machine.

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

1. **Node.js** (version 18.0.0 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`
   - Should output v18.0.0 or higher

2. **npm** (usually comes with Node.js)
   - Verify installation: `npm --version`
   - Should output 9.0.0 or higher

3. **Git** (for cloning the repository)
   - Download from: https://git-scm.com/
   - Verify installation: `git --version`

### Supported Operating Systems

- macOS 10.15 (Catalina) or higher
- Windows 10/11
- Linux (Ubuntu 20.04+, Debian 11+, Fedora 35+)

### Supported Browsers

- Google Chrome/Chromium (version 90+)
- Mozilla Firefox (version 88+)
- Safari (version 14+)
- Microsoft Edge (version 90+)

---

## Step-by-Step Installation

### Step 1: Clone the Repository

```bash
# Navigate to your desired directory
cd ~/Projects

# Clone the repository
git clone https://github.com/snedea/satoshi-chore-tracker.git

# Navigate into the project directory
cd satoshi-chore-tracker
```

### Step 2: Install Dependencies

```bash
# Install all required npm packages
npm install
```

This will install:
- Vite (build tool)
- Vitest (testing framework)
- jsdom (test environment)
- Coverage tools
- All other required dependencies

**Expected output:**
```
added 180 packages, and audited 181 packages in 15s

45 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

**Installation time:** Typically 30-60 seconds depending on your internet connection.

### Step 3: Verify Installation

```bash
# Check that the project structure is correct
ls -la

# You should see:
# - package.json
# - vite.config.js
# - vitest.config.js
# - src/ directory
# - tests/ directory
# - node_modules/ directory
```

### Step 4: Run Tests (Optional but Recommended)

```bash
# Run the test suite to verify everything works
npm test
```

**Expected output:**
```
✓ tests/unit/validators.test.js (21)
✓ tests/unit/bitcoin.test.js (8)
✓ tests/unit/storage.test.js (7)
...
Test Files  8 passed (8)
     Tests  60 passed (60)
```

### Step 5: Start Development Server

```bash
# Start the Vite development server
npm run dev
```

**Expected output:**
```
VITE v5.0.0  ready in 245 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h to show help
```

### Step 6: Open in Browser

1. Open your web browser
2. Navigate to: `http://localhost:5173`
3. You should see the Satoshi's Chore Tracker home page
4. The app will create a default user profile on first load

---

## Troubleshooting Common Issues

### Issue 1: "npm: command not found"

**Problem:** Node.js/npm not installed or not in PATH

**Solution:**
1. Download and install Node.js from https://nodejs.org/
2. Restart your terminal/command prompt
3. Verify with `node --version`

### Issue 2: Port 5173 Already in Use

**Problem:** Another application is using port 5173

**Solution:**
```bash
# Option A: Stop the other application using port 5173

# Option B: Use a different port
npm run dev -- --port 3000
# Then open http://localhost:3000
```

### Issue 3: Permission Errors During npm install

**Problem:** Insufficient permissions to install packages

**Solution (macOS/Linux):**
```bash
# Don't use sudo! Instead, fix npm permissions:
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Then try again:
npm install
```

**Solution (Windows):**
- Run Command Prompt or PowerShell as Administrator
- Navigate to project directory
- Run `npm install`

### Issue 4: Test Failures

**Problem:** Some tests fail when running `npm test`

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm test
```

### Issue 5: "Cannot find module" Errors

**Problem:** Dependencies not properly installed

**Solution:**
```bash
# Reinstall dependencies
npm ci  # Clean install using package-lock.json
```

### Issue 6: Browser Shows Blank Page

**Problem:** JavaScript not loading or errors in console

**Solution:**
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Common fixes:
   - Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
   - Clear browser cache
   - Try incognito/private mode
   - Ensure dev server is running (`npm run dev`)

### Issue 7: localStorage Not Working

**Problem:** Data doesn't persist across page reloads

**Solution:**
1. Check browser settings - localStorage might be disabled
2. Ensure you're not in private/incognito mode (localStorage is limited)
3. Check browser storage quota hasn't been exceeded
4. Try different browser

---

## Advanced Installation Options

### Option 1: Install Globally (Not Recommended)

If you want to run the app from anywhere:

```bash
# Not recommended for this project, but possible:
npm install -g .
```

### Option 2: Docker Installation

If you prefer Docker:

```dockerfile
# Create a Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
```

```bash
# Build and run
docker build -t satoshi-chore-tracker .
docker run -p 5173:5173 satoshi-chore-tracker
```

### Option 3: Production Build Installation

For hosting on a web server:

```bash
# Build for production
npm run build

# Output will be in dist/ directory
# Copy dist/ to your web server

# Or preview locally:
npm run preview
# Open http://localhost:4173
```

---

## Post-Installation Configuration

### 1. Customize Settings (Optional)

Edit configuration files if needed:

**vite.config.js** - Build and dev server settings
```javascript
export default defineConfig({
  server: {
    port: 5173,  // Change port here
    open: true   // Auto-open browser
  }
});
```

### 2. Set Up for Development

```bash
# Run tests in watch mode while coding
npm run test:watch

# In another terminal, run dev server
npm run dev
```

### 3. Enable Coverage Reports

```bash
# Generate test coverage
npm run test:coverage

# Open coverage report
# Open coverage/index.html in browser
```

---

## Verifying Successful Installation

Run through this checklist:

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm 9+ installed (`npm --version`)
- [ ] Repository cloned successfully
- [ ] Dependencies installed (`node_modules/` exists)
- [ ] Tests pass (`npm test` succeeds)
- [ ] Dev server starts (`npm run dev` runs without errors)
- [ ] App loads in browser at http://localhost:5173
- [ ] Can create a chore and complete it
- [ ] Data persists after page reload
- [ ] No errors in browser console

---

## Next Steps

After successful installation:

1. Read the [USAGE.md](./USAGE.md) guide to learn how to use the app
2. Review [ARCHITECTURE.md](./ARCHITECTURE.md) if you want to understand the code structure
3. Check [TESTING.md](./TESTING.md) for testing guidelines
4. Start using the app with your children!

---

## Getting Help

If you encounter issues not covered in this guide:

1. Check existing GitHub issues: https://github.com/snedea/satoshi-chore-tracker/issues
2. Create a new issue with:
   - Your operating system and version
   - Node.js version (`node --version`)
   - npm version (`npm --version`)
   - Complete error message
   - Steps to reproduce the problem

---

## Uninstallation

To remove Satoshi's Chore Tracker:

```bash
# Navigate to project directory
cd satoshi-chore-tracker

# Remove installed packages
rm -rf node_modules

# Remove the entire project
cd ..
rm -rf satoshi-chore-tracker
```

**Note:** This will delete all locally stored data. Export your data first if you want to keep it!

---

**Installation complete! Happy learning about Bitcoin! 🚀**
