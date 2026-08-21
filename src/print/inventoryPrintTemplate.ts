import type { Item } from "../types/Item";

const escapeHtml = (value: string) => {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const createRows = (items: Item[]) => {
  if (!items || items.length === 0) {
    return `
      <tr>
        <td colspan="3" class="no-data">
          No inventory items found
        </td>
      </tr>
    `;
  }

  return items
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.tag_no ?? "")}</td>
          <td>${escapeHtml(item.type ?? "")}</td>
          <td>
            ${escapeHtml(
              `${item.mfgr ?? ""} ${item.model ?? ""}`.trim()
            )}
          </td>
        </tr>
      `,
    )
    .join("");
};

export const createInventoryPrintHtml = (
  itInventory: Item[],
  maintInventory: Item[],
) => {
  return `
    <!DOCTYPE html>
    <html lang="en">

    <head>
      <meta charset="UTF-8" />

      <title>Inventory Attestation</title>

      <style>
        @page {
          size: Letter;
          margin: 0.6in;
        }

        * {
          box-sizing: border-box;
        }

        body {
          font-family: Arial, Helvetica, sans-serif;
          color: #000;
          margin: 0;
          padding: 0;
        }

        .title {
          text-align: center;
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 25px;
        }

        .section-title {
          text-align: center;
          font-size: 16px;
          font-weight: bold;
          margin-top: 20px;
          margin-bottom: 10px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 25px;
        }

        th,
        td {
          border: 1px solid #000;
          padding: 7px 9px;
          font-size: 11px;
          text-align: left;
          vertical-align: middle;
        }

        th {
          font-weight: bold;
          background-color: #f2f2f2;
        }

        th:nth-child(1),
        td:nth-child(1) {
          width: 25%;
        }

        th:nth-child(2),
        td:nth-child(2) {
          width: 25%;
        }

        th:nth-child(3),
        td:nth-child(3) {
          width: 50%;
        }

        .no-data {
          text-align: center;
          font-style: italic;
          color: #555;
        }

        tr {
          page-break-inside: avoid;
        }

        thead {
          display: table-header-group;
        }
      </style>
    </head>

    <body>

      <div class="title">
        INVENTORY ATTESTATION
      </div>

      <div class="section-title">
        IT Inventory
      </div>

      <table>
        <thead>
          <tr>
            <th>Tag Number</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>

        <tbody>
          ${createRows(itInventory)}
        </tbody>
      </table>


      <div class="section-title">
        Maintenance Inventory
      </div>

      <table>
        <thead>
          <tr>
            <th>Tag Number</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>

        <tbody>
          ${createRows(maintInventory)}
        </tbody>
      </table>

    </body>
    </html>
  `;
};
