const Item = require("../models/Item");

const addItem = async (req, res) => {
  try {
    const { itemCode, itemName, quantityInStock, price } = req.body;

    if (!itemCode || !itemName || !quantityInStock || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newItem = new Item({ itemCode, itemName, quantityInStock, price });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    console.error("Error retrieving items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { addItem, getItems };
