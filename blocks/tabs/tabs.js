function switchTab(block, index) {
  const buttons = [...block.querySelectorAll('.tabs-nav button')];
  const panels = [...block.querySelectorAll('.tabs-panel')];

  buttons.forEach((btn, i) => {
    const isActive = i === index;
    btn.setAttribute('aria-selected', String(isActive));
    btn.setAttribute('tabindex', isActive ? '0' : '-1');
  });

  panels.forEach((panel, i) => {
    panel.setAttribute('aria-hidden', String(i !== index));
  });
}

export default function decorate(block) {
  const rows = [...block.children];

  // ── Build nav bar ──
  const nav = document.createElement('div');
  nav.classList.add('tabs-nav');
  nav.setAttribute('role', 'tablist');

  // ── Build panels container ──
  const panelsWrap = document.createElement('div');
  panelsWrap.classList.add('tabs-panels');

  rows.forEach((row, i) => {
    const [labelCell, contentCell] = [...row.children];

    // ── Tab button ──
    const btn = document.createElement('button');
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    btn.setAttribute('tabindex', i === 0 ? '0' : '-1');
    btn.setAttribute('aria-controls', `tabs-panel-${i}`);
    btn.setAttribute('id', `tabs-btn-${i}`);
    btn.textContent = labelCell.textContent.trim();

    btn.addEventListener('click', () => switchTab(block, i));

    // Keyboard arrow navigation
    btn.addEventListener('keydown', (e) => {
      const buttons = [...block.querySelectorAll('.tabs-nav button')];
      const total = buttons.length;
      let newIndex = i;

      if (e.key === 'ArrowRight') newIndex = (i + 1) % total;
      else if (e.key === 'ArrowLeft') newIndex = (i - 1 + total) % total;
      else if (e.key === 'Home') newIndex = 0;
      else if (e.key === 'End') newIndex = total - 1;
      else return;

      e.preventDefault();
      switchTab(block, newIndex);
      buttons[newIndex].focus();
    });

    nav.appendChild(btn);

    // ── Tab panel ──
    const panel = document.createElement('div');
    panel.classList.add('tabs-panel');
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('id', `tabs-panel-${i}`);
    panel.setAttribute('aria-labelledby', `tabs-btn-${i}`);
    panel.setAttribute('aria-hidden', i === 0 ? 'false' : 'true');
    panel.innerHTML = contentCell.innerHTML;

    panelsWrap.appendChild(panel);
  });

  // ── Clear block and rebuild ──
  block.textContent = '';
  block.appendChild(nav);
  block.appendChild(panelsWrap);
}
