const express = require("express");
const router = express.Router();
const Sale = require("../models/Sale");
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

    const sales = await Sale.find({
      date: { $gte: startDate.toDate(), $lte: endDate.toDate() },
    });

    res.status(200).json(sales);
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json({ message: "Failed to fetch sales" });
  }
});

router.post("/sales", async (req, res) => {
  try {
    const { customerName, customerPhone, itemsSold, total } = req.body;

    // Generate a unique invoice number (timestamp + random number)
    const invoiceNumber = `INV-${Date.now()}-${Math.floor(
      Math.random() * 1000
    )}`;

    // Calculate total profit
    const totalProfit = itemsSold.reduce((acc, item) => {
      const profit = (item.salePrice - item.purchasePrice) * item.quantity;
      item.profit = profit; // Add profit for each item
      return acc + profit;
    }, 0);

    // Create the sale record
    const sale = new Sale({
      invoiceNumber,
      customerName,
      customerPhone,
      itemsSold,
      total,
      totalProfit,
      date: moment().toDate(),
    });

    await sale.save();

    res
      .status(201)
      .json({ message: "Sale recorded successfully", invoiceNumber });
  } catch (error) {
    console.error("Error saving sale:", error);
    res.status(500).json({ message: "Failed to record sale" });
  }
});

module.exports = router;
