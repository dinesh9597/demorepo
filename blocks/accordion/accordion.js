export default function decorate(block) {
  block.classList.add('accordion-block');

  const wrapper = document.createElement('div');
  wrapper.className = 'accordion';

  // Each child row becomes an accordion item. First child of row is heading, rest is panel.
  [...block.children].forEach((row, idx) => {
    const item = document.createElement('div');
    item.className = 'accordion-item';

    // Extract heading content
    const headingEl = row.querySelector(':scope > *:first-child');
    const panelEl = document.createElement('div');
    panelEl.className = 'accordion-panel';
    panelEl.setAttribute('role', 'region');

    let titleHTML = `Item ${idx + 1}`;
    if (headingEl) {
      titleHTML = headingEl.innerHTML;
    }

    // Build trigger button
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'accordion-trigger';
    trigger.setAttribute('aria-expanded', 'false');
    const id = `accordion-${Math.random().toString(36).slice(2, 9)}`;
    trigger.setAttribute('aria-controls', `${id}-panel`);
    panelEl.id = `${id}-panel`;
    trigger.innerHTML = titleHTML;

    // Move remaining children into panel
    let moved = false;
    [...row.children].forEach((c, i) => {
      if (i === 0) return; // skip heading
      panelEl.appendChild(c.cloneNode(true));
      moved = true;
    });

    // If there was no separate content node, try to take text from heading's nextSibling
    if (!moved && headingEl && headingEl.nextElementSibling) {
      panelEl.appendChild(headingEl.nextElementSibling.cloneNode(true));
    }

    // Toggle behavior
    function toggle(open) {
      const isOpen = open ?? (trigger.getAttribute('aria-expanded') === 'true');
      const willOpen = !isOpen;
      trigger.setAttribute('aria-expanded', String(willOpen));
      if (willOpen) {
        panelEl.hidden = false;
        panelEl.style.maxHeight = panelEl.scrollHeight + 'px';
      } else {
        panelEl.style.maxHeight = '0px';
        panelEl.addEventListener('transitionend', function hide() {
          panelEl.hidden = true;
          panelEl.removeEventListener('transitionend', hide);
        });
      }
    }

    trigger.addEventListener('click', () => toggle());

    // allow keyboard open/close via Enter/Space (button handles this by default)

    // start closed
    panelEl.hidden = true;
    panelEl.style.maxHeight = '0px';

    item.append(trigger, panelEl);
    wrapper.append(item);
  });

  block.replaceChildren(wrapper);
}
