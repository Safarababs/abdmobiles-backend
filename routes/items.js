// routes/items.js
const express = require("express");
const Item = require("../models/Item"); // Assuming your Item model is in models/Item.js
const router = express.Router();

// Get all items or search by name or code
router.get("/", async (req, res) => {
  const search = req.query.search || ""; // Search query param (either item code or name)

  try {
    const items = await Item.find({
      $or: [
        { code: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ],
    });

    res.json(items); // Send the found items as a JSON response
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Error fetching items" });
  }
});
router.put("/updateQuantity", async (req, res) => {
  const { itemCode, quantityPurchased } = req.body;

  // Ensure that both itemCode and quantityPurchased are provided
  if (!itemCode || quantityPurchased === undefined) {
    return res
      .status(400)
      .json({ message: "Item code and quantity are required" });
  }

  try {
    // Find the item by its unique code
    const item = await Item.findOne({ code: itemCode });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Increase the quantity of the item
    item.quantity += parseInt(quantityPurchased); // Ensure quantity is updated correctly

    // Save the updated item back to the database
    await item.save();

    return res
      .status(200)
      .json({ message: "Item quantity updated successfully", item });
  } catch (error) {
    console.error("Error updating quantity:", error);
    return res.status(500).json({ message: "Error updating quantity" });
  }
});

router.post("/", async (req, res) => {
  const { code, name, purchasePrice, salePrice, quantity } = req.body;

  try {
    const newItem = new Item({
      code,
      name,
      purchasePrice,
      salePrice,
      quantity,
    });

    await newItem.save(); // Save the new item to MongoDB
    res.status(201).json({ message: "Item added successfully", newItem });
  } catch (error) {
    res.status(500).json({ message: "Error adding item", error });
  }
});

router.delete("/:itemCode", async (req, res) => {
  const { itemCode } = req.params; // Get item code from URL params

  try {
    // Find the item by its code and delete it
    const result = await Item.deleteOne({ code: itemCode });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting item", error });
  }
});

module.exports = router;
