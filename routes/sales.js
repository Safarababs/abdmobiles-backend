// routes/sales.js
const express = require("express");
const Sale = require("../models/Sale"); // Assuming your Sale model is in models/Sale.js
const Item = require("../models/Item"); // Assuming your Item model is in models/Item.js
const router = express.Router();

// Example route for saving a sale
router.post("/", async (req, res) => {
  const { customerName, customerPhone, itemsSold, total } = req.body;

  // Check if the itemsSold array is valid
  if (!Array.isArray(itemsSold) || itemsSold.length === 0) {
    return res
      .status(400)
      .json({ message: "Items sold should be a non-empty array." });
  }

  try {
    // Save the sale in the Sale collection
    const sale = new Sale({
      customerName,
      customerPhone,
      itemsSold, // Store the itemsSold data directly
      total, // Store the total price
      date: new Date(),
    });

    // Save the sale record
    await sale.save();

    // Update the quantities of items in the Item collection
    for (const item of itemsSold) {
      const itemDoc = await Item.findOne({ code: item.code });

      // If the item exists, update its quantity
      if (itemDoc) {
        itemDoc.quantity -= item.quantity; // Decrease the quantity
        await itemDoc.save();
      }
    }

    // Send back the saved sale data
    res.status(201).json(sale);
  } catch (error) {
    console.error("Error saving sale:", error);
    res.status(500).json({ message: "Error saving sale" });
  }
});

module.exports = router;
