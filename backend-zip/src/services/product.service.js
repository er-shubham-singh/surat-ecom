const cloudinary = require("../config/cloudinary"); // ✅ correct
const Category = require("../models/category.model");
const Product = require("../models/product.model");



// helper used here
function normalizeText(str = "") {
  return String(str || "").trim().toLowerCase();
}
// ---------- Helper: resolve product from query or session ----------
async function resolveProductFromQuery(session, rawQuery) {
  // Try to use existing session-known products first (improves follow-ups)
  const q = (rawQuery || "").trim();
  // 1) If user provided a non-empty query, try DB first
  if (q) {
    // try DB best product
    const dbMatch = await productService.findBestProduct(q);
    if (dbMatch) return dbMatch;
  }

  // 2) If session has lastProducts, try fuzzy match against their titles
  try {
    const lastProducts = (session && session.lastProducts) || [];
    if (lastProducts && lastProducts.length) {
      // create arrays of titles and map index->product
      const titles = lastProducts.map(p => (p.title || "").toLowerCase());
      const qLower = (q || "").toLowerCase();
      // try exact title match first
      const exactIndex = titles.findIndex(t => t === qLower);
      if (exactIndex !== -1) {
        return await productService.findProductById(lastProducts[exactIndex]._id);
      }
      // fuzzy match using stringSimilarity
      const match = stringSimilarity.findBestMatch(qLower, titles);
      if (match && match.bestMatch && match.bestMatch.rating > 0.5) {
        const idx = match.bestMatchIndex;
        return await productService.findProductById(lastProducts[idx]._id);
      }
      // if no query provided (user just said "describe" after category), pick first
      if (!q && lastProducts.length) {
        return await productService.findProductById(lastProducts[0]._id);
      }
    }
  } catch (e) {
    console.warn("resolveProductFromQuery session fuzzy failed", e?.message || e);
  }

  // 3) fallback: lastProductId in session
  try {
    if (session && session.lastProductId) {
      return await productService.findProductById(session.lastProductId);
    }
  } catch (e) { /* ignore */ }

  // 4) final fallback: try findBestProduct again (with query)
  if (q) {
    return await productService.findBestProduct(q);
  }
  return null;
}


// helpers at top of file
function escapeRegex(str = "") {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // escape regex chars
}
function normalizeForCompare(s = "") {
  return String(s || "")
    .toLowerCase()
    .replace(/[^\w\s]/g, "")      // remove punctuation
    .replace(/\s+/g, " ")        // collapse spaces
    .trim();
}

async function findBestProduct(query) {
  if (!query || !String(query).trim()) return null;
  const raw = String(query).trim();

  // 0) if query looks like a Mongo ObjectId, try findById
  if (/^[0-9a-fA-F]{24}$/.test(raw)) {
    const byId = await Product.findById(raw)
      .populate({
        path: "category",
        populate: { path: "parentCategory", populate: { path: "parentCategory" } }
      }).exec();
    if (byId) return byId;
  }

  // normalized forms to compare
  const normQuery = normalizeForCompare(raw);

  // 1) try normalized exact title match using JS compare (faster & robust)
  const exactCandidates = await Product.find({ title: { $exists: true } })
    .select("title")
    .limit(200)
    .exec();

  for (const cand of exactCandidates) {
    if (normalizeForCompare(cand.title || "") === normQuery) {
      const full = await Product.findById(cand._id)
        .populate({
          path: "category",
          populate: { path: "parentCategory", populate: { path: "parentCategory" } }
        }).exec();
      if (full) return full;
    }
  }

  // 2) case-insensitive exact match via regex (anchors)
  try {
    const re = new RegExp("^\\s*" + escapeRegex(raw) + "\\s*$", "i");
    let product = await Product.findOne({ title: { $regex: re } })
      .populate({
        path: "category",
        populate: { path: "parentCategory", populate: { path: "parentCategory" } }
      }).exec();
    if (product) return product;
  } catch (e) {
    // ignore regex errors
  }

  // 3) title contains all tokens (existing approach)
  const tokens = normQuery.split(/\s+/).filter(Boolean);
  if (tokens.length) {
    const tokenRegex = tokens.map(t => `(?=.*${escapeRegex(t)})`).join("");
    const reAll = new RegExp(tokenRegex + ".*", "i");
    let product = await Product.findOne({ title: { $regex: reAll } })
      .populate({
        path: "category",
        populate: { path: "parentCategory", populate: { path: "parentCategory" } }
      }).exec();
    if (product) return product;
  }

  // 4) brand, color, category, or description fallback (as before)
  let product = await Product.findOne({ brand: { $regex: new RegExp(escapeRegex(raw), "i") } })
    .populate({
      path: "category",
      populate: { path: "parentCategory", populate: { path: "parentCategory" } }
    }).exec();
  if (product) return product;

  const matchingCategory = await Category.findOne({ name: { $regex: new RegExp(escapeRegex(raw), "i") } });
  if (matchingCategory) {
    product = await Product.findOne({ category: matchingCategory._id })
      .populate({
        path: "category",
        populate: { path: "parentCategory", populate: { path: "parentCategory" } }
      }).exec();
    if (product) return product;
  }

  // 5) final fallback: title/description search
  const regex = new RegExp(raw.split(/\s+/).map(escapeRegex).join("|"), "i");
  const list = await Product.find({
    $or: [{ title: { $regex: regex } }, { description: { $regex: regex } }]
  }).limit(1)
    .populate({
      path: "category",
      populate: { path: "parentCategory", populate: { path: "parentCategory" } }
    }).exec();

  return list.length ? list[0] : null;
}


function formatCurrencyINR(n) {
  if (n === undefined || n === null) return "N/A";
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

async function getProductInfo(queryOrProduct) {
  let product = null;
  if (!queryOrProduct) return null;

  if (typeof queryOrProduct === "string") {
    product = await findBestProduct(queryOrProduct);
    if (!product) return null;
  } else {
    product = queryOrProduct;
  }

  // prepare fields from your existing schema
  const title = product.title || "Product";
  const brand = product.brand || "";
  const price = product.discountedPrice ?? product.price ?? null;
  const discount = product.discountPersent || 0;
  const sizes = Array.isArray(product.sizes) ? product.sizes.map(s => s.name || s).join(", ") : "One size";
  const colors = Array.isArray(product.color) ? product.color.join(", ") : (product.color || "Various");
  const qty = product.quantity ?? 0;
  const availability = qty > 0 ? `In stock (${qty} available)` : "Out of stock";
  const rating = product.numRatings ? `${product.numRatings} ratings` : "No ratings yet";
  const care = product.care || (product.attributes && product.attributes.get && product.attributes.get("care")) || "Care info not specified";
  const material = product.material || (product.attributes && product.attributes.get && product.attributes.get("material")) || "Material not specified";

  const lines = [];
  lines.push(`${title}${brand ? " by " + brand : ""}`);
  if (price) lines.push(`Price: ${formatCurrencyINR(price)}${discount ? ` (Discount ${discount}%)` : ""}`);
  lines.push(`Material: ${material}`);
  lines.push(`Sizes: ${sizes}`);
  lines.push(`Colors: ${colors}`);
  lines.push(`Availability: ${availability}`);
  lines.push(`Care: ${care}`);
  lines.push(`Ratings: ${rating}`);

  if (product.description) {
    const desc = String(product.description).trim();
    const snippet = desc.length > 200 ? desc.slice(0, 197) + "..." : desc;
    lines.push(`About: ${snippet}`);
  }

  // return structured result with id too (so assistant can save for follow-ups)
  return { text: lines.join("\n"), productId: String(product._id) };
}
async function getProductsByCategoryName(name, limit = 10) {
  if (!name) return [];

  const regex = new RegExp(name.trim(), "i");

  const categories = await Category.find({ name: { $regex: regex } });

  if (!categories.length) return [];

  const catIds = categories.map(c => c._id);

  // Find products directly under these categories
  const products = await Product.find({ category: { $in: catIds } })
    .limit(limit)
    .populate({
      path: "category",
      populate: {
        path: "parentCategory",
        populate: { path: "parentCategory" },
      },
    });

  return products;
}


async function createProduct(req) {
  try {
    const reqData = req.body;

    // Parse size string to JSON array
    let sizes = reqData.size;
    if (typeof sizes === "string") sizes = JSON.parse(sizes);

    // Upload images to Cloudinary
    if (!req.files || req.files.length === 0) throw new Error("No images uploaded");

    const uploadResults = await Promise.all(
      req.files.map(file => {
        const base64Image = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
        return cloudinary.uploader.upload(base64Image, {
          folder: "ecommerce/products",
        });
      })
    );

    const imageUrls = uploadResults.map(result => result.secure_url);
    console.log("Uploaded image URLs:", imageUrls);

    // Handle category creation
    const topLevel = await Category.findOne({ name: reqData.topLevelCategory }) ||
      await new Category({ name: reqData.topLevelCategory, level: 1 }).save();

    const secondLevel = await Category.findOne({
      name: reqData.secondLevelCategory,
      parentCategory: topLevel._id,
    }) || await new Category({
      name: reqData.secondLevelCategory,
      parentCategory: topLevel._id,
      level: 2,
    }).save();

    const thirdLevel = await Category.findOne({
      name: reqData.thirdLevelCategory,
      parentCategory: secondLevel._id,
    }) || await new Category({
      name: reqData.thirdLevelCategory,
      parentCategory: secondLevel._id,
      level: 3,
    }).save();

    // Create and save product
    const product = new Product({
      title: reqData.title,
      description: reqData.description,
      discountedPrice: reqData.discountedPrice,
      discountPersent: reqData.discountPersent,
      imageUrl: imageUrls,
      brand: reqData.brand,
      price: reqData.price,
      sizes: sizes,
      quantity: reqData.quantity,
      color: reqData.color,
      category: thirdLevel._id,
    });

    return await product.save();

  } catch (error) {
    console.error("Create Product Error:", error);
    throw new Error(error.message || "Something went wrong");
  }
}

// Delete a product by ID
async function deleteProduct(productId) {
  const product = await findProductById(productId);

  if (!product) {
    throw new Error("product not found with id - : ", productId);
  }

  await Product.findByIdAndDelete(productId);

  return "Product deleted Successfully";
}

// Update a product by ID
async function updateProduct(productId, reqData) {
  const updatedProduct = await Product.findByIdAndUpdate(productId, reqData);
  return updatedProduct;
}

// Find a product by ID
async function findProductById(id) {
  const product = await Product.findById(id).populate("category").exec();

  if (!product) {
    throw new Error("Product not found with id " + id);
  }
  return product;
}

// Get all products with filtering and pagination
async function getAllProducts(reqQuery) {
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
  (pageSize = pageSize || 10), (pageNumber = pageNumber || 1);
  let query = Product.find().populate("category");


  if (category) {
    const existCategory = await Category.findOne({ name: category });
    if (existCategory)
      query = query.where("category").equals(existCategory._id);
    else return { content: [], currentPage: 1, totalPages:1 };
  }

  if (color) {
    const colorSet = new Set(color.split(",").map(color => color.trim().toLowerCase()));
    const colorRegex = colorSet.size > 0 ? new RegExp([...colorSet].join("|"), "i") : null;
    query = query.where("color").regex(colorRegex);
    // query = query.where("color").in([...colorSet]);
  }

  if (sizes) {
    const sizesSet = new Set(sizes);
    
    query = query.where("sizes.name").in([...sizesSet]);
  }

  if (minPrice && maxPrice) {
    query = query.where("discountedPrice").gte(minPrice).lte(maxPrice);
  }

  if (minDiscount) {
    query = query.where("discountPersent").gt(minDiscount);
  }

  if (stock) {
    if (stock === "in_stock") {
      query = query.where("quantity").gt(0);
    } else if (stock === "out_of_stock") {
      query = query.where("quantity").lte(0);
    }
  }

  if (sort) {
    const sortDirection = sort === "price_high" ? -1 : 1;
    query = query.sort({ discountedPrice: sortDirection });
  }

  // Apply pagination
  const totalProducts = await Product.countDocuments(query);

  const skip = (pageNumber - 1) * pageSize;

  query = query.skip(skip).limit(pageSize);

  const products = await query.exec();

  const totalPages = Math.ceil(totalProducts / pageSize);


  return { content: products, currentPage: pageNumber, totalPages:totalPages };
}

async function createMultipleProduct(products) {
  for (let product of products) {
    await createProduct(product);
  }
}



function normalizeText(text) {
  return text.trim().toLowerCase().replace(/s$/, ""); // removes plural 's' (basic plural support)
}

async function searchProducts(query) {
  const normalizedQuery = query.trim().toLowerCase();

  // Find matching categories (case-insensitive)
  const matchingCategories = await Category.find({
    name: { $regex: new RegExp(normalizedQuery, "i") },
  });

  const matchingCategoryIds = matchingCategories.map((cat) => cat._id);

  // Collect all child categories recursively
  const allCategoryIds = new Set(matchingCategoryIds.map(id => id.toString()));

  async function fetchChildCategories(parentIds) {
    const children = await Category.find({ parentCategory: { $in: parentIds } });
    for (const child of children) {
      allCategoryIds.add(child._id.toString());
    }
    if (children.length > 0) {
      await fetchChildCategories(children.map((c) => c._id));
    }
  }

  await fetchChildCategories(matchingCategoryIds);

  // Now find products in those categories
  const products = await Product.find({
    category: { $in: [...allCategoryIds] },
  }).populate({
    path: "category",
    populate: {
      path: "parentCategory",
      populate: {
        path: "parentCategory",
      },
    },
  });

  return products;
}


module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  getAllProducts,
  findProductById,
  createMultipleProduct,
  searchProducts,
    findBestProduct,
  getProductInfo,
  getProductsByCategoryName,
  resolveProductFromQuery
};
