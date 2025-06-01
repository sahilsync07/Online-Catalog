const express = require("express");
const router = express.Router();
const { fetchAndParseTallyStock } = require("../controllers/tallyController");

// GET /api/tally/stock
router.get("/stock", fetchAndParseTallyStock);

module.exports = router;
