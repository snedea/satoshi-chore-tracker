/**
 * Navigation bar component
 */

import { router } from '../router.js';

/**
 * Create navigation bar
 * @param {string} currentPath - Current route path
 * @returns {HTMLElement} Navigation bar element
 */
export function NavBar(currentPath) {
  const nav = document.createElement('nav');
  nav.className = 'navbar';

  const navItems = [
    { path: '/', icon: '🏠', label: 'Home' },
    { path: '/chores', icon: '✅', label: 'Chores' },
    { path: '/learn', icon: '📚', label: 'Learn' },
    { path: '/wallet', icon: '💼', label: 'Wallet' },
    { path: '/parent', icon: '👨‍👩‍👧', label: 'Parent' }
  ];

  navItems.forEach(item => {
    const navItem = document.createElement('a');
    navItem.className = `nav-item ${currentPath === item.path ? 'nav-active' : ''}`;
    navItem.href = `#${item.path}`;

    const icon = document.createElement('span');
    icon.className = 'nav-icon';
    icon.textContent = item.icon;

    const label = document.createElement('span');
    label.className = 'nav-label';
    label.textContent = item.label;

    navItem.appendChild(icon);
    navItem.appendChild(label);

    navItem.addEventListener('click', (e) => {
      e.preventDefault();
      router.navigate(item.path);
    });

    nav.appendChild(navItem);
  });

  return nav;
}

/**
 * Update active nav item
 * @param {string} currentPath - Current route path
 */
export function updateNavBar(currentPath) {
  const navItems = document.querySelectorAll('.nav-item');

  navItems.forEach(item => {
    const href = item.getAttribute('href');
    const path = href ? href.slice(1) : '';

    if (path === currentPath) {
      item.classList.add('nav-active');
    } else {
      item.classList.remove('nav-active');
    }
  });
}
