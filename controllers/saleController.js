const Sale = require("../models/Sale");
const Item = require("../models/Item");

const createSale = async (req, res) => {
  try {
    const { customerName, customerPhone, itemsSold, total } = req.body;

    if (!itemsSold || !total) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let totalProfit = 0;
    const updatedItems = [];

    for (const soldItem of itemsSold) {
      const item = await Item.findById(soldItem._id);

      if (item) {
        const profit =
          (soldItem.salePrice - item.purchasePrice) * soldItem.quantity;
        totalProfit += profit;

        // Update the stock in the database
        item.quantity -= soldItem.quantity;
        await item.save();

        updatedItems.push({
          ...soldItem,
          profit,
        });
      }
    }

    const sale = new Sale({
      customerName,
      customerPhone,
      itemsSold: updatedItems,
      total,
      profit: totalProfit,
    });

    await sale.save();
    res.status(201).json(sale);
  } catch (error) {
    console.error("Error saving sale:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createSale };
