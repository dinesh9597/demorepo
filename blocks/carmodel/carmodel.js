export default async function decorate(block) {
  const sheetUrl = '/carmodel.json';
  const PAGE_SIZE = 4;
  let allData = [];
  let shown = 0;

  block.innerHTML = '<div class="carmodel-loading">Loading...</div>';

  try {
    const response = await fetch(sheetUrl);
    if (!response.ok) throw new Error(`Failed to fetch data: ${response.status}`);
    const json = await response.json();
    allData = json.data;

    if (!allData || allData.length === 0) {
      block.innerHTML = '<div class="carmodel-error">No data found.</div>';
      return;
    }

    const headers = Object.keys(allData[0]);

    // Build wrapper
    const wrapper = document.createElement('div');

    const grid = document.createElement('div');
    grid.className = 'carmodel-grid';

    const loadMoreBtn = document.createElement('button');
    loadMoreBtn.className = 'carmodel-load-more';
    loadMoreBtn.textContent = 'Load more';

    function renderTiles() {
      const nextBatch = allData.slice(shown, shown + PAGE_SIZE);
      nextBatch.forEach((row) => {
        const tile = document.createElement('div');
        tile.className = 'carmodel-tile';
        headers.forEach((key) => {
          const rowEl = document.createElement('div');
          rowEl.className = 'carmodel-tile-row';
          rowEl.innerHTML = `
            <span class="carmodel-tile-label">${key}</span>
            <span class="carmodel-tile-value">${row[key] ? row[key].trim() : '—'}</span>
          `;
          tile.appendChild(rowEl);
        });
        grid.appendChild(tile);
      });
      shown += nextBatch.length;
      loadMoreBtn.style.display = shown >= allData.length ? 'none' : 'block';
    }

    loadMoreBtn.addEventListener('click', renderTiles);

    wrapper.appendChild(grid);
    wrapper.appendChild(loadMoreBtn);

    block.textContent = '';
    block.appendChild(wrapper);

    renderTiles(); // load first 4
  } catch (error) {
    block.innerHTML = `<div class="carmodel-error">Error: ${error.message}</div>`;
  }
}
