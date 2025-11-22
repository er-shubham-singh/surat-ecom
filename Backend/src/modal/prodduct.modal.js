// models/product.model.js
import mongoose from 'mongoose';

const sizeSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  quantity: { type: Number, default: 0 },
}, { _id: false });

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  discountedPrice: { type: Number, default: 0 },
  discountPercent: { type: Number, default: 0 },
  brand: { type: String, trim: true },
  color: [{ type: String, trim: true }],               
  sizes: [sizeSchema],
  imageUrl: {
    type: [String],
    validate: {
      validator: arr => Array.isArray(arr) && arr.length <= 4,
      message: 'Maximum 4 images allowed',
    },
    default: [],
  },
  ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ratings' }],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'reviews' }],
  numRatings: { type: Number, default: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'categories' },
  quantity: { type: Number, default: 0 }, 
}, { timestamps: true });

const Product = mongoose.model('products', productSchema);
export default Product;
