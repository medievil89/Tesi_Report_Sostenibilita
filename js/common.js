'use strict';

/* ========================================
   Configurazione
======================================== */

const CONFIG = {
  backToTopOffset: 300,
  headerRevealArea: 80,
  cardAnimationDuration: 250
};

function getScrollBehavior() {
  return window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches
    ? 'auto'
    : 'smooth';
}


/* ========================================
   Bottone "Torna su"
======================================== */

function initBackToTop() {
  const backToTopButton =
    document.getElementById('backToTop');

  if (!backToTopButton) return;

  let frameRequested = false;

  function updateVisibility() {
    const shouldShow =
      window.scrollY > CONFIG.backToTopOffset;

    backToTopButton.classList.toggle(
      'show',
      shouldShow
    );
  }

  function requestVisibilityUpdate() {
    if (frameRequested) return;

    frameRequested = true;

    window.requestAnimationFrame(() => {
      updateVisibility();
      frameRequested = false;
    });
  }

  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: getScrollBehavior()
    });
  });

  window.addEventListener(
    'scroll',
    requestVisibilityUpdate,
    { passive: true }
  );

  updateVisibility();
}


/* ========================================
   Collegamenti interni
======================================== */

function initInternalLinks() {
  const internalLinks =
    document.querySelectorAll(
      'a[href^="#"]:not([href="#"])'
    );

  internalLinks.forEach((link) => {
    link.addEventListener(
      'click',
      (event) => {
        const targetId =
          link.getAttribute('href');

        if (!targetId) return;

        const target =
          document.querySelector(targetId);

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
          behavior: getScrollBehavior(),
          block: 'start'
        });

        if (!target.hasAttribute('tabindex')) {
          target.setAttribute(
            'tabindex',
            '-1'
          );
        }

        target.focus({
          preventScroll: true
        });
      }
    );
  });
}

