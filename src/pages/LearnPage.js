/**
 * Learn page - Bitcoin education modules
 */

import { store } from '../state/store.js';
import { lessons } from '../data/educationContent.js';
import { EducationCard } from '../components/EducationCard.js';
import { Modal } from '../components/Modal.js';
import { Button } from '../components/Button.js';
import { formatSats } from '../utils/bitcoin.js';

/**
 * Render learn page
 */
export function LearnPage() {
  const container = document.getElementById('app');
  container.innerHTML = '';

  const page = document.createElement('div');
  page.className = 'page learn-page';

  // Header section
  const header = document.createElement('div');
  header.className = 'page-header';

  const title = document.createElement('h1');
  title.className = 'page-title';
  title.textContent = 'Learn About Bitcoin 📚';

  const subtitle = document.createElement('p');
  subtitle.className = 'page-subtitle';
  subtitle.textContent = 'Complete lessons to earn satoshis and expand your Bitcoin knowledge!';

  header.appendChild(title);
  header.appendChild(subtitle);
  page.appendChild(header);

  // Progress section
  const completedLessons = store.getCompletedLessons();
  const progressSection = document.createElement('div');
  progressSection.className = 'learn-progress';

  progressSection.innerHTML = `
    <div class="progress-stat">
      <span class="stat-value">${completedLessons.length}</span>
      <span class="stat-label">/ ${lessons.length} Lessons</span>
    </div>
  `;

  page.appendChild(progressSection);

  // Lessons list
  const lessonsContainer = document.createElement('div');
  lessonsContainer.className = 'lessons-container';

  lessons.forEach(lesson => {
    const isCompleted = completedLessons.includes(lesson.id);

    const lessonCard = EducationCard(lesson, isCompleted, (lesson) => {
      showLessonModal(lesson, isCompleted);
    });

    lessonsContainer.appendChild(lessonCard);
  });

  page.appendChild(lessonsContainer);
  container.appendChild(page);
}

/**
 * Show lesson modal with content
 * @param {object} lesson - Lesson object
 * @param {boolean} isCompleted - Whether lesson is already completed
 */
function showLessonModal(lesson, isCompleted) {
  const modalContent = document.createElement('div');
  modalContent.className = 'lesson-modal';

  // Lesson intro
  const intro = document.createElement('div');
  intro.className = 'lesson-intro';
  intro.innerHTML = `
    <p class="lesson-intro-text">${lesson.content.intro}</p>
  `;

  // Analogy
  const analogy = document.createElement('div');
  analogy.className = 'lesson-analogy';
  analogy.innerHTML = `
    <h3>💡 Think of it this way:</h3>
    <p>${lesson.content.analogy}</p>
  `;

  // Key points
  const keyPoints = document.createElement('div');
  keyPoints.className = 'lesson-points';
  keyPoints.innerHTML = `<h3>🔑 Key Points:</h3>`;

  const pointsList = document.createElement('ul');
  lesson.content.keyPoints.forEach(point => {
    const li = document.createElement('li');
    li.textContent = point;
    pointsList.appendChild(li);
  });

  keyPoints.appendChild(pointsList);

  modalContent.appendChild(intro);
  modalContent.appendChild(analogy);
  modalContent.appendChild(keyPoints);

  // Quiz section
  if (lesson.content.quiz && lesson.content.quiz.length > 0) {
    const quizSection = document.createElement('div');
    quizSection.className = 'lesson-quiz';
    quizSection.innerHTML = `<h3>🎯 Quick Quiz:</h3>`;

    lesson.content.quiz.forEach((question, index) => {
      const quizItem = createQuizQuestion(question, index, lesson.id, isCompleted);
      quizSection.appendChild(quizItem);
    });

    modalContent.appendChild(quizSection);
  }

  // Reward section
  if (!isCompleted) {
    const rewardSection = document.createElement('div');
    rewardSection.className = 'lesson-reward';
    rewardSection.innerHTML = `
      <p>Complete this lesson to earn <strong>${formatSats(lesson.reward)}</strong>!</p>
    `;
    modalContent.appendChild(rewardSection);
  } else {
    const completedBadge = document.createElement('div');
    completedBadge.className = 'lesson-completed-badge';
    completedBadge.innerHTML = `<span>✓</span> Lesson Completed!`;
    modalContent.appendChild(completedBadge);
  }

  Modal(lesson.title, modalContent, {
    onClose: () => {}
  });
}

/**
 * Create quiz question element
 * @param {object} question - Question object
 * @param {number} index - Question index
 * @param {string} lessonId - Lesson ID
 * @param {boolean} isCompleted - Whether lesson is completed
 * @returns {HTMLElement} Quiz question element
 */
function createQuizQuestion(question, index, lessonId, isCompleted) {
  const quizItem = document.createElement('div');
  quizItem.className = 'quiz-question';
  quizItem.dataset.questionIndex = index;

  const questionText = document.createElement('p');
  questionText.className = 'quiz-question-text';
  questionText.textContent = `${index + 1}. ${question.question}`;

  quizItem.appendChild(questionText);

  const optionsContainer = document.createElement('div');
  optionsContainer.className = 'quiz-options';

  question.options.forEach((option, optionIndex) => {
    const optionBtn = document.createElement('button');
    optionBtn.className = 'quiz-option';
    optionBtn.textContent = option;
    optionBtn.dataset.index = optionIndex;

    if (isCompleted) {
      // Show correct answer if already completed
      if (optionIndex === question.correct) {
        optionBtn.classList.add('quiz-correct');
      }
      optionBtn.disabled = true;
    } else {
      optionBtn.addEventListener('click', () => {
        handleQuizAnswer(optionBtn, question, lessonId);
      });
    }

    optionsContainer.appendChild(optionBtn);
  });

  quizItem.appendChild(optionsContainer);

  const feedbackDiv = document.createElement('div');
  feedbackDiv.className = 'quiz-feedback';
  feedbackDiv.style.display = 'none';
  quizItem.appendChild(feedbackDiv);

  return quizItem;
}

/**
 * Handle quiz answer selection
 * @param {HTMLElement} button - Selected option button
 * @param {object} question - Question object
 * @param {string} lessonId - Lesson ID
 */
function handleQuizAnswer(button, question, lessonId) {
  const selectedIndex = parseInt(button.dataset.index);
  const isCorrect = selectedIndex === question.correct;

  // Disable all options
  const options = button.parentElement.querySelectorAll('.quiz-option');
  options.forEach(opt => opt.disabled = true);

  // Mark correct/incorrect
  if (isCorrect) {
    button.classList.add('quiz-correct');
  } else {
    button.classList.add('quiz-incorrect');
    // Highlight correct answer
    options[question.correct].classList.add('quiz-correct');
  }

  // Show explanation
  const feedbackDiv = button.parentElement.nextElementSibling;
  feedbackDiv.style.display = 'block';
  feedbackDiv.innerHTML = `
    <p class="quiz-explanation">
      ${isCorrect ? '✓ Correct!' : '✗ Not quite.'} ${question.explanation}
    </p>
  `;

  // Check if all questions in lesson are answered
  setTimeout(() => {
    checkLessonCompletion(lessonId);
  }, 1000);
}

/**
 * Check if lesson is complete and award satoshis
 * @param {string} lessonId - Lesson ID
 */
function checkLessonCompletion(lessonId) {
  const completedLessons = store.getCompletedLessons();

  if (completedLessons.includes(lessonId)) {
    return; // Already completed
  }

  const quizQuestions = document.querySelectorAll('.quiz-question');
  const allAnswered = Array.from(quizQuestions).every(q => {
    return q.querySelector('.quiz-correct') !== null;
  });

  if (allAnswered) {
    // Mark lesson as completed
    store.completeLesson(lessonId);

    // Award satoshis
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson) {
      const transaction = {
        type: 'bonus',
        amount: lesson.reward,
        description: `Completed lesson: ${lesson.title}`,
        choreId: null
      };

      store.addTransaction(transaction);

      const user = store.getUser();
      user.balance += lesson.reward;
      store.setUser(user);

      // Show celebration
      showLessonCelebration(lesson);
    }
  }
}

/**
 * Show lesson completion celebration
 * @param {object} lesson - Completed lesson
 */
function showLessonCelebration(lesson) {
  const celebration = document.createElement('div');
  celebration.className = 'celebration-overlay';
  celebration.innerHTML = `
    <div class="celebration-content">
      <div class="celebration-emoji">🎓</div>
      <div class="celebration-text">Lesson Complete!</div>
      <div class="celebration-subtext">You earned ${formatSats(lesson.reward)}!</div>
    </div>
  `;

  document.body.appendChild(celebration);

  setTimeout(() => {
    celebration.remove();
    // Close modal and refresh
    document.querySelector('.modal-overlay')?.remove();
    LearnPage();
  }, 2000);
}
