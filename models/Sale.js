const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,

      default: "Not provided",
    },
    customerPhone: {
      type: String,

      default: "Not provided",
    },
    itemsSold: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
        code: String,
        name: String,
        quantity: Number,
        salePrice: Number,
      },
    ],
    total: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Sale = mongoose.model("Sale", saleSchema);
module.exports = Sale;
