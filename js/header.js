'use strict';

/* ========================================
   Header e navigazione responsive
======================================== */

function initSiteHeader() {
  const header =
    document.querySelector('.site-header');

  const menuToggle =
    document.querySelector('.menu-toggle');

  const navigation =
    document.getElementById('primary-navigation');

  const hero =
    document.querySelector('#hero');

  if (!header || !navigation) return;

  const navigationLinks = Array.from(
    navigation.querySelectorAll('a[href^="#"]')
  );

  const trackedSections = navigationLinks
    .map((link) => {
      const selector =
        link.getAttribute('href');

      const section = selector
        ? document.querySelector(selector)
        : null;

      return section
        ? { link, section }
        : null;
    })
    .filter(Boolean);

  let frameRequested = false;
  let pointerNearTop = false;

  function preventOutsideMenuScroll(event) {
    if (!navigation.contains(event.target)) {
      event.preventDefault();
    }
  }

  function setMenuScrollBlocking(isActive) {
    const listenerMethod = isActive
      ? 'addEventListener'
      : 'removeEventListener';

    ['wheel', 'touchmove'].forEach((eventName) => {
      document[listenerMethod](
        eventName,
        preventOutsideMenuScroll,
        { passive: false }
      );
    });
  }

  function isMobileNavigation() {
    return window.matchMedia(
      '(max-width: 1080px)'
    ).matches;
  }

  function setMenuState(isOpen) {
    const shouldOpen =
      isOpen && isMobileNavigation();

    header.classList.toggle(
      'menu-open',
      shouldOpen
    );

    document.body.classList.toggle(
      'mobile-menu-open',
      shouldOpen
    );

    setMenuScrollBlocking(shouldOpen);

    menuToggle?.setAttribute(
      'aria-expanded',
      String(shouldOpen)
    );

    menuToggle?.setAttribute(
      'aria-label',
      shouldOpen
        ? 'Chiudi menu'
        : 'Apri menu'
    );

    updateHeaderVisibility();
  }

  function updateActiveLink() {
    if (!trackedSections.length) return;

    if (
      header.classList.contains(
        'is-over-hero'
      )
    ) {
      navigationLinks.forEach((link) => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      });
      return;
    }

    const marker =
      window.scrollY +
      window.innerHeight * 0.38;

    let currentItem = null;

    trackedSections.forEach((item) => {
      if (
        item.section.offsetTop <= marker
      ) {
        currentItem = item;
      }
    });

    navigationLinks.forEach((link) => {
      const isActive = currentItem
        ? link === currentItem.link
        : false;

      link.classList.toggle(
        'active',
        isActive
      );

      if (isActive) {
        link.setAttribute(
          'aria-current',
          'location'
        );
      } else {
        link.removeAttribute(
          'aria-current'
        );
      }
    });
  }

  function isPastHero() {
    if (!hero) {
      return (
        window.scrollY >
        window.innerHeight
      );
    }

    const heroBottom =
      hero.offsetTop +
      hero.offsetHeight;

    return (
      window.scrollY >
      heroBottom -
        CONFIG.headerRevealArea
    );
  }

  function updateHeaderVisibility() {
    const headerIsActive =
      header.matches(':hover') ||
      header.contains(
        document.activeElement
      ) ||
      header.classList.contains(
        'menu-open'
      );

    const shouldHide =
      !isMobileNavigation() &&
      isPastHero() &&
      !pointerNearTop &&
      !headerIsActive;

    header.classList.toggle(
      'header-hidden',
      shouldHide
    );
  }

  function updateHeader() {
    const isOverHero = hero
      ? hero.getBoundingClientRect().bottom >
        header.offsetHeight
      : false;

    header.classList.toggle(
      'is-over-hero',
      isOverHero
    );

    header.classList.toggle(
      'scrolled',
      window.scrollY > 24
    );

    updateHeaderVisibility();
    updateActiveLink();
  }

  function requestHeaderUpdate() {
    if (frameRequested) return;

    frameRequested = true;

    window.requestAnimationFrame(() => {
      updateHeader();
      frameRequested = false;
    });
  }

  menuToggle?.addEventListener(
    'click',
    () => {
      setMenuState(
        !header.classList.contains(
          'menu-open'
        )
      );
    }
  );

  navigationLinks.forEach((link) => {
    link.addEventListener(
      'click',
      () => {
        setMenuState(false);
      }
    );
  });

  document.addEventListener(
    'pointerdown',
    (event) => {
      if (
        header.classList.contains(
          'menu-open'
        ) &&
        !header.contains(event.target)
      ) {
        setMenuState(false);
      }
    }
  );

  document.addEventListener(
    'pointermove',
    (event) => {
      if (
        event.pointerType === 'touch'
      ) {
        return;
      }

      const isNearTop =
        event.clientY <=
        CONFIG.headerRevealArea;

      if (
        isNearTop === pointerNearTop
      ) {
        return;
      }

      pointerNearTop = isNearTop;

      updateHeaderVisibility();
    },
    { passive: true }
  );

  document.addEventListener(
    'keydown',
    (event) => {
      if (
        event.key === 'Escape' &&
        header.classList.contains(
          'menu-open'
        )
      ) {
        setMenuState(false);
        menuToggle?.focus();
      }
    }
  );

  header.addEventListener(
    'mouseenter',
    updateHeaderVisibility
  );

  header.addEventListener(
    'mouseleave',
    updateHeaderVisibility
  );

  header.addEventListener(
    'focusin',
    updateHeaderVisibility
  );

  header.addEventListener(
    'focusout',
    () => {
      window.requestAnimationFrame(
        updateHeaderVisibility
      );
    }
  );

  window.addEventListener(
    'scroll',
    requestHeaderUpdate,
    { passive: true }
  );

  window.addEventListener(
    'resize',
    () => {
      if (!isMobileNavigation()) {
        setMenuState(false);
      }

      requestHeaderUpdate();
    },
    { passive: true }
  );

  updateHeader();
}


