export default async function decorate(block) {
  try {
    // Get the JSON URL from the first link in the block
    const link = block.querySelector("a");

    if (!link) {
      throw new Error("No JSON URL found.");
    }

    const source = link.href;
    console.log("Fetching:", source);

    // Fetch JSON
    const response = await fetch(source);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} - ${response.statusText}`);
    }

    const json = await response.json();

    if (!json.data || !json.columns) {
      throw new Error("Invalid JSON format.");
    }

    // Create table
    const table = document.createElement("table");

    // Header
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    json.columns.forEach((column) => {
      const th = document.createElement("th");
      th.textContent = column;
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Body
    const tbody = document.createElement("tbody");

    json.data.forEach((row) => {
      const tr = document.createElement("tr");

      json.columns.forEach((column) => {
        const td = document.createElement("td");
        td.textContent = row[column] || "";
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);

    // Replace block content
    block.innerHTML = "";
    block.appendChild(table);
  } catch (error) {
    console.error("Table Block Error:", error);

    block.innerHTML = `
      <p style="color:red;font-weight:bold;">
        Unable to load employee data.<br>
        ${error.message}
      </p>
    `;
  }
}
