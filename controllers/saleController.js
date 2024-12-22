const Sale = require("../models/Sale");

const createSale = async (req, res) => {
  try {
    const {
      items,
      totalAmount,
      discount,
      finalAmount,
      customerName,
      customerPhone,
    } = req.body;

    if (!items || !totalAmount || !finalAmount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate items
    for (const item of items) {
      if (!item.itemCode || !item.itemName || !item.price) {
        return res
          .status(400)
          .json({ message: "Item is missing required fields" });
      }
    }

    // Create new sale
    const sale = new Sale({
      items,
      totalAmount,
      discount,
      finalAmount,
      customerName,
      customerPhone,
    });

    await sale.save();
    res.status(201).json(sale);
  } catch (error) {
    console.error("Error saving sale:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createSale };
