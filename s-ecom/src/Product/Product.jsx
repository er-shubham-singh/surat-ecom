import React, { useState, useMemo } from 'react';
import { Star, StarOff, SlidersHorizontal, ChevronDown, X } from 'lucide-react';

const products = [
  // ... (same products array you provided) ...
  {
    id: 1,
    name: "Sitara | Metallic Eyeshadow Palette",
    price: 949,
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80",
    rating: 0,
    reviews: 0,
    category: "makeup",
    color: "multicolor",
    availability: "in-stock"
  },
  {
    id: 2,
    name: "Pop | Retractable Brush",
    price: 499,
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
    rating: 0,
    reviews: 0,
    category: "tools",
    color: "pink",
    availability: "in-stock"
  },
  {
    id: 3,
    name: "Glow Grats | Gift Box",
    price: 845,
    image: "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=800&q=80",
    rating: 0,
    reviews: 0,
    category: "sets",
    color: "red",
    availability: "in-stock"
  },
  {
    id: 4,
    name: "Glowfly | Liquid Highlighter",
    price: 399,
    image: "https://images.unsplash.com/photo-1596704017254-9b121068ec31?auto=format&fit=crop&w=800&q=80",
    rating: 5,
    reviews: 1,
    category: "makeup",
    color: "pink",
    availability: "in-stock",
    shades: ["Pearl", "Gold", "Bronze"]
  },
  {
    id: 5,
    name: "Velvet Matte Lipstick",
    price: 699,
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80",
    rating: 4,
    reviews: 12,
    category: "makeup",
    color: "red",
    availability: "in-stock"
  },
  {
    id: 6,
    name: "Radiant Glow Serum",
    price: 1299,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
    rating: 5,
    reviews: 8,
    category: "skincare",
    color: "white",
    availability: "in-stock"
  },
  {
    id: 7,
    name: "Silk Finish Foundation",
    price: 1599,
    image: "https://images.unsplash.com/photo-1631730486572-226d1f595b68?auto=format&fit=crop&w=800&q=80",
    rating: 4,
    reviews: 15,
    category: "makeup",
    color: "beige",
    availability: "in-stock"
  },
  {
    id: 8,
    name: "Volume Max Mascara",
    price: 549,
    image: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=800&q=80",
    rating: 5,
    reviews: 20,
    category: "makeup",
    color: "black",
    availability: "in-stock"
  },
  {
    id: 9,
    name: "Nude Perfection Palette",
    price: 1199,
    image: "https://images.unsplash.com/photo-1583241800698-d5c1f1c2d5b7?auto=format&fit=crop&w=800&q=80",
    rating: 5,
    reviews: 18,
    category: "makeup",
    color: "nude",
    availability: "in-stock"
  },
  {
    id: 10,
    name: "Hydra Boost Moisturizer",
    price: 899,
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80",
    rating: 4,
    reviews: 10,
    category: "skincare",
    color: "white",
    availability: "in-stock"
  },
  {
    id: 11,
    name: "Pearl Blush Duo",
    price: 749,
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80",
    rating: 5,
    reviews: 14,
    category: "makeup",
    color: "pink",
    availability: "in-stock"
  },
  {
    id: 12,
    name: "Luxe Makeup Brush Set",
    price: 1899,
    image: "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?auto=format&fit=crop&w=800&q=80",
    rating: 5,
    reviews: 25,
    category: "tools",
    color: "rose-gold",
    availability: "in-stock"
  },
  {
    id: 13,
    name: "Glitter Eye Gel",
    price: 599,
    image: "https://images.unsplash.com/photo-1614252369475-531eca835bf1?auto=format&fit=crop&w=800&q=80",
    rating: 4,
    reviews: 9,
    category: "makeup",
    color: "silver",
    availability: "low-stock"
  },
  {
    id: 14,
    name: "Beauty Sponge Set",
    price: 349,
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80",
    rating: 5,
    reviews: 30,
    category: "tools",
    color: "pink",
    availability: "in-stock"
  }
];

const ProductPage = () => {
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  // filters state - arrays for multi-select
  const [filters, setFilters] = useState({
    availability: [], // 'in-stock', 'low-stock'
    priceRange: [], // 'under-500', '500-1000', '1000-1500', 'above-1500'
    color: [], // color strings used in products
    category: [] // 'makeup', 'skincare', 'tools', etc.
  });

  // which filter accordion sections are open
  const [openSections, setOpenSections] = useState({
    availability: false,
    priceRange: false,
    color: false,
    category: false
  });

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const updateMultiFilter = (section, value) => {
    setFilters((prev) => {
      const setVals = new Set(prev[section]);
      if (setVals.has(value)) {
        setVals.delete(value);
      } else {
        setVals.add(value);
      }
      return { ...prev, [section]: Array.from(setVals) };
    });
  };

  const clearFilters = () => {
    setFilters({ availability: [], priceRange: [], color: [], category: [] });
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5 sm:gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= rating ? (
              <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-[#CBE600] text-[#CBE600]" />
            ) : (
              <StarOff className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300" />
            )}
          </span>
        ))}
      </div>
    );
  };

  // apply filters and sort
  const filteredProducts = useMemo(() => {
    let out = [...products];

    // availability
    if (filters.availability.length > 0) {
      out = out.filter((p) => filters.availability.includes(p.availability));
    }

    // priceRange
    if (filters.priceRange.length > 0) {
      out = out.filter((p) => {
        return filters.priceRange.some((range) => {
          if (range === "under-500") return p.price < 500;
          if (range === "500-1000") return p.price >= 500 && p.price <= 1000;
          if (range === "1000-1500") return p.price > 1000 && p.price <= 1500;
          if (range === "above-1500") return p.price > 1500;
          return true;
        });
      });
    }

    // color
    if (filters.color.length > 0) {
      out = out.filter((p) => filters.color.includes(p.color));
    }

    // category
    if (filters.category.length > 0) {
      out = out.filter((p) => filters.category.includes(p.category));
    }

    // sort
    if (sortBy === "price-low") out.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-high") out.sort((a, b) => b.price - a.price);
    else if (sortBy === "newest") out.sort((a, b) => b.id - a.id); // assuming id increasing = newer
    else if (sortBy === "best-selling") out.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
    // else keep featured (original order)

    return out;
  }, [filters, sortBy]);

  // color swatches mapping to CSS colors
  const colorMap = {
    pink: "#FFC0CB",
    red: "#E11D48",
    nude: "#E8C5B1",
    black: "#111827",
    white: "#F3F4F6",
    gold: "#D4AF37",
    "rose-gold": "#B76E79",
    multicolor: "linear-gradient(90deg,#ff7a7a,#ffd36e,#9ae66e)" // will be handled specially
  };

  return (
    <div className="min-h-screen bg-[#FFFDF6]">
      {/* Mobile Filter Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          showFilters ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setShowFilters(false)}
      />

      {/* Header */}
      <div className="bg-linear-to-r from-[#8A6F4F] to-[#6B5B4A] text-white py-8 sm:py-12 md:py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm mb-3 sm:mb-4 text-white/80">
            <span>Home</span>
            <span>/</span>
            <span>Products</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light mb-3 sm:mb-4">
            Our Collection
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl">
            Discover beauty essentials crafted for elegance
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`fixed lg:static top-0 left-0 h-full lg:h-auto w-80 max-w-[85vw] lg:w-64 xl:w-72 z-50 lg:z-auto transition-transform duration-300 lg:transition-none ${
              showFilters
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }`}
          >
            <div className="bg-white rounded-none lg:rounded-xl shadow-lg p-4 sm:p-5 md:p-6 lg:p-5 xl:p-6 lg:sticky lg:top-24 h-full lg:h-auto overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl lg:text-xl xl:text-2xl font-serif font-semibold text-[#8A6F4F]">
                  Filter by
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={clearFilters}
                    className="text-sm px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50 transition"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden p-2"
                    aria-label="Close filters"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Availability Filter */}
              <div className="mb-4 sm:mb-5 lg:mb-6 pb-4 sm:pb-5 lg:pb-6 border-b border-gray-200">
                <button
                  onClick={() => toggleSection("availability")}
                  className="flex items-center justify-between w-full mb-4 text-left"
                >
                  <h3 className="font-semibold text-[#222426]">Availability</h3>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transform transition-transform ${
                      openSections.availability ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                <div
                  className={`${
                    openSections.availability ? "block" : "hidden"
                  }`}
                >
                  <label className="flex items-center gap-3 cursor-pointer group mb-2">
                    <input
                      type="checkbox"
                      checked={filters.availability.includes("in-stock")}
                      onChange={() =>
                        updateMultiFilter("availability", "in-stock")
                      }
                      className="w-4 h-4 rounded border-gray-300 text-[#CBE600] focus:ring-[#CBE600]"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-[#8A6F4F] transition-colors">
                      In Stock (
                      {
                        products.filter((p) => p.availability === "in-stock")
                          .length
                      }
                      )
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.availability.includes("low-stock")}
                      onChange={() =>
                        updateMultiFilter("availability", "low-stock")
                      }
                      className="w-4 h-4 rounded border-gray-300 text-[#CBE600] focus:ring-[#CBE600]"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-[#8A6F4F] transition-colors">
                      Low Stock (
                      {
                        products.filter((p) => p.availability === "low-stock")
                          .length
                      }
                      )
                    </span>
                  </label>
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-4 sm:mb-5 lg:mb-6 pb-4 sm:pb-5 lg:pb-6 border-b border-gray-200">
                <button
                  onClick={() => toggleSection("priceRange")}
                  className="flex items-center justify-between w-full mb-4 text-left"
                >
                  <h3 className="font-semibold text-[#222426]">Price</h3>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transform transition-transform ${
                      openSections.priceRange ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                <div
                  className={`${openSections.priceRange ? "block" : "hidden"}`}
                >
                  <label className="flex items-center gap-3 cursor-pointer group mb-2">
                    <input
                      type="checkbox"
                      checked={filters.priceRange.includes("under-500")}
                      onChange={() =>
                        updateMultiFilter("priceRange", "under-500")
                      }
                      className="w-4 h-4 rounded border-gray-300 text-[#CBE600] focus:ring-[#CBE600]"
                    />
                    <span className="text-sm text-gray-700">Under ₹500</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group mb-2">
                    <input
                      type="checkbox"
                      checked={filters.priceRange.includes("500-1000")}
                      onChange={() =>
                        updateMultiFilter("priceRange", "500-1000")
                      }
                      className="w-4 h-4 rounded border-gray-300 text-[#CBE600] focus:ring-[#CBE600]"
                    />
                    <span className="text-sm text-gray-700">₹500 - ₹1000</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group mb-2">
                    <input
                      type="checkbox"
                      checked={filters.priceRange.includes("1000-1500")}
                      onChange={() =>
                        updateMultiFilter("priceRange", "1000-1500")
                      }
                      className="w-4 h-4 rounded border-gray-300 text-[#CBE600] focus:ring-[#CBE600]"
                    />
                    <span className="text-sm text-gray-700">₹1000 - ₹1500</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.priceRange.includes("above-1500")}
                      onChange={() =>
                        updateMultiFilter("priceRange", "above-1500")
                      }
                      className="w-4 h-4 rounded border-gray-300 text-[#CBE600] focus:ring-[#CBE600]"
                    />
                    <span className="text-sm text-gray-700">Above ₹1500</span>
                  </label>
                </div>
              </div>

              {/* Color Filter */}
              <div className="mb-4 sm:mb-5 lg:mb-6 pb-4 sm:pb-5 lg:pb-6 border-b border-gray-200">
                <button
                  onClick={() => toggleSection("color")}
                  className="flex items-center justify-between w-full mb-4 text-left"
                >
                  <h3 className="font-semibold text-[#222426]">Color</h3>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transform transition-transform ${
                      openSections.color ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                <div className={`${openSections.color ? "block" : "hidden"}`}>
                  <div className="flex flex-wrap gap-3">
                    {Object.keys(colorMap).map((colKey) => {
                      const selected = filters.color.includes(colKey);
                      const bgStyle =
                        colKey === "multicolor"
                          ? {
                              backgroundImage:
                                "linear-gradient(90deg,#ff7a7a,#ffd36e,#9ae66e)",
                            }
                          : { backgroundColor: colorMap[colKey] || "#fff" };

                      return (
                        <button
                          key={colKey}
                          onClick={() => updateMultiFilter("color", colKey)}
                          title={colKey}
                          className={`w-10 h-10 rounded-full border-2 ${
                            selected
                              ? "border-[#8A6F4F] scale-110"
                              : "border-gray-200"
                          } transform transition-all`}
                          style={bgStyle}
                          aria-pressed={selected}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Product Type Filter */}
              <div>
                <button
                  onClick={() => toggleSection("category")}
                  className="flex items-center justify-between w-full mb-4 text-left"
                >
                  <h3 className="font-semibold text-[#222426]">Product Type</h3>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transform transition-transform ${
                      openSections.category ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                <div
                  className={`${openSections.category ? "block" : "hidden"}`}
                >
                  {["makeup", "skincare", "tools", "sets"].map((cat) => (
                    <label
                      key={cat}
                      className="flex items-center gap-3 cursor-pointer group mb-2"
                    >
                      <input
                        type="checkbox"
                        checked={filters.category.includes(cat)}
                        onChange={() => updateMultiFilter("category", cat)}
                        className="w-4 h-4 rounded border-gray-300 text-[#CBE600] focus:ring-[#CBE600]"
                      />
                      <span className="text-sm text-gray-700 capitalize">
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {/* Sort and Filter Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-6 lg:mb-8 bg-white rounded-lg sm:rounded-xl shadow-md p-3 sm:p-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-3 sm:px-4 py-2 border-2 border-[#8A6F4F] text-[#8A6F4F] text-sm rounded-lg hover:bg-[#8A6F4F] hover:text-white transition-all duration-300"
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span>Filters</span>
              </button>

              <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-[#8A6F4F]" />
                  <span className="text-xs sm:text-sm font-medium text-[#222426]">
                    Sort by:
                  </span>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 border-2 border-gray-200 rounded-lg text-xs sm:text-sm font-medium text-[#222426] focus:border-[#CBE600] focus:outline-none focus:ring-2 focus:ring-[#CBE600]/20 transition-all flex-1 sm:flex-initial"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                  <option value="best-selling">Best Selling</option>
                </select>
              </div>

              <div className="text-xs sm:text-sm text-gray-600 w-full sm:w-auto text-center sm:text-left">
                <span className="font-semibold text-[#8A6F4F]">
                  {filteredProducts.length}
                </span>{" "}
                products
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-5 xl:gap-6">
              {filteredProducts.map((product) => (
                <article
                  key={product.id}
                  className="group bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-lg border-2 border-transparent hover:border-[#DFF200] transition-all duration-500 hover:shadow-2xl sm:hover:-translate-y-2 flex flex-col h-full"
                >
                  <div className="relative overflow-hidden bg-gray-100 aspect-square">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {product.availability === "low-stock" && (
                      <span className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                        Low Stock
                      </span>
                    )}
                  </div>

                  {/* CONTENT SECTION — flex column so button sticks to bottom */}
                  <div className="p-3 sm:p-4 md:p-4 lg:p-4 xl:p-5 flex flex-col grow">
                    <h3 className="text-xs sm:text-sm md:text-base font-semibold text-[#222426] mb-2 group-hover:text-[#CBE600] transition-colors duration-300 line-clamp-2">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                      {renderStars(product.rating)}
                      {product.reviews > 0 ? (
                        <span className="text-[10px] sm:text-xs text-gray-500">
                          {product.reviews === 1
                            ? "1 review"
                            : `${product.reviews} reviews`}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">No review</span>
                      )}
                    </div>

                    <div className="mb-2 sm:mb-3 md:mb-4">
                      <span className="text-base sm:text-lg md:text-xl font-bold text-[#8A6F4F]">
                        Rs. {product.price}
                      </span>
                    </div>

                    {product.shades && (
                      <div className="flex gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                        {product.shades.map((shade, idx) => (
                          <div
                            key={idx}
                            className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full border-2 border-gray-300 hover:border-[#CBE600] transition-all cursor-pointer"
                            style={{
                              backgroundColor:
                                shade === "Pearl"
                                  ? "#FFC0CB"
                                  : shade === "Gold"
                                  ? "#FFD700"
                                  : "#CD7F32",
                            }}
                            title={shade}
                          />
                        ))}
                      </div>
                    )}

                    {/* BUTTON ALWAYS AT BOTTOM */}
                    <button className="mt-auto w-full py-2 sm:py-2.5 md:py-3 px-2 sm:px-3 md:px-4 bg-black text-white text-[10px] sm:text-xs md:text-sm font-semibold rounded-lg hover:bg-[#DFF200] hover:text-black transition-all duration-300 uppercase tracking-wide">
                      {product.shades ? "Select Shades" : "Add to bag"}
                    </button>
                  </div>
                </article>
              ))}

              {filteredProducts.length === 0 && (
                <div className="col-span-full text-center py-16 text-gray-500">
                  No products match the selected filters.
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
