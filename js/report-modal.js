'use strict';

/* ========================================
   Modal PDF — Anteprima
======================================== */

function initPdfModal() {
  const modal =
    document.getElementById('pdfModal');

  const pdfFrame =
    document.getElementById('pdfFrame');

  const closeButton =
    document.getElementById('closeModal');

  const previewButtons =
    document.querySelectorAll(
      '.report-item .btn.secondary[data-file]'
    );

  if (!modal || !pdfFrame) return;

  let lastFocusedElement = null;

  function preventModalScroll(event) {
    event.preventDefault();
  }

  function setModalScrollBlocking(isActive) {
    const listenerMethod = isActive
      ? 'addEventListener'
      : 'removeEventListener';

    ['wheel', 'touchmove'].forEach((eventName) => {
      modal[listenerMethod](
        eventName,
        preventModalScroll,
        { passive: false }
      );
    });
  }

  function openModal(file) {
    if (!file) return;

    lastFocusedElement =
      document.activeElement;

    pdfFrame.src = file;

    modal.classList.add('open');
    modal.setAttribute(
      'aria-hidden',
      'false'
    );

    setModalScrollBlocking(true);

    closeButton?.focus({
      preventScroll: true
    });
  }

  function closeModal() {
    modal.classList.remove('open');

    modal.setAttribute(
      'aria-hidden',
      'true'
    );

    setModalScrollBlocking(false);

    pdfFrame.removeAttribute('src');

    if (
      lastFocusedElement instanceof HTMLElement
    ) {
      lastFocusedElement.focus({
        preventScroll: true
      });
    }
  }

  function handleModalKeydown(event) {
    if (!modal.classList.contains('open')) {
      return;
    }

    if (event.key === 'Escape') {
      closeModal();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusableElements =
      modal.querySelectorAll(
        'button, a[href], iframe, ' +
        '[tabindex]:not([tabindex="-1"])'
      );

    if (!focusableElements.length) return;

    const firstElement =
      focusableElements[0];

    const lastElement =
      focusableElements[
        focusableElements.length - 1
      ];

    if (
      event.shiftKey &&
      document.activeElement === firstElement
    ) {
      event.preventDefault();
      lastElement.focus();
    }

    if (
      !event.shiftKey &&
      document.activeElement === lastElement
    ) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  previewButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const file =
        button.getAttribute('data-file');

      openModal(file);
    });
  });

  closeButton?.addEventListener(
    'click',
    closeModal
  );

  modal.addEventListener(
    'click',
    (event) => {
      if (event.target === modal) {
        closeModal();
      }
    }
  );

  document.addEventListener(
    'keydown',
    handleModalKeydown
  );
}


