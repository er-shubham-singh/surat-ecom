// services/product.service.js
import cloudinary from '../config/cloudinary.js'; // adjust to your cloudinary setup
import Category from '../models/category.model.js';
import Product from '../models/product.model.js';

async function uploadFilesToCloudinary(files = [], folder = 'ecommerce/products') {
  if (!files || files.length === 0) return [];
  const uploadResults = await Promise.all(files.map(file => {
    const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    return cloudinary.uploader.upload(base64Image, { folder });
  }));
  return uploadResults.map(res => res.secure_url);
}

export const createProduct = async (req) => {
  try {
    const reqData = req.body || {};

    // parse sizes: allow array or JSON string
    let sizes = [];
    if (reqData.size) {
      if (typeof reqData.size === 'string') {
        sizes = JSON.parse(reqData.size);
      } else if (Array.isArray(reqData.size)) {
        sizes = reqData.size;
      } else {
        throw new Error('Invalid size format');
      }
      sizes = sizes.map(s => ({ name: s.name, quantity: Number(s.quantity) || 0 }));
    }

    // upload images
    if (!req.files || req.files.length === 0) {
      throw new Error('No images uploaded');
    }
    const imageUrls = await uploadFilesToCloudinary(req.files, 'ecommerce/product');

    // Category handling (create if missing)
    const topName = (reqData.topLevelCategory || '').trim();
    const midName = (reqData.secondLevelCategory || '').trim();
    const bottomName = (reqData.thirdLevelCategory || '').trim();

    const topLevel = topName
      ? (await Category.findOne({ name: topName }) || await new Category({ name: topName, level: 1 }).save())
      : null;

    const secondLevel = (midName && topLevel)
      ? (await Category.findOne({ name: midName, parentCategory: topLevel._id }) ||
         await new Category({ name: midName, parentCategory: topLevel._id, level: 2 }).save())
      : null;

    const thirdLevel = (bottomName && secondLevel)
      ? (await Category.findOne({ name: bottomName, parentCategory: secondLevel._id }) ||
         await new Category({ name: bottomName, parentCategory: secondLevel._id, level: 3 }).save())
      : null;

    const categoryId = thirdLevel ? thirdLevel._id : (secondLevel ? secondLevel._id : (topLevel ? topLevel._id : null));

    // Normalize color: accept comma-separated string, array or single string
    let colors = [];
    if (reqData.color) {
      if (typeof reqData.color === 'string') {
        colors = reqData.color.startsWith('[') ? JSON.parse(reqData.color) : reqData.color.split(',').map(c => c.trim());
      } else if (Array.isArray(reqData.color)) {
        colors = reqData.color;
      } else {
        colors = [String(reqData.color)];
      }
    }

    const product = new Product({
      title: (reqData.title || '').trim(),
      description: (reqData.description || '').trim(),
      price: Number(reqData.price) || 0,
      discountedPrice: Number(reqData.discountedPrice) || 0,
      discountPercent: Number(reqData.discountPercent) || 0,
      brand: (reqData.brand || '').trim(),
      color: colors,
      sizes,
      imageUrl: imageUrls,
      category: categoryId,
      quantity: Number(reqData.quantity) || 0,
    });

    return await product.save();
  } catch (err) {
    console.error('Create Product Error:', err);
    throw new Error(err.message || 'Something went wrong while creating product');
  }
};

export const deleteProductById = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error('Product not found with id: ' + productId);
  }
  await Product.findByIdAndDelete(productId);
  return { message: 'Product deleted successfully' };
};

export const updateProduct = async (productId, reqData = {}, files = []) => {
  try {
    const product = await Product.findById(productId);
    if (!product) throw new Error('Product not found');

    // sizes handling
    let sizes = product.sizes || [];
    if (reqData.size) {
      let parsedSize;
      if (typeof reqData.size === 'string') {
        parsedSize = JSON.parse(reqData.size);
      } else {
        parsedSize = reqData.size;
      }
      if (!Array.isArray(parsedSize)) throw new Error('Size must be an array');
      sizes = parsedSize.map(({ name, quantity }) => ({ name, quantity: Number(quantity) || 0 }));
    }

    // images: if new files present, upload and replace; otherwise keep existing
    let imageUrls = product.imageUrl || [];
    if (files && files.length > 0) {
      const uploaded = await uploadFilesToCloudinary(files, 'ecommerce/products');
      imageUrls = uploaded;
    }

    // optional category updates (topLavelCategory typos corrected to topLevelCategory)
    let categoryId = product.category;
    if (reqData.topLevelCategory && reqData.secondLevelCategory && reqData.thirdLevelCategory) {
      const topName = (reqData.topLevelCategory || '').trim();
      const midName = (reqData.secondLevelCategory || '').trim();
      const bottomName = (reqData.thirdLevelCategory || '').trim();

      const top = topName
        ? (await Category.findOne({ name: topName }) || await new Category({ name: topName, level: 1 }).save())
        : null;

      const mid = (midName && top)
        ? (await Category.findOne({ name: midName, parentCategory: top._id }) ||
           await new Category({ name: midName, parentCategory: top._id, level: 2 }).save())
        : null;

      const bottom = (bottomName && mid)
        ? (await Category.findOne({ name: bottomName, parentCategory: mid._id }) ||
           await new Category({ name: bottomName, parentCategory: mid._id, level: 3 }).save())
        : null;

      if (bottom) categoryId = bottom._id;
      else if (mid) categoryId = mid._id;
      else if (top) categoryId = top._id;
    }

    // normalize color
    let colors = product.color;
    if (reqData.color) {
      if (typeof reqData.color === 'string') {
        colors = reqData.color.startsWith('[') ? JSON.parse(reqData.color) : reqData.color.split(',').map(c => c.trim());
      } else if (Array.isArray(reqData.color)) {
        colors = reqData.color;
      } else {
        colors = [String(reqData.color)];
      }
    }

    // apply updates safely
    product.set({
      title: reqData.title ? reqData.title.trim() : product.title,
      description: reqData.description ? reqData.description.trim() : product.description,
      price: reqData.price !== undefined ? Number(reqData.price) : product.price,
      discountedPrice: reqData.discountedPrice !== undefined ? Number(reqData.discountedPrice) : product.discountedPrice,
      discountPercent: reqData.discountPercent !== undefined ? Number(reqData.discountPercent) : product.discountPercent,
      brand: reqData.brand ? reqData.brand.trim() : product.brand,
      color: colors,
      sizes,
      imageUrl: imageUrls,
      category: categoryId,
      quantity: reqData.quantity !== undefined ? Number(reqData.quantity) : product.quantity,
    });

    await product.save();
    return await Product.findById(productId).populate('category');
  } catch (err) {
    console.error('Update product error...', err);
    throw new Error(err.message || 'Update failed');
  }
};

export async function findProductById(id) {
  const product = await Product.findById(id).populate('category').exec();
  if (!product) {
    throw new Error('Product not found with id ' + id);
  }
  return product;
}

export async function getAllProducts(reqQuery = {}) {
  let {
    category,
    color,
    sizes,
    minPrice,
    maxPrice,
    minDiscount,
    sort,
    stock,
    pageNumber,
    pageSize,
  } = reqQuery;

  pageSize = Number(pageSize) || 10;
  pageNumber = Number(pageNumber) || 1;

  // base query
  const mongooseQuery = {};
  const andFilters = [];

  // category + children
  if (category) {
    const existCategory = await Category.findOne({ name: category.trim() });
    if (!existCategory) {
      return { content: [], currentPage: 1, totalPages: 1 };
    }

    const allCategoryIds = new Set([existCategory._id.toString()]);

    async function getChildrenRecursive(parentIds) {
      const children = await Category.find({ parentCategory: { $in: parentIds } }).select('_id').lean();
      if (!children || children.length === 0) return;
      const childIds = children.map(c => c._id);
      childIds.forEach(id => allCategoryIds.add(id.toString()));
      await getChildrenRecursive(childIds);
    }

    await getChildrenRecursive([existCategory._id]);

    andFilters.push({ category: { $in: Array.from(allCategoryIds) } });
  }

  if (color) {
    const colorSet = new Set(String(color).split(',').map(c => c.trim().toLowerCase()).filter(Boolean));
    if (colorSet.size > 0) {
      andFilters.push({ color: { $in: Array.from(colorSet) } });
    }
  }

  if (sizes) {
    const sizesSet = Array.isArray(sizes) ? sizes : String(sizes).split(',').map(s => s.trim());
    andFilters.push({ 'sizes.name': { $in: sizesSet } });
  }

  if (minPrice !== undefined && maxPrice !== undefined) {
    andFilters.push({ discountedPrice: { $gte: Number(minPrice), $lte: Number(maxPrice) } });
  } else if (minPrice !== undefined) {
    andFilters.push({ discountedPrice: { $gte: Number(minPrice) } });
  } else if (maxPrice !== undefined) {
    andFilters.push({ discountedPrice: { $lte: Number(maxPrice) } });
  }

  if (minDiscount !== undefined) {
    andFilters.push({ discountPercent: { $gt: Number(minDiscount) } });
  }

  if (stock) {
    if (stock === 'in_stock') andFilters.push({ quantity: { $gt: 0 } });
    else if (stock === 'out_of_stock') andFilters.push({ quantity: { $lte: 0 } });
  }

  if (andFilters.length > 0) mongooseQuery.$and = andFilters;

  // build mongoose query
  let query = Product.find(mongooseQuery).populate('category');

  // sort
  if (sort) {
    const sortDirection = sort === 'price_high' ? -1 : 1;
    query = query.sort({ discountedPrice: sortDirection });
  }

  const totalProducts = await Product.countDocuments(mongooseQuery);
  const totalPages = Math.ceil(totalProducts / pageSize) || 1;
  const skip = (pageNumber - 1) * pageSize;

  const products = await query.skip(skip).limit(Number(pageSize)).exec();

  return { content: products, currentPage: Number(pageNumber), totalPages };
}

export async function createMultipleProduct(products = []) {
  for (const p of products) {
    // Here we assume p is shaped as { body: {...}, files: [...] } or plain product object.
    if (p && p.body) {
      await createProduct(p);
    } else {
      // fallback to direct insertion
      await Product.create(p);
    }
  }
}
