/**
 * Hash-based router for SPA navigation
 */

const routes = {};
let currentRoute = null;

/**
 * Initialize router
 */
export function init() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute(); // Handle initial route
}

/**
 * Add a route handler
 * @param {string} path - Route path (e.g., '/', '/chores')
 * @param {function} handler - Handler function to render page
 */
export function addRoute(path, handler) {
  routes[path] = handler;
}

/**
 * Navigate to a route
 * @param {string} path - Route path
 */
export function navigate(path) {
  window.location.hash = path;
}

/**
 * Get current route
 * @returns {string} Current route path
 */
export function getCurrentRoute() {
  return currentRoute;
}

/**
 * Handle route changes
 */
function handleRoute() {
  const hash = window.location.hash.slice(1) || '/';
  const path = hash.split('?')[0]; // Remove query params
  currentRoute = path;

  const handler = routes[path];

  if (handler) {
    try {
      handler();
    } catch (e) {
      console.error(`Error rendering route ${path}:`, e);
      // Fallback to home if route handler fails
      if (path !== '/') {
        navigate('/');
      }
    }
  } else {
    console.warn(`No handler found for route: ${path}`);
    // Redirect to home for unknown routes
    navigate('/');
  }
}

export const router = {
  init,
  addRoute,
  navigate,
  getCurrentRoute
};
