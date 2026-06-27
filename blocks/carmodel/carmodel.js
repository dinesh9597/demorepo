export default async function decorate(block) {
  // ── Get the sheet URL from the block content ──
  // Author puts the sheet path in the block table in da.live
  // e.g.  /your-sheet-name.json  or  /cars.json
  const link = block.querySelector('a');
  const sheetUrl = link ? link.href : '/carmodel.json';

  // Show loading state
  block.innerHTML = '<div class="cars-loading">Loading...</div>';

  try {
    // ── AJAX call to fetch EDS sheet JSON ──
    const response = await fetch(sheetUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const json = await response.json();
    const data = json.data;

    if (!data || data.length === 0) {
      block.innerHTML = '<div class="cars-error">No data found.</div>';
      return;
    }

    // ── Get column headers from first row keys ──
    const headers = Object.keys(data[0]);

    // ── Build table ──
    const table = document.createElement('table');

    // thead
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    headers.forEach((header) => {
      const th = document.createElement('th');
      th.textContent = header.trim(); // trim spaces from key names
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // tbody
    const tbody = document.createElement('tbody');

    data.forEach((row) => {
      const tr = document.createElement('tr');

      headers.forEach((header) => {
        const td = document.createElement('td');
        td.textContent = row[header] ? row[header].trim() : '—';
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);

    // ── Replace loading with table ──
    block.textContent = '';
    block.appendChild(table);

  } catch (error) {
    block.innerHTML = `<div class="cars-error">Error loading data: ${error.message}</div>`;
  }
}
