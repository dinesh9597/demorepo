export default async function decorate(block) {

  // ── Sheet URL — hardcoded to your carmodel sheet ──
  const sheetUrl = '/carmodel.json';

  // Show loading
  block.innerHTML = '<div class="carmodel-loading">Loading...</div>';

  try {
    // ── AJAX call ──
    const response = await fetch(sheetUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const json = await response.json();
    const data = json.data;

    if (!data || data.length === 0) {
      block.innerHTML = '<div class="carmodel-error">No data found.</div>';
      return;
    }

    // ── Get column headers from first row keys ──
    const headers = Object.keys(data[0]).map((h) => h.trim());

    // ── Build table ──
    const table = document.createElement('table');

    // thead
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    headers.forEach((header) => {
      const th = document.createElement('th');
      th.textContent = header;
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // tbody
    const tbody = document.createElement('tbody');

    data.forEach((row) => {
      const tr = document.createElement('tr');

      // Use original keys (with spaces) to read values
      Object.keys(row).forEach((key) => {
        const td = document.createElement('td');
        td.textContent = row[key] ? row[key].trim() : '—';
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);

    // ── Replace loading with table ──
    block.textContent = '';
    block.appendChild(table);

  } catch (error) {
    block.innerHTML = `<div class="carmodel-error">Error: ${error.message}</div>`;
  }
}
