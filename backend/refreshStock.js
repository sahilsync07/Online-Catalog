// backend/refresh-stock.js
const axios = require("axios");
const fs = require("fs").promises;
const path = require("path");

async function refreshStockSummary() {
  try {
    const response = await axios.get(
      "http://localhost:3000/api/tally/stock-summary"
    );
    const data = response.data;
    const filePath = path.join(
      __dirname,
      "../frontend/public/stock-summary.json"
    );
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(
      filePath,
      JSON.stringify({ lastUpdated: new Date().toISOString(), data }, null, 2)
    );
    console.log("Stock summary updated");
  } catch (err) {
    console.error("Error:", err.message);
  }
}

refreshStockSummary();
