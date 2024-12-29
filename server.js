const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const itemRoutes = require("./routes/items");
const saleRoutes = require("./routes/sales");

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://abdmobiles-backend.onrender.com",
      "https://ssmobile.netlify.app",
    ], // Allow these origins
    methods: "GET,POST,PUT,DELETE", // Allow specific HTTP methods
    allowedHeaders: "Content-Type, Authorization", // Allow specific headers
  })
);
app.use(express.json());

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://safar-admin:sn5125a1@mflix.zags8.mongodb.net/abdmobiles?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Routes
app.use("/api/items", itemRoutes); // Item routes should start with /api/items
app.use("/api", saleRoutes); // Sale routes should start with /api/sales

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
