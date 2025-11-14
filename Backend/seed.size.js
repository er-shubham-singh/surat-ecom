// scripts/seedSizeCharts.js
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import SizeChart from "./src/modal/sizechart.model.js"; // adjust relative path if needed

const dummySizeCharts = [
  {
    category: "ladies_tops",
    sizes: [
      { label: "M", length: 20, hip: 46, bust: 36, waist: 30 },
      { label: "L", length: 20, hip: 48, bust: 38, waist: 32 },
      { label: "XL", length: 20, hip: 50, bust: 40, waist: 34 },
    ],
  },
  {
    category: "ladies_jacket",
    sizes: [
      { label: "M", hip: 38, bust: 38, waist: 40, shoulder: 10 },
      { label: "L", hip: 39, bust: 40, waist: 40, shoulder: 10 },
      { label: "XL", hip: 40, bust: 42, waist: 42, shoulder: 10 },
    ],
  },
  {
    category: "hoodie",
    sizes: [
      { label: "M", chest: 34, brandSize: 32 },
      { label: "L", chest: 36, brandSize: 34 },
      { label: "XL", chest: 38, brandSize: 36 },
      { label: "XXL", chest: 40, brandSize: 38 },
      { label: "3XL", chest: 42, brandSize: 40 },
      { label: "4XL", chest: 44, brandSize: 42 },
      { label: "5XL", chest: 46, brandSize: 44 },
      { label: "6XL", chest: 48, brandSize: 46 },
      { label: "7XL", chest: 50, brandSize: 48 },
    ],
  },
  {
    category: "ladies_cardigan",
    sizes: [
      { label: "M", chest: 34, length: 24 },
      { label: "L", chest: 36, length: 24.5 },
      { label: "XL", chest: 38, length: 25.5 },
      { label: "XXL", chest: 40, length: 26.5 },
    ],
  },
  {
    category: "ladies_coat",
    sizes: [
      { label: "M", chest: 36 },
      { label: "L", chest: 38 },
      { label: "XL", chest: 40 },
      { label: "XXL", chest: 42 },
      { label: "3XL", chest: 44 },
      { label: "4XL", chest: 46 },
      { label: "5XL", chest: 48 },
      { label: "6XL", chest: 50 },
      { label: "7XL", chest: 52 },
    ],
  },
];

(async function seed() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI not set in environment");

    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("✅ MongoDB connected");

    await SizeChart.deleteMany({});
    const result = await SizeChart.insertMany(dummySizeCharts);
    console.log(`🌱 Seeded size charts: ${result.length}`);

    await mongoose.disconnect();
    console.log("✅ MongoDB disconnected");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    try { await mongoose.disconnect(); } catch(e) {}
    process.exit(1);
  }
})();
