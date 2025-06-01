const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const tallyController = require("./tallyController");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Simple test route
app.get("/", (req, res) => {
  res.send("Online Catalog Backend is running");
});

// Tally-related API routes
app.get("/api/tally/stock-summary", tallyController.getStockSummary);
app.get(
  "/api/tally/stock-summary/:groupName",
  tallyController.getStockSummaryByGroup
);
app.get("/api/tally/group-details/:groupName", tallyController.getGroupDetails);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
