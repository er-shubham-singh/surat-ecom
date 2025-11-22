// models/category.model.js
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50,
    trim: true,
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categories',
    default: null,
  },
  level: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const Category = mongoose.model('categories', categorySchema);
export default Category;
