const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Item = require("./models/Item");
const data = require("./data");

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(
    "mongodb+srv://safar-admin:sn5125a1@mflix.zags8.mongodb.net/abdmobiles?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("Database connection error:", err));

const seedDatabase = async () => {
  try {
    await Item.deleteMany(); // Clear existing data
    await Item.insertMany(data.items); // Insert new data
    console.log("Data seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedDatabase();
