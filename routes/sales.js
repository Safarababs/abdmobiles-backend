const express = require("express");
const router = express.Router();
const Sale = require("../models/Sale");
const Item = require("../models/Item");
const moment = require("moment");

// Fetch sales by date range (daily, weekly, monthly, yearly)
router.get("/sales", async (req, res) => {
  try {
    const { period } = req.query; // e.g., daily, weekly, monthly, yearly

    let startDate;
    let endDate = moment(); // current date

    switch (period) {
      case "daily":
        startDate = moment().startOf("day");
        break;
      case "weekly":
        startDate = moment().startOf("week");
        break;
      case "monthly":
        startDate = moment().startOf("month");
        break;
      case "yearly":
        startDate = moment().startOf("year");
        break;
      default:
        return res.status(400).json({ message: "Invalid period" });
    }

    // Fetch sales within the date range
    const sales = await Sale.find({
      date: { $gte: startDate.toDate(), $lte: endDate.toDate() },
    });

    res.status(200).json(sales);
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json({ message: "Failed to fetch sales" });
  }
});

// POST /sales route - Saving the sale and updating inventory
router.post("/sales", async (req, res) => {
  try {
    const { customerName, customerPhone, itemsSold, total } = req.body;

    let totalProfit = 0;
    let totalLoss = 0;

    const itemsWithProfitLoss = itemsSold.map((item) => {
      const profitOrLoss =
        (item.salePrice - item.purchasePrice) * item.quantity;

      if (profitOrLoss > 0) {
        totalProfit += profitOrLoss;
        item.profit = profitOrLoss; // Save profit
        item.loss = undefined; // Ensure no loss is saved
      } else if (profitOrLoss < 0) {
        totalLoss += Math.abs(profitOrLoss);
        item.loss = Math.abs(profitOrLoss); // Save loss
        item.profit = undefined; // Ensure no profit is saved
      }

      return item;
    });

    // Generate invoice number before creating the sale
    const invoiceNumber = `INV-${Date.now()}`; // Generate unique invoice number using timestamp

    // Create the sale in the database
    const newSale = new Sale({
      customerName,
      customerPhone,
      itemsSold: itemsWithProfitLoss,
      total,
      profit: totalProfit > 0 ? totalProfit : undefined,
      loss: totalLoss > 0 ? totalLoss : undefined,
      invoiceNumber, // Set the invoice number here
      date: moment().toDate(), // Set the date field
    });

    // Save the sale to the database
    const savedSale = await newSale.save();

    // Update inventory for each item sold
    for (const item of itemsSold) {
      const itemInDatabase = await Item.findById(item._id);

      if (itemInDatabase && itemInDatabase.quantity >= item.quantity) {
        itemInDatabase.quantity -= item.quantity;
        await itemInDatabase.save();
      } else {
        console.error(`Insufficient stock for item: ${item.name}`);
        return res.status(400).json({
          message: `Insufficient stock for item: ${item.name}`,
        });
      }
    }

    res.status(201).json({
      invoiceNumber: savedSale.invoiceNumber,
      message: "Sale saved successfully!",
    });
  } catch (error) {
    console.error("Error saving sale:", error);
    res.status(500).json({ message: "Error saving sale" });
  }
});

module.exports = router;
