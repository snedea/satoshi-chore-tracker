/**
 * Modal dialog component
 */

/**
 * Create a modal dialog
 * @param {string} title - Modal title
 * @param {HTMLElement|string} content - Modal content (element or HTML string)
 * @param {object} options - Modal options
 * @param {function} options.onClose - Close handler
 * @param {boolean} options.closeButton - Show close button (default: true)
 * @returns {HTMLElement} Modal element
 */
export function Modal(title, content, options = {}) {
  const {
    onClose,
    closeButton = true
  } = options;

  const modal = document.createElement('div');
  modal.className = 'modal-overlay';

  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';

  const modalHeader = document.createElement('div');
  modalHeader.className = 'modal-header';

  const modalTitle = document.createElement('h2');
  modalTitle.textContent = title;
  modalHeader.appendChild(modalTitle);

  if (closeButton) {
    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', () => {
      closeModal();
    });
    modalHeader.appendChild(closeBtn);
  }

  const modalBody = document.createElement('div');
  modalBody.className = 'modal-body';

  if (typeof content === 'string') {
    modalBody.innerHTML = content;
  } else {
    modalBody.appendChild(content);
  }

  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalBody);
  modal.appendChild(modalContent);

  // Close on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  function closeModal() {
    modal.classList.add('modal-closing');
    setTimeout(() => {
      modal.remove();
      if (onClose) onClose();
    }, 200);
  }

  // Add to body
  document.body.appendChild(modal);

  // Trigger animation
  setTimeout(() => {
    modal.classList.add('modal-open');
  }, 10);

  return modal;
}

/**
 * Close all open modals
 */
export function closeAllModals() {
  const modals = document.querySelectorAll('.modal-overlay');
  modals.forEach(modal => {
    modal.remove();
  });
}
