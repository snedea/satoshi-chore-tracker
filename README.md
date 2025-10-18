# Satoshi's Chore Tracker

An educational web application that teaches children about Bitcoin, blockchain, and cryptography through gamified chore tracking. Kids complete chores to earn simulated satoshis while learning fundamental cryptocurrency concepts in an age-appropriate, fun, and safe environment.

## Features

### For Children
- **Earn Satoshis**: Complete chores to earn simulated Bitcoin (satoshis)
- **Learn Bitcoin**: Interactive lessons about Bitcoin, blockchain, and cryptography
- **Level Up**: Gain XP and level up as you complete more chores
- **Achievements**: Unlock badges for milestones and accomplishments
- **Transaction History**: View your earning history like a real Bitcoin wallet

### For Parents
- **Chore Management**: Create and manage chores with custom rewards
- **Progress Tracking**: Monitor your child's learning and completion
- **Safe Environment**: No real money involved - 100% educational simulation
- **Data Export**: Backup and restore data as needed
- **PIN Protection**: Secure parent mode with PIN access

## Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **Build Tool**: Vite
- **Testing**: Vitest with jsdom
- **Styling**: Custom CSS with CSS Variables
- **Data Storage**: localStorage (client-side only)
- **PWA**: Progressive Web App capabilities

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd satoshi-chore-tracker

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

Open your browser to `http://localhost:5173`

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Project Structure

```
satoshi-chore-tracker/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   ├── services/       # Business logic services
│   ├── state/          # State management
│   ├── utils/          # Utility functions
│   ├── data/           # Static data (lessons, achievements)
│   ├── styles/         # CSS files
│   └── main.js         # Application entry point
├── tests/              # Test files
│   ├── unit/          # Unit tests
│   ├── integration/   # Integration tests
│   └── helpers/       # Test utilities
└── index.html         # HTML entry point
```

## Key Concepts

### Satoshis
The smallest unit of Bitcoin. 100,000,000 satoshis = 1 Bitcoin. In this app, children earn satoshis by completing chores.

### Blockchain
A digital ledger that records all transactions. Children can view their "personal blockchain" - a history of all their completed chores and earned satoshis.

### Educational Content
6 progressive lessons covering:
1. What is Bitcoin?
2. What are Satoshis?
3. What is a Blockchain?
4. Bitcoin Wallets
5. Private Keys and Security
6. Bitcoin Mining Basics

## Safety & Privacy

⚠️ **IMPORTANT**: This application uses **simulated Bitcoin only**. No real cryptocurrency is involved.

- All data is stored locally on the device
- No data collection or tracking
- No external network requests
- No real money or cryptocurrency
- Safe for children to use unsupervised

## Educational Goals

This app teaches children:
- Basic Bitcoin and cryptocurrency concepts
- Blockchain technology fundamentals
- Digital security and cryptography basics
- Financial literacy (earning, saving, value)
- Work-reward relationships
- Goal setting and achievement

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Modern mobile browsers

## Contributing

Contributions are welcome! Please ensure:
- All tests pass (`npm test`)
- Code follows existing style patterns
- New features include tests
- Documentation is updated

## License

MIT License - See LICENSE file for details

## Acknowledgments

- Inspired by the need for age-appropriate Bitcoin education
- Built with guidance from educational psychology research
- Designed with child-focused UX principles

🤖 **Built autonomously by [Claude Code](https://claude.com/claude-code) Context Foundry**

## Support

For questions or issues, please open a GitHub issue.

---

**Made with ❤️ for the next generation of Bitcoin learners**
