// src/models/sizechart.model.js
import mongoose from "mongoose";

const sizeSchema = new mongoose.Schema({
  label: { type: String, required: true },
  // common numeric measurements (optional)
  bust: Number,
  waist: Number,
  hip: Number,
  hips: Number,      // kept both just in case older data uses 'hips'
  length: Number,
  shoulder: Number,
  chest: Number,
  brandSize: Number,
}, { _id: false });

const sizeChartSchema = new mongoose.Schema({
  category: { type: String, required: true, unique: true },
  sizes: { type: [sizeSchema], default: [] },
}, { timestamps: true });

const SizeChart = mongoose.model("SizeChart", sizeChartSchema);
export default SizeChart;
