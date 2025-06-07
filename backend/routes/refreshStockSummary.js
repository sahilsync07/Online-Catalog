const express = require("express");
const axios = require("axios");
const fs = require("fs").promises;
const path = require("path");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    // Fetch data from Tally endpoint
    const response = await axios.get(
      "http://localhost:3000/api/tally/stock-summary"
    );
    const data = response.data;

    const filePath = path.join(
      __dirname,
      "../../frontend/public/stock-summary.json"
    );

    // Ensure directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    // Write data asynchronously
    await fs.writeFile(
      filePath,
      JSON.stringify(
        {
          lastUpdated: new Date().toISOString(),
          data,
        },
        null,
        2
      )
    );

    res.json({
      message: "Stock summary refreshed successfully",
      time: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Error refreshing stock summary:", err.message);
    res
      .status(500)
      .json({ message: "Failed to refresh data", error: err.message });
  }
});

module.exports = router;
