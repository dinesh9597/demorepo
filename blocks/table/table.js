export default function decorate(block) {
  const table = document.createElement('table');
  const rows = [...block.children];

  // First row = header
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');

  const headerCells = [...rows[0].children];
  headerCells.forEach((cell) => {
    const th = document.createElement('th');
    th.textContent = cell.textContent.trim();
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Remaining rows = body
  const tbody = document.createElement('tbody');

  rows.slice(1).forEach((row) => {
    const tr = document.createElement('tr');
    const cells = [...row.children];

    cells.forEach((cell, i) => {
      const td = document.createElement('td');
      td.innerHTML = cell.innerHTML;

      // Add data-label for mobile responsive view
      const label = headerCells[i]
        ? headerCells[i].textContent.trim()
        : '';
      td.setAttribute('data-label', label);

      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);

  // Clear block and add table
  block.textContent = '';
  block.appendChild(table);
}
