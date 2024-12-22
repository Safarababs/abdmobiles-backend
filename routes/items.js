// routes/items.js
const express = require("express");
const Item = require("../models/Item"); // Assuming your Item model is in models/Item.js
const router = express.Router();

// Get all items or search by name or code
router.get("/", async (req, res) => {
  const search = req.query.search || ""; // Search query param (either item code or name)

  try {
    const items = await Item.find({
      $or: [
        { code: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ],
    });

    res.json(items); // Send the found items as a JSON response
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Error fetching items" });
  }
});

module.exports = router;
