let current = 0;

function buildDots(block, total) {
  const dots = document.createElement('div');
  dots.classList.add('carousel-dots');

  for (let i = 0; i < total; i++) {
    const btn = document.createElement('button');
    btn.setAttribute('aria-label', `Go to slide ${i + 1}`);
    if (i === 0) btn.classList.add('active');
    btn.addEventListener('click', () => goTo(block, i));
    dots.appendChild(btn);
  }

  block.appendChild(dots);
}

function updateDots(block, index) {
  block.querySelectorAll('.carousel-dots button').forEach((btn, i) => {
    btn.classList.toggle('active', i === index);
  });
}

function goTo(block, index) {
  const track = block.querySelector('.carousel-track');
  const slides = block.querySelectorAll('.carousel-slide');
  current = (index + slides.length) % slides.length;
  track.style.transform = `translateX(-${current * 100}%)`;
  updateDots(block, current);
}

function buildNav(block) {
  ['prev', 'next'].forEach((dir) => {
    const btn = document.createElement('button');
    btn.classList.add(`carousel-${dir}`);
    btn.setAttribute('aria-label', dir === 'prev' ? 'Previous slide' : 'Next slide');
    btn.textContent = dir === 'prev' ? '‹' : '›';
    btn.addEventListener('click', () => goTo(block, current + (dir === 'prev' ? -1 : 1)));
    block.appendChild(btn);
  });
}

export default function decorate(block) {
  const track = document.createElement('div');
  track.classList.add('carousel-track');

  [...block.children].forEach((row) => {
    row.classList.add('carousel-slide');

    // Check if slide has an image
    const img = row.querySelector('img');

    if (img) {
      // Pull image out, apply class, put it first
      img.classList.add('carousel-slide-image');

      // Wrap remaining content in a body div
      const body = document.createElement('div');
      body.classList.add('carousel-slide-body');

      // Move all non-image content into body
      [...row.children].forEach((child) => {
        // picture element wraps the img — move the whole picture tag
        if (!child.querySelector('img') && child.tagName !== 'PICTURE') {
          body.appendChild(child);
        }
      });

      // Clear slide, add picture then body
      const picture = row.querySelector('picture') || img;
      row.textContent = '';
      row.appendChild(picture);
      row.appendChild(body);
    } else {
      row.classList.add('no-image');
    }

    track.appendChild(row);
  });

  block.appendChild(track);

  const total = track.children.length;
  block.setAttribute('data-slides', total);

  if (total > 1) {
    buildNav(block);
    buildDots(block, total);

    // Touch swipe
    let startX = 0;
    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) goTo(block, current + (diff > 0 ? 1 : -1));
    });

    // Keyboard
    block.setAttribute('tabindex', '0');
    block.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') goTo(block, current - 1);
      if (e.key === 'ArrowRight') goTo(block, current + 1);
    });
  }
}
