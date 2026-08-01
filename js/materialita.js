'use strict';

/* ========================================
   Flip card — Supporto tastiera
======================================== */

function initFlipCards() {
  const flipCards =
    document.querySelectorAll('.flip-card');

  flipCards.forEach((card, index) => {
    const front =
      card.querySelector('.card-front');

    const back =
      card.querySelector('.card-back');

    card.setAttribute('role', 'button');

    if (!card.hasAttribute('tabindex')) {
      card.setAttribute('tabindex', '0');
    }

    if (back) {
      back.id ||= `materialita-panel-${index + 1}`;
      card.setAttribute(
        'aria-controls',
        back.id
      );
    }

    card.setAttribute(
      'aria-expanded',
      'false'
    );

    front?.setAttribute(
      'aria-hidden',
      'false'
    );

    back?.setAttribute(
      'aria-hidden',
      'true'
    );

    function toggleFlipCard() {
      const isOpen =
        card.classList.toggle('open');

      card.setAttribute(
        'aria-expanded',
        String(isOpen)
      );

      front?.setAttribute(
        'aria-hidden',
        String(isOpen)
      );

      back?.setAttribute(
        'aria-hidden',
        String(!isOpen)
      );
    }

    card.addEventListener(
      'keydown',
      (event) => {
        if (
          event.key === 'Enter' ||
          event.key === ' '
        ) {
          event.preventDefault();
          toggleFlipCard();
        }
      }
    );

    card.addEventListener('click', () => {
      const touchLikeDevice = window.matchMedia(
        '(hover: none), (pointer: coarse)'
      ).matches;

      if (touchLikeDevice) {
        toggleFlipCard();
      }
    });
  });
}


