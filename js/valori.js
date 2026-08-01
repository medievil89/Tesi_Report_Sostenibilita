'use strict';

/* ========================================
   Slider "I Valori del Gruppo Veronesi"
======================================== */

function initValuesSlider() {
  const slider =
    document.querySelector('.valori-slider');

  const leftButton =
    document.getElementById('valori-left');

  const rightButton =
    document.getElementById('valori-right');

  const cards =
    document.querySelectorAll('.valori-card');

  if (!slider && !cards.length) return;

  function updateCardAccessibility(
    card,
    isOpen
  ) {
    const front =
      card.querySelector('.valori-front');

    const back =
      card.querySelector('.valori-back');

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

  function scrollSlider(direction) {
    if (!slider) return;

    const firstCard =
      slider.querySelector('.valori-card');

    if (!firstCard) return;

    const sliderStyles =
      window.getComputedStyle(slider);

    const gap =
      Number.parseFloat(
        sliderStyles.columnGap
      ) || 0;

    const scrollAmount =
      firstCard.getBoundingClientRect().width +
      gap;

    slider.scrollBy({
      left:
        scrollAmount *
        direction,
      behavior: getScrollBehavior()
    });
  }

  function animateCard(card) {
    card.style.transform =
      'scale(1.03)';

    window.setTimeout(() => {
      card.style.removeProperty(
        'transform'
      );
    }, CONFIG.cardAnimationDuration);
  }

  function toggleCard(card) {
    cards.forEach((otherCard) => {
      if (otherCard !== card) {
        otherCard.classList.remove('open');
        updateCardAccessibility(
          otherCard,
          false
        );
      }
    });

    const isOpen =
      card.classList.toggle('open');

    updateCardAccessibility(card, isOpen);

    if (isOpen) {
      animateCard(card);
    }
  }

  leftButton?.addEventListener(
    'click',
    () => {
      scrollSlider(-1);
    }
  );

  rightButton?.addEventListener(
    'click',
    () => {
      scrollSlider(1);
    }
  );

  cards.forEach((card, index) => {
    const back =
      card.querySelector('.valori-back');

    card.setAttribute('role', 'button');

    if (back) {
      back.id ||= `valori-panel-${index + 1}`;
      card.setAttribute(
        'aria-controls',
        back.id
      );
    }

    updateCardAccessibility(card, false);

    if (!card.hasAttribute('tabindex')) {
      card.setAttribute('tabindex', '0');
    }

    card.addEventListener('click', () => {
      toggleCard(card);
    });

    card.addEventListener(
      'keydown',
      (event) => {
        if (
          event.key === 'Enter' ||
          event.key === ' '
        ) {
          event.preventDefault();
          toggleCard(card);
        }
      }
    );
  });
}


