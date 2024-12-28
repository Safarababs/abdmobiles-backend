const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true },
  customerName: { type: String },
  customerPhone: { type: String },
  itemsSold: [
    {
      name: String,
      code: String,
      salePrice: Number,
      purchasePrice: Number,
      quantity: Number,
      profit: Number, // New Field
    },
  ],
  total: Number,
  totalProfit: Number, // New Field
  date: { type: Date, default: Date.now }, // For time-based queries
});

module.exports = mongoose.model("Sale", saleSchema);
