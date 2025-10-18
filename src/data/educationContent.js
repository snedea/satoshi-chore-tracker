/**
 * Educational content modules for Bitcoin learning
 */

export const lessons = [
  {
    id: 'lesson-1',
    title: 'What is Bitcoin?',
    level: 1,
    duration: '3 min',
    icon: '₿',
    content: {
      intro: 'Bitcoin is like digital money that lives on the internet!',
      analogy: 'Just like you have coins in your piggy bank, Bitcoin is money you can save on your computer or phone.',
      keyPoints: [
        'Bitcoin is digital money that works on the internet',
        'You can send it anywhere in the world instantly',
        'It\'s not controlled by any country or bank',
        'It\'s secured by computers all over the world'
      ],
      quiz: [
        {
          question: 'What is Bitcoin?',
          options: ['Digital money', 'A video game', 'A toy', 'A bank'],
          correct: 0,
          explanation: 'Bitcoin is digital money that exists only on computers and the internet!'
        }
      ]
    },
    reward: 10
  },
  {
    id: 'lesson-2',
    title: 'What are Satoshis?',
    level: 1,
    duration: '2 min',
    icon: '⚡',
    content: {
      intro: 'Satoshis (or "sats") are tiny pieces of Bitcoin!',
      analogy: 'If Bitcoin is a pizza, satoshis are tiny crumbs. It takes 100 million crumbs to make one whole pizza!',
      keyPoints: [
        '1 Bitcoin = 100,000,000 satoshis',
        'Satoshis are named after Bitcoin\'s mysterious creator, Satoshi Nakamoto',
        'You can earn sats by completing chores in this app!',
        'Even small amounts of sats can add up over time'
      ],
      quiz: [
        {
          question: 'How many satoshis are in 1 Bitcoin?',
          options: ['100', '1,000', '1,000,000', '100,000,000'],
          correct: 3,
          explanation: 'One Bitcoin equals 100,000,000 satoshis - that\'s a lot of tiny pieces!'
        }
      ]
    },
    reward: 15
  },
  {
    id: 'lesson-3',
    title: 'What is a Blockchain?',
    level: 2,
    duration: '4 min',
    icon: '⛓️',
    content: {
      intro: 'A blockchain is like a digital record book that everyone can see!',
      analogy: 'Imagine a notebook where every page records who gave money to whom. Each page is a "block" and they\'re all connected in a "chain". Once you write on a page, you can\'t erase it!',
      keyPoints: [
        'A blockchain records all Bitcoin transactions',
        'Each block contains a list of transactions',
        'Blocks are connected in order, forming a chain',
        'Once recorded, transactions can\'t be changed or deleted',
        'Everyone can see the blockchain, making it transparent'
      ],
      quiz: [
        {
          question: 'What does a blockchain record?',
          options: ['Video games', 'Bitcoin transactions', 'Phone numbers', 'Homework'],
          correct: 1,
          explanation: 'The blockchain records all Bitcoin transactions so everyone can see the history!'
        },
        {
          question: 'Can you erase or change a transaction once it\'s on the blockchain?',
          options: ['Yes, anytime', 'Only with permission', 'No, it\'s permanent', 'Only once a day'],
          correct: 2,
          explanation: 'Once a transaction is recorded on the blockchain, it\'s permanent and can\'t be changed!'
        }
      ]
    },
    reward: 20
  },
  {
    id: 'lesson-4',
    title: 'Bitcoin Wallets',
    level: 2,
    duration: '3 min',
    icon: '👛',
    content: {
      intro: 'A Bitcoin wallet is like a digital piggy bank for your satoshis!',
      analogy: 'Just like you keep your money in a wallet or piggy bank, you keep Bitcoin in a digital wallet on your computer or phone.',
      keyPoints: [
        'A wallet stores your Bitcoin securely',
        'You need a wallet to send and receive Bitcoin',
        'Your wallet has a special address (like an email address)',
        'You can have multiple wallets',
        'Keep your wallet safe - if you lose it, you lose your Bitcoin!'
      ],
      quiz: [
        {
          question: 'What is a Bitcoin wallet used for?',
          options: ['Playing games', 'Storing Bitcoin', 'Taking photos', 'Making calls'],
          correct: 1,
          explanation: 'A Bitcoin wallet is used to store, send, and receive Bitcoin safely!'
        }
      ]
    },
    reward: 15
  },
  {
    id: 'lesson-5',
    title: 'Private Keys and Security',
    level: 3,
    duration: '4 min',
    icon: '🔐',
    content: {
      intro: 'A private key is like a super secret password that protects your Bitcoin!',
      analogy: 'Think of it like the key to your house. If someone else gets your key, they can get into your house. Same with Bitcoin - if someone gets your private key, they can take your Bitcoin!',
      keyPoints: [
        'A private key is a secret code that proves you own Bitcoin',
        'Never share your private key with anyone!',
        'If you lose your private key, you lose access to your Bitcoin forever',
        'Your public address is like your mailbox - others can send you Bitcoin there',
        'Your private key is what lets you open the mailbox and use the Bitcoin'
      ],
      quiz: [
        {
          question: 'Should you share your private key with others?',
          options: ['Yes, with friends', 'Yes, with family', 'No, never!', 'Only on weekends'],
          correct: 2,
          explanation: 'Never share your private key! It\'s the secret that keeps your Bitcoin safe!'
        },
        {
          question: 'What happens if you lose your private key?',
          options: ['Nothing bad', 'You can ask for a new one', 'You lose your Bitcoin forever', 'It appears again later'],
          correct: 2,
          explanation: 'If you lose your private key, you lose access to your Bitcoin forever. That\'s why it\'s so important to keep it safe!'
        }
      ]
    },
    reward: 25
  },
  {
    id: 'lesson-6',
    title: 'Bitcoin Mining Basics',
    level: 3,
    duration: '5 min',
    icon: '⛏️',
    content: {
      intro: 'Bitcoin mining is how new bitcoins are created and transactions are verified!',
      analogy: 'Think of miners like puzzle solvers. They use powerful computers to solve really hard math puzzles. When they solve a puzzle, they get to add a new block to the blockchain and earn some Bitcoin as a reward!',
      keyPoints: [
        'Miners use computers to solve complex math problems',
        'When they solve a problem, they add a new block to the blockchain',
        'Miners get rewarded with new Bitcoin for their work',
        'Mining also confirms and secures all Bitcoin transactions',
        'It takes a lot of computer power and electricity to mine Bitcoin'
      ],
      quiz: [
        {
          question: 'What do Bitcoin miners do?',
          options: ['Dig holes', 'Solve math puzzles', 'Plant trees', 'Build houses'],
          correct: 1,
          explanation: 'Bitcoin miners use computers to solve complex math puzzles and add new blocks to the blockchain!'
        },
        {
          question: 'What do miners get as a reward?',
          options: ['Gold coins', 'New Bitcoin', 'Video games', 'Pizza'],
          correct: 1,
          explanation: 'Miners are rewarded with new Bitcoin for their work securing the network!'
        }
      ]
    },
    reward: 30
  }
];

/**
 * Get lesson by ID
 * @param {string} lessonId - Lesson ID
 * @returns {object|null} Lesson object or null if not found
 */
export function getLessonById(lessonId) {
  return lessons.find(lesson => lesson.id === lessonId) || null;
}

/**
 * Get lessons by level
 * @param {number} level - Difficulty level
 * @returns {array} Array of lessons
 */
export function getLessonsByLevel(level) {
  return lessons.filter(lesson => lesson.level === level);
}

/**
 * Get total reward for all lessons
 * @returns {number} Total satoshis
 */
export function getTotalLessonRewards() {
  return lessons.reduce((sum, lesson) => sum + lesson.reward, 0);
}
