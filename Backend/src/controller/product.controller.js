// controllers/product.controller.js
import * as productServices from '../services/product.services.js';

export const createProduct = async (req, res) => {
  try {
    // service expects the full req (it handles body/files parsing & upload)
    const product = await productServices.createProduct(req);
    return res.status(201).json(product);
  } catch (err) {
    console.error('createProduct controller error:', err);
    return res.status(500).json({ error: err.message || 'Failed to create product' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const result = await productServices.deleteProductById(productId);
    return res.status(200).json(result);
  } catch (err) {
    console.error('deleteProduct controller error:', err);
    return res.status(500).json({ error: err.message || 'Failed to delete product' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    // Accept images either at req.files.images or req.files (array)
    const files = req.files?.images || req.files || [];
    const updated = await productServices.updateProduct(productId, req.body, files);
    return res.status(200).json(updated);
  } catch (err) {
    console.error('updateProduct controller error:', err);
    return res.status(500).json({ error: err.message || 'Failed to update product' });
  }
};

export const findProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productServices.findProductById(productId);
    return res.status(200).json(product);
  } catch (err) {
    console.error('findProductById controller error:', err);
    // If service throws when not found, return 404
    return res.status(404).json({ message: err.message || 'Product not found' });
  }
};

// controller/product.controller.js (replace current getAllProduct or add logging)
export const getAllProduct = async (req, res) => {
  console.log('-> /api/products called with query:', req.query);
  try {
    const result = await productServices.getAllProducts(req.query);
    return res.status(200).json(result);
  } catch (err) {
    // print full stack + request query — this will appear in server console
    console.error('getAllProduct controller error stack:', err.stack || err);
    console.error('REQ QUERY (for debugging):', req.query);
    // send more helpful message to client (while still returning 500)
    return res.status(500).json({ message: 'Server error', details: err.message });
  }
};



export const createMultipleProduct = async (req, res) => {
  try {
    // Expect body to be an array of product objects or an array of { body, files }
    await productServices.createMultipleProduct(req.body);
    return res.status(201).json({ message: 'Products created successfully', success: true });
  } catch (err) {
    console.error('createMultipleProduct controller error:', err);
    return res.status(500).json({ error: err.message || 'Failed to create multiple products' });
  }
};
