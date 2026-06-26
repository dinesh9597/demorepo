export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('tile');

    const cells = [...row.children];

    // ── Single cell layout (image + all content in one cell) ──
    if (cells.length === 1) {
      const cell = cells[0];
      const img = cell.querySelector('img');

      if (img) {
        img.classList.add('tile-image');
        const picture = cell.querySelector('picture') || img;

        const body = document.createElement('div');
        body.classList.add('tile-body');

        // Move non-image content into body
        [...cell.children].forEach((child) => {
          if (!child.querySelector('img') && child.tagName !== 'PICTURE') {
            body.appendChild(child);
          }
        });

        cell.textContent = '';
        cell.appendChild(picture);
        cell.appendChild(body);
      } else {
        // No image — wrap content in body div
        row.classList.add('no-image');
        const body = document.createElement('div');
        body.classList.add('tile-body');
        body.innerHTML = cell.innerHTML;
        cell.replaceWith(body);
      }
    }

    // ── Two cell layout (left = image, right = content) ──
    if (cells.length === 2) {
      const [imgCell, contentCell] = cells;
      const img = imgCell.querySelector('img');

      if (img) {
        img.classList.add('tile-image');
        const picture = imgCell.querySelector('picture') || img;
        imgCell.replaceWith(picture);
      } else {
        row.classList.add('no-image');
        imgCell.remove();
      }

      contentCell.classList.add('tile-body');
    }
  });
}
