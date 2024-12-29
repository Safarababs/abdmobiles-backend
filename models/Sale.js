const mongoose = require("mongoose");

// Define the sale schema
const saleSchema = new mongoose.Schema({
  customerName: { type: String, default: "Abdullah mobiles customer" },
  customerPhone: { type: String, default: "03046348069" },
  itemsSold: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, required: true },
      name: { type: String, required: true },
      code: { type: String, required: true },
      salePrice: { type: Number, required: true },
      purchasePrice: { type: Number, required: true },
      quantity: { type: Number, required: true },
      profit: { type: Number, default: 0 }, // Profit for this item
      loss: { type: Number, default: 0 }, // Loss for this item
    },
  ],
  total: { type: Number, required: true }, // Total sale amount
  profit: { type: Number, default: 0 }, // Total profit for the entire sale
  loss: { type: Number, default: 0 }, // Total loss for the entire sale
  invoiceNumber: { type: String, unique: true, required: true }, // Unique invoice number
  date: { type: Date, default: Date.now }, // Automatically set the date of sale
});

// Virtual method to calculate the total profit for the sale
saleSchema.virtual("totalProfit").get(function () {
  return this.itemsSold.reduce((total, item) => total + item.profit, 0);
});

// Virtual method to calculate the total loss for the sale
saleSchema.virtual("totalLoss").get(function () {
  return this.itemsSold.reduce((total, item) => total + item.loss, 0);
});

// Method to update the profit and loss for each item before saving the sale
// Method to generate a new invoice number (this can be customized as per your requirement)
saleSchema.pre("save", function (next) {
  // Check if invoiceNumber exists. If not, generate a new one.
  if (!this.invoiceNumber) {
    // Generate a unique invoice number (you can customize this logic)
    this.invoiceNumber = `INV-${mongoose.Types.ObjectId().toString()}`;
  }

  // Calculate profit and loss for each item
  this.itemsSold.forEach((item) => {
    const itemProfit = (item.salePrice - item.purchasePrice) * item.quantity;
    const itemLoss = itemProfit < 0 ? Math.abs(itemProfit) : 0;
    const itemProfitCalculated = itemProfit > 0 ? itemProfit : 0;

    item.profit = itemProfitCalculated;
    item.loss = itemLoss;
  });

  // Update overall profit and loss for the sale
  this.profit = this.totalProfit;
  this.loss = this.totalLoss;

  next();
});

// Create and export the Sale model
const Sale = mongoose.model("Sale", saleSchema);

module.exports = Sale;
