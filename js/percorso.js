'use strict';

function initJourney() {
  const journey = document.querySelector('#percorso');
  if (!journey) return;

  const buttons = [...journey.querySelectorAll('[data-journey-step]')];
  const panels = [...journey.querySelectorAll('[data-journey-panel]')];
  const progress = journey.querySelector('.journey-track span');
  const counter = journey.querySelector('.journey-counter strong');
  let activeIndex = 0;

  function activateStep(index) {
    if (!panels[index] || index === activeIndex && panels[index].classList.contains('is-active')) return;

    activeIndex = index;
    panels.forEach((panel, panelIndex) => {
      panel.classList.toggle('is-active', panelIndex === index);
    });

    buttons.forEach((button, buttonIndex) => {
      if (buttonIndex === index) {
        button.setAttribute('aria-current', 'step');
      } else {
        button.removeAttribute('aria-current');
      }
    });

    if (progress) {
      progress.style.setProperty('--journey-progress', `${(index / Math.max(panels.length - 1, 1)) * 100}%`);
    }

    if (counter) counter.textContent = String(index + 1);
  }

  buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
      const isMobileJourney = window.matchMedia('(max-width: 760px)').matches;
      const targetPanel = panels[index];

      if (!isMobileJourney && index === 0) {
        journey.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      } else if (isMobileJourney) {
        targetPanel?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      } else if (targetPanel) {
        const desktopOffset = Math.min(112, window.innerHeight * 0.1);

        window.scrollTo({
          top: window.scrollY + targetPanel.getBoundingClientRect().top - desktopOffset,
          behavior: 'smooth'
        });
      }

      activateStep(index);
    });
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          activateStep(Number(visible.target.dataset.journeyPanel));
        }
      },
      { rootMargin: '-24% 0px -34%', threshold: [0.15, 0.35, 0.55] }
    );

    panels.forEach((panel) => observer.observe(panel));
  }
}
