/**
 * Education card component for learning modules
 */

import { formatSats } from '../utils/bitcoin.js';

/**
 * Create an education card for a lesson
 * @param {object} lesson - Lesson object
 * @param {boolean} completed - Whether lesson is completed
 * @param {function} onClick - Click handler
 * @returns {HTMLElement} Education card element
 */
export function EducationCard(lesson, completed, onClick) {
  const card = document.createElement('div');
  card.className = `education-card ${completed ? 'education-completed' : ''}`;

  const icon = document.createElement('div');
  icon.className = 'education-icon';
  icon.textContent = lesson.icon;

  const content = document.createElement('div');
  content.className = 'education-content';

  const header = document.createElement('div');
  header.className = 'education-header';

  const title = document.createElement('h3');
  title.className = 'education-title';
  title.textContent = lesson.title;

  const levelBadge = document.createElement('span');
  levelBadge.className = `education-level level-${lesson.level}`;
  levelBadge.textContent = `Level ${lesson.level}`;

  header.appendChild(title);
  header.appendChild(levelBadge);

  const meta = document.createElement('div');
  meta.className = 'education-meta';

  const duration = document.createElement('span');
  duration.className = 'education-duration';
  duration.innerHTML = `⏱️ ${lesson.duration}`;

  const reward = document.createElement('span');
  reward.className = 'education-reward';
  reward.innerHTML = `💰 ${formatSats(lesson.reward)}`;

  meta.appendChild(duration);
  meta.appendChild(reward);

  content.appendChild(header);
  content.appendChild(meta);

  card.appendChild(icon);
  card.appendChild(content);

  if (completed) {
    const completedBadge = document.createElement('div');
    completedBadge.className = 'education-completed-badge';
    completedBadge.textContent = '✓';
    card.appendChild(completedBadge);
  }

  if (onClick) {
    card.addEventListener('click', () => onClick(lesson));
    card.style.cursor = 'pointer';
  }

  return card;
}
