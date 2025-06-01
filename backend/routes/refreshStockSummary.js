// backend/routes/refreshStockSummary.js
const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      "http://localhost:3000/api/tally/stock-summary"
    );
    const data = response.data;

    const filePath = path.join(
      __dirname,
      "../../frontend/public/stock-summary.json"
    );
    fs.writeFileSync(
      filePath,
      JSON.stringify(
        {
          lastUpdated: new Date().toISOString(),
          data: data,
        },
        null,
        2
      )
    );

    res.json({
      message: "Stock summary refreshed successfully",
      time: new Date(),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to refresh data", error: err.message });
  }
});

module.exports = router;
