# Usage Guide
## Satoshi's Chore Tracker

A comprehensive guide for parents and children on how to use Satoshi's Chore Tracker effectively.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [For Children: How to Use the App](#for-children-how-to-use-the-app)
3. [For Parents: Setting Up and Managing](#for-parents-setting-up-and-managing)
4. [Learning Modules](#learning-modules)
5. [Achievements System](#achievements-system)
6. [Data Management](#data-management)
7. [Tips and Best Practices](#tips-and-best-practices)
8. [Frequently Asked Questions](#frequently-asked-questions)

---

## Getting Started

### First Time Setup

1. **Start the application:**
   ```bash
   npm run dev
   ```
   Open http://localhost:5173 in your browser

2. **Create your profile:**
   - On first launch, you'll be prompted to enter your name
   - Choose an avatar (optional)
   - Your initial balance will be 0 satoshis

3. **Quick tour:**
   - The app will briefly explain the main features
   - You can skip this and explore on your own

### Understanding the Interface

**Navigation Bar (Top):**
- **Home** - Dashboard showing recent activity
- **Chores** - View and manage chores
- **Learn** - Bitcoin education modules
- **Wallet** - Transaction history
- **Settings** - App preferences

**Balance Display:**
- Shows your current satoshi balance
- Displayed in both sats and BTC equivalent
- Updates in real-time when you complete chores

---

## For Children: How to Use the App

### Viewing Your Chores

1. Click **Chores** in the navigation bar
2. You'll see a list of available chores
3. Each chore shows:
   - Title and description
   - How many satoshis you'll earn
   - Category (household, homework, behavior, other)
   - Difficulty level

### Completing a Chore

1. Find the chore you completed
2. Click the **"Complete"** button
3. Enjoy the celebration animation! 🎉
4. Your satoshi balance will increase automatically
5. The chore will be marked as completed
6. A transaction record will be created

### Earning Satoshis

You earn satoshis by:
- **Completing chores** - Primary method
- **Finishing learning modules** - Educational rewards
- **Unlocking achievements** - Bonus rewards
- **Special bonuses** - Occasional parent bonuses

**Example earnings:**
- Easy chores: 10-50 sats
- Medium chores: 50-200 sats
- Hard chores: 200-500 sats
- Learning modules: 10-20 sats each
- Achievements: 50-100 sats

### Checking Your Balance

Your balance is always visible at the top of the screen:
- **In satoshis:** "1,234 sats"
- **In Bitcoin:** "0.00001234 BTC"

**Fun fact:** It takes 100,000,000 satoshis to make 1 Bitcoin!

### Viewing Transaction History

1. Click **Wallet** in the navigation
2. See all your transactions:
   - When you earned sats
   - What you earned them for
   - Your balance after each transaction
3. It's like your personal blockchain!

### Learning About Bitcoin

1. Click **Learn** in the navigation
2. Choose a lesson to start
3. Read the content and examples
4. Take the quiz at the end
5. Earn satoshis for completing lessons!

**Available lessons:**
1. What is Bitcoin? (3 min)
2. What are Satoshis? (2 min)
3. What is a Blockchain? (4 min)
4. Bitcoin Wallets (3 min)
5. Private Keys and Security (4 min)
6. Bitcoin Mining Basics (5 min)

### Unlocking Achievements

Achievements are like badges you earn for special accomplishments:

**How to view achievements:**
1. Go to your profile (click your name)
2. Scroll to achievements section
3. See which ones you've unlocked and which are still locked
4. Progress bars show how close you are to unlocking

**Example achievements:**
- 🎯 First Steps - Complete your first chore
- 💰 Sat Collector - Earn 1,000 satoshis
- 📚 Bitcoin Student - Complete 5 learning modules
- 🔥 Week Warrior - Complete chores 7 days in a row
- 🌟 Perfect Week - Complete all chores in a week
- 🎓 Bitcoin Graduate - Complete all learning modules

### Leveling Up

As you complete chores and learn, you gain XP (experience points):
- Each completed chore = XP
- Harder chores = more XP
- Learning modules = XP
- Your level increases as you gain XP
- Higher levels unlock special features!

**Level progression:**
- Level 1: Start
- Level 5: Unlock custom themes
- Level 10: Unlock advanced stats
- Level 20: Unlock special achievements
- Level 50: Bitcoin Master!

---

## For Parents: Setting Up and Managing

### Accessing Parent Mode

1. Click **Settings** → **Parent Mode**
2. Enter your PIN (set on first access)
3. Default PIN: Create your own 4-digit code
4. Remember this PIN - you'll need it to manage chores!

### Creating Chores

1. Access Parent Mode
2. Click **"Create New Chore"**
3. Fill in the details:
   - **Title:** Short, clear name (e.g., "Take out trash")
   - **Description:** What needs to be done
   - **Reward:** How many satoshis (10-1000 suggested)
   - **Category:** Household/Homework/Behavior/Other
   - **Difficulty:** Easy/Medium/Hard
   - **Recurring:** Optional - daily or weekly repeat

4. Click **"Create Chore"**
5. The chore immediately appears in the child's chore list

**Recommended reward amounts:**

| Task Type | Difficulty | Suggested Sats |
|-----------|-----------|----------------|
| Make bed | Easy | 10-20 |
| Brush teeth | Easy | 5-10 |
| Clean room | Medium | 50-100 |
| Homework (30 min) | Medium | 100-150 |
| Wash dishes | Medium | 75-125 |
| Mow lawn | Hard | 300-500 |
| Straight A's report card | Hard | 1000-2000 |
| Good behavior all day | Easy | 25-50 |

**Converting to real-world rewards (optional):**
- You can assign real-world value to satoshis
- Example: 1000 sats = $1 of allowance
- Example: 10,000 sats = choosing family movie
- Example: 50,000 sats = special outing

### Editing or Deleting Chores

1. Access Parent Mode
2. Click the chore you want to modify
3. Options:
   - **Edit:** Change any detail
   - **Delete:** Remove permanently
   - **Pause:** Temporarily hide from child

### Monitoring Progress

**View child's statistics:**
- Total satoshis earned
- Chores completed (total and by category)
- Current level and XP
- Learning modules completed
- Achievement progress
- Streak days (consecutive days with chore completion)

**Weekly/Monthly reports:**
- See trends over time
- Identify most/least completed chores
- Track learning engagement

### Setting Up Recurring Chores

Perfect for daily or weekly tasks:

1. When creating/editing a chore, check **"Recurring"**
2. Choose frequency:
   - **Daily:** Resets every day at midnight
   - **Weekly:** Resets every Monday
3. The chore will automatically become available again after reset

**Examples of recurring chores:**
- Make bed (daily)
- Brush teeth 2x (daily)
- Clean room (weekly)
- Practice instrument (daily)
- Take out trash (weekly)

### Managing Multiple Children (Future Feature)

Currently, the app supports one profile. For multiple children:

**Workaround:**
- Create separate browser profiles (one per child)
- Each profile has independent data in localStorage
- Or use different devices for each child

---

## Learning Modules

### How Learning Works

Each module contains:
1. **Introduction:** Kid-friendly explanation
2. **Real-world analogy:** Relatable comparison
3. **Key points:** Main concepts to remember
4. **Quiz:** 3-5 questions to test understanding
5. **Reward:** Satoshis for completion

### Recommended Learning Path

**For ages 8-10:**
1. What is Bitcoin?
2. What are Satoshis?
3. Bitcoin Wallets
4. (Take a break, practice with chores)
5. What is a Blockchain?
6. Private Keys and Security

**For ages 11-14:**
- Go in order, but can move faster
- Encourage note-taking
- Discuss concepts as a family

### Educational Goals

By completing all modules, children will understand:
- ✅ Bitcoin is digital money
- ✅ Satoshis are the smallest unit
- ✅ Blockchain is a secure digital ledger
- ✅ Wallets store your Bitcoin
- ✅ Private keys must be kept secret
- ✅ Mining secures the network

### Reinforcing Learning

**Discussion questions for parents:**
- "How is Bitcoin different from the money in my piggy bank?"
- "Why do you think they named satoshis after Satoshi?"
- "Can you explain blockchain to Grandma?"
- "What would happen if someone got your private key?"

---

## Achievements System

### Achievement Categories

**Completion-based:**
- First Steps (1 chore)
- Chore Champion (50 chores)
- Century Club (100 chores)

**Earnings-based:**
- Sat Collector (1,000 sats)
- Bitcoin Thousandaire (10,000 sats)
- Satoshi Saver (100,000 sats)

**Learning-based:**
- Bitcoin Student (5 lessons)
- Bitcoin Scholar (all lessons)
- Quiz Master (100% on all quizzes)

**Consistency-based:**
- 3-Day Streak
- Week Warrior (7-day streak)
- Month Master (30-day streak)

**Special:**
- Perfect Week (all chores in a week)
- Early Bird (complete chore before 9am)
- Night Owl (complete chore after 8pm)

### Viewing Progress

Each achievement shows:
- Icon and title
- Description of how to earn
- Progress bar (if in progress)
- Unlock date (if already unlocked)
- Reward amount

---

## Data Management

### Exporting Data

Backup your data regularly:

1. Go to **Settings** → **Data Management**
2. Click **"Export Data"**
3. A JSON file will download
4. Save this file somewhere safe
5. Recommended: Weekly backups

**Export includes:**
- User profile and settings
- All chores (completed and pending)
- Transaction history
- Achievement progress
- Learning module completion

### Importing Data

Restore from a backup:

1. Go to **Settings** → **Data Management**
2. Click **"Import Data"**
3. Select your backup JSON file
4. Confirm the import
5. Page will reload with restored data

⚠️ **Warning:** Importing will overwrite current data!

### Resetting the App

Start fresh:

1. Access Parent Mode (PIN required)
2. Go to **Settings** → **Data Management**
3. Click **"Reset All Data"**
4. Confirm (requires entering PIN again)
5. All data will be deleted

**This will erase:**
- All chores
- All transactions
- All progress
- User profile
- Settings

**This will NOT erase:**
- Exported backup files (those are safe)

---

## Tips and Best Practices

### For Parents

**1. Start Small**
- Begin with 3-5 simple chores
- Low rewards at first (10-50 sats)
- Build up as child gets comfortable

**2. Be Consistent**
- Check completed chores daily
- Praise effort, not just completion
- Create predictable routines

**3. Connect to Real World**
- Explain: "This is practice for real money"
- Discuss saving vs. spending
- Talk about Bitcoin in the news

**4. Use Recurring Chores**
- Daily tasks build good habits
- Reduces your management burden
- Creates routine and expectation

**5. Celebrate Milestones**
- Make a big deal of achievements
- Celebrate level-ups
- Real-world rewards for big satoshi goals

**6. Educational Focus**
- Encourage completing learning modules
- Discuss lessons together
- Ask them to teach you what they learned

**7. Fair Rewards**
- Harder chores = more sats
- Age-appropriate difficulty
- Adjust rewards if too easy/hard

**8. Backup Regularly**
- Export data weekly
- Save to cloud storage
- Keep multiple backup copies

### For Children

**1. Check Daily**
- Look for new chores every day
- Don't let easy ones pile up
- Ask parent if chore list is empty

**2. Complete Learning Modules**
- They're fun AND earn sats
- Helps you understand money
- Makes you smarter about technology

**3. Track Your Goals**
- Set a satoshi target (e.g., 5,000 sats)
- Work toward specific achievements
- Celebrate when you reach milestones

**4. Build Streaks**
- Do at least one chore per day
- Streaks unlock special achievements
- Makes earning automatic

**5. Ask Questions**
- Don't understand blockchain? Ask!
- Confused about a concept? Learn!
- Bitcoin is complex - questions are good

---

## Frequently Asked Questions

### General

**Q: Is this real Bitcoin?**
A: No! This is a simulation. No real money is involved. It's a safe way to learn about Bitcoin without any financial risk.

**Q: Can my child lose money?**
A: No, because no real money is used. Satoshi balances can't go negative in the app.

**Q: Does this require internet?**
A: No! After initial setup, the app works completely offline. All data is stored on your device.

**Q: Is my data private?**
A: Yes! All data stays on your device. Nothing is sent to external servers. No tracking, no data collection.

**Q: What age is this appropriate for?**
A: Designed for ages 8-14, but can work for younger with parent help or older teens interested in Bitcoin.

### Technical

**Q: Where is data stored?**
A: In your browser's localStorage. It persists across sessions but is specific to each browser/device.

**Q: What if I clear my browser data?**
A: You'll lose all app data unless you've exported a backup. Always keep backups!

**Q: Can multiple kids use this?**
A: Currently, one profile per browser. Use different browser profiles or devices for multiple children.

**Q: Does this work on mobile?**
A: Yes! Fully responsive design works on phones and tablets.

**Q: Which browsers are supported?**
A: Chrome, Firefox, Safari, Edge (latest versions).

### Usage

**Q: How often should I create chores?**
A: Start with 5-10 recurring daily chores. Add more as needed.

**Q: What if my child completes a chore but doesn't mark it?**
A: Parents can manually complete chores in Parent Mode.

**Q: Can I edit the satoshi amount after a chore is completed?**
A: No, transactions are immutable (just like real Bitcoin!). This teaches permanence.

**Q: How do I change the PIN?**
A: Settings → Parent Mode → Change PIN

**Q: What if I forget my PIN?**
A: Use the forgot PIN feature (requires exporting data, resetting app, and importing data without PIN).

### Educational

**Q: Will this teach my child about investing?**
A: It teaches basic concepts. For investing education, supplement with other age-appropriate resources.

**Q: Is Bitcoin safe for kids to learn about?**
A: Yes! Understanding technology and digital money is increasingly important. This app teaches concepts safely.

**Q: Should we connect this to real allowance?**
A: Optional! Some parents exchange sats for real money (e.g., 1000 sats = $1). Others keep it purely educational.

**Q: What if my child asks about buying real Bitcoin?**
A: Great learning opportunity! Discuss with age-appropriate context about investments, risks, and saving.

---

## Getting Help

**Need more help?**
- Check [INSTALLATION.md](./INSTALLATION.md) for setup issues
- Read [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details
- Review [TESTING.md](./TESTING.md) for testing information
- Open a GitHub issue for bugs or feature requests

---

**Happy learning and earning satoshis! 🪙✨**
