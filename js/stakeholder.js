'use strict';

/* ========================================
   Stakeholder — KPI nel nucleo
======================================== */

function initStakeholderNodes() {
  const center = document.querySelector('.stakeholder-center');
  const defaultCopy = center?.querySelector('.stakeholder-center-default');
  const kpi = center?.querySelector('.stakeholder-center-kpi');
  const kpiValue = kpi?.querySelector('strong');
  const kpiLabel = kpi?.querySelector('span');
  const kpiYear = kpi?.querySelector('small');
  const nodes = document.querySelectorAll('.stakeholder-node--interactive');

  if (!center || !defaultCopy || !kpi || !kpiValue || !kpiLabel || !kpiYear) {
    return;
  }

  function resetCenter() {
    nodes.forEach((node) => {
      const button = node.querySelector('.stakeholder-node-button');
      const name = button?.textContent.trim();

      node.classList.remove('is-selected');
      button?.setAttribute('aria-expanded', 'false');

      if (button && name) {
        button.setAttribute('aria-label', `Mostra il dato per ${name}`);
      }
    });

    center.classList.remove('has-kpi');
    defaultCopy.setAttribute('aria-hidden', 'false');
    kpi.setAttribute('aria-hidden', 'true');
  }

  function showNodeKpi(node) {
    nodes.forEach((otherNode) => {
      const otherButton = otherNode.querySelector('.stakeholder-node-button');
      const otherName = otherButton?.textContent.trim();
      const isSelected = otherNode === node;

      otherNode.classList.toggle('is-selected', isSelected);
      otherButton?.setAttribute('aria-expanded', String(isSelected));

      if (otherButton && otherName) {
        otherButton.setAttribute(
          'aria-label',
          `${isSelected ? 'Nascondi' : 'Mostra'} il dato per ${otherName}`
        );
      }
    });

    kpiValue.textContent = node.dataset.kpiValue || '';
    kpiLabel.textContent = node.dataset.kpiLabel || '';
    kpiYear.textContent = node.dataset.kpiYear || '';
    defaultCopy.setAttribute('aria-hidden', 'true');
    kpi.setAttribute('aria-hidden', 'false');
    center.classList.add('has-kpi');

  }

  nodes.forEach((node) => {
    const button = node.querySelector('.stakeholder-node-button');
    const name = button?.textContent.trim();

    if (button && name) {
      button.setAttribute('aria-label', `Mostra il dato per ${name}`);
    }

    button?.addEventListener('click', () => {
      if (node.classList.contains('is-selected')) {
        resetCenter();
        button.setAttribute('aria-label', `Mostra il dato per ${name}`);
        return;
      }

      showNodeKpi(node);
    });

    button?.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        resetCenter();
        button.focus();
      }
    });
  });

  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    if (!event.target.closest('.stakeholder-map')) {
      resetCenter();
    }
  });
}
