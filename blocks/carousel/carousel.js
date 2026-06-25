let current = 0;
let autoPlayTimer = null;
const AUTO_PLAY_DELAY = 2000; // 3 seconds — change this to adjust speed

function buildDots(block, total) {
  const dots = document.createElement('div');
  dots.classList.add('carousel-dots');

  for (let i = 0; i < total; i++) {
    const btn = document.createElement('button');
    btn.setAttribute('aria-label', `Go to slide ${i + 1}`);
    if (i === 0) btn.classList.add('active');
    btn.addEventListener('click', () => {
      goTo(block, i);
      resetAutoPlay(block);
    });
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

function startAutoPlay(block) {
  const slides = block.querySelectorAll('.carousel-slide');
  autoPlayTimer = setInterval(() => {
    goTo(block, current + 1);
  }, AUTO_PLAY_DELAY);
}

function stopAutoPlay() {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer);
    autoPlayTimer = null;
  }
}

function resetAutoPlay(block) {
  stopAutoPlay();
  startAutoPlay(block);
}

function buildNav(block) {
  ['prev', 'next'].forEach((dir) => {
    const btn = document.createElement('button');
    btn.classList.add(`carousel-${dir}`);
    btn.setAttribute('aria-label', dir === 'prev' ? 'Previous slide' : 'Next slide');
    btn.textContent = dir === 'prev' ? '‹' : '›';
    btn.addEventListener('click', () => {
      goTo(block, current + (dir === 'prev' ? -1 : 1));
      resetAutoPlay(block); // reset timer when user clicks manually
    });
    block.appendChild(btn);
  });
}

export default function decorate(block) {
  const track = document.createElement('div');
  track.classList.add('carousel-track');

  [...block.children].forEach((row) => {
    row.classList.add('carousel-slide');

    const img = row.querySelector('img');

    if (img) {
      img.classList.add('carousel-slide-image');

      const body = document.createElement('div');
      body.classList.add('carousel-slide-body');

      [...row.children].forEach((child) => {
        if (!child.querySelector('img') && child.tagName !== 'PICTURE') {
          body.appendChild(child);
        }
      });

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

    // Start auto-play
    startAutoPlay(block);

    // Pause on hover
    block.addEventListener('mouseenter', stopAutoPlay);
    block.addEventListener('mouseleave', () => startAutoPlay(block));

    // Touch swipe — reset timer after swipe
    let startX = 0;
    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      stopAutoPlay();
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) goTo(block, current + (diff > 0 ? 1 : -1));
      startAutoPlay(block);
    });

    // Keyboard
    block.setAttribute('tabindex', '0');
    block.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { goTo(block, current - 1); resetAutoPlay(block); }
      if (e.key === 'ArrowRight') { goTo(block, current + 1); resetAutoPlay(block); }
    });
  }
}
