// models/Item.js
const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  purchasePrice: { type: Number, required: true },
  salePrice: { type: Number, required: true },
});

module.exports = mongoose.model("Item", ItemSchema);
