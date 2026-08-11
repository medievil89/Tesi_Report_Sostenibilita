'use strict';

/* ========================================
   Card materialità — reveal al click
======================================== */

function initFlipCards() {
  const flipCards =
    document.querySelectorAll('.flip-card');

  function setCardState(card, isOpen) {
    const front = card.querySelector('.card-front');
    const back = card.querySelector('.card-back');

    card.classList.toggle('open', isOpen);
    card.setAttribute('aria-expanded', String(isOpen));

    const cardTitle = front
      ?.querySelector('h3')
      ?.textContent.trim();

    if (cardTitle) {
      card.setAttribute(
        'aria-label',
        `${isOpen ? 'Chiudi' : 'Approfondisci'}: ${cardTitle}`
      );
    }

    front?.setAttribute('aria-hidden', String(isOpen));
    back?.setAttribute('aria-hidden', String(!isOpen));
  }

  function closeAllCards() {
    flipCards.forEach((card) => {
      setCardState(card, false);
    });
  }

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

    const cardTitle = front
      ?.querySelector('h3')
      ?.textContent.trim();

    if (cardTitle) {
      card.setAttribute(
        'aria-label',
        `Approfondisci: ${cardTitle}`
      );
    }

    front?.setAttribute(
      'aria-hidden',
      'false'
    );

    back?.setAttribute(
      'aria-hidden',
      'true'
    );

    function toggleCard() {
      const willOpen = !card.classList.contains('open');

      flipCards.forEach((otherCard) => {
        if (otherCard !== card) {
          setCardState(otherCard, false);
        }
      });

      setCardState(card, willOpen);
    }

    card.addEventListener(
      'keydown',
      (event) => {
        if (
          event.key === 'Enter' ||
          event.key === ' '
        ) {
          event.preventDefault();
          toggleCard();
        }

        if (event.key === 'Escape') {
          setCardState(card, false);
        }
      }
    );

    card.addEventListener('click', () => {
      toggleCard();
    });
  });

  document.addEventListener('click', (event) => {
    const clickedCard = event.target instanceof Element
      ? event.target.closest('.flip-card')
      : null;

    if (!clickedCard) {
      closeAllCards();
    }
  });

  window.addEventListener('hashchange', () => {
    if (window.location.hash !== '#materialita') {
      closeAllCards();
    }
  });

  if ('IntersectionObserver' in window) {
    const cardVisibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            !entry.isIntersecting &&
            entry.target.classList.contains('open')
          ) {
            setCardState(entry.target, false);
          }
        });
      },
      { threshold: 0 }
    );

    flipCards.forEach((card) => {
      cardVisibilityObserver.observe(card);
    });
  }
}


