const axios = require("axios");
const { XMLParser } = require("fast-xml-parser");

// XML request body for stock summary
const stockSummaryXML = `<?xml version="1.0"?>
<ENVELOPE>
  <HEADER>
    <TALLYREQUEST>Export Data</TALLYREQUEST>
  </HEADER>
  <BODY>
    <EXPORTDATA>
      <REQUESTDESC>
        <REPORTNAME>Stock Summary</REPORTNAME>
        <STATICVARIABLES>
          <EXPLODEFLAG>Yes</EXPLODEFLAG>
          <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
        </STATICVARIABLES>
      </REQUESTDESC>
    </EXPORTDATA>
  </BODY>
</ENVELOPE>`;

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});

// Helper function to fetch and parse full structured data from Tally
async function fetchStructuredData() {
  const response = await axios.post("http://localhost:9000/", stockSummaryXML, {
    headers: { "Content-Type": "text/xml" },
  });

  const jsonData = parser.parse(response.data);
  const envelope = jsonData.ENVELOPE;

  const dspAccNames = Array.isArray(envelope.DSPACCNAME)
    ? envelope.DSPACCNAME
    : [envelope.DSPACCNAME];

  const dspStkInfos = Array.isArray(envelope.DSPSTKINFO)
    ? envelope.DSPSTKINFO
    : [envelope.DSPSTKINFO];

  const structuredData = [];
  let currentGroup = null;

  dspAccNames.forEach((acc, index) => {
    const name = acc.DSPDISPNAME || "Unknown";
    const stkCl = dspStkInfos[index]?.DSPSTKCL || {};
    const quantity = stkCl.DSPCLQTY || null;
    const rate = stkCl.DSPCLRATE || null;
    const amount = stkCl.DSPCLAMTA || null;

    if (quantity === null && rate === null) {
      // This is a group header
      currentGroup = {
        group: name,
        amount: amount,
        items: [],
      };
      structuredData.push(currentGroup);
    } else if (currentGroup) {
      // This is an item under the current group
      currentGroup.items.push({
        name: name,
        quantity: quantity,
        rate: rate,
        amount: amount,
      });
    }
  });

  return structuredData;
}

// Full stock summary (grouped)
exports.getStockSummary = async (req, res) => {
  try {
    const data = await fetchStructuredData();
    res.json(data);
  } catch (error) {
    console.error("Error fetching stock summary from Tally:", error.message);
    res.status(500).json({ error: "Failed to fetch data from Tally" });
  }
};

// Stock summary by group name - returns only items of that group
exports.getStockSummaryByGroup = async (req, res) => {
  const groupName = req.params.groupName;

  try {
    const data = await fetchStructuredData();
    const group = data.find(
      (g) => g.group.toLowerCase() === groupName.toLowerCase()
    );

    if (!group) {
      return res
        .status(404)
        .json({ message: `Group '${groupName}' not found` });
    }

    res.json(group.items);
  } catch (error) {
    console.error(
      `Error fetching stock summary for group ${groupName}:`,
      error.message
    );
    res.status(500).json({ error: "Failed to fetch data from Tally" });
  }
};

// Mock group details (optional fallback or demo endpoint)
const groupDetails = {
  "4WAY SPORT": [
    { item: "Shoe Model A", qty: 50, rate: 50, amount: 2500 },
    { item: "Shoe Model B", qty: 50, rate: 50, amount: 2500 },
  ],
  ADDA: [{ item: "Slipper Model X", qty: 200, rate: 30, amount: 6000 }],
};

// Fetch group details (mocked)
exports.getGroupDetails = async (req, res) => {
  const groupName = req.params.groupName;
  const details = groupDetails[groupName];
  if (details) {
    res.json(details);
  } else {
    res.status(404).json({ message: "Group not found" });
  }
};
