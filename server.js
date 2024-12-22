const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const itemRoutes = require("./routes/items");
const saleRoutes = require("./routes/sales");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://safar-admin:sn5125a1@mflix.zags8.mongodb.net/abdmobiles?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Routes
app.use("/api/items", itemRoutes); // Changed the route prefix to "/api/items"
app.use("/api/sales", saleRoutes); // Changed the route prefix to "/api/sales"

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});