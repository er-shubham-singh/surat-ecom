// // ProductPage.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import {
//   Star,
//   StarOff,
//   SlidersHorizontal,
//   ChevronDown,
//   X,
// } from "lucide-react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { findProducts } from "../redux/product/action";
// import {
//   filters as FILTERS_CONFIG,
//   singleFilter,
//   sortOptions as SORT_OPTIONS,
// } from "./FilterData"; // adjust path if needed

// const ProductPage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const param = useParams();

//   // Redux state
//   const { customersProduct } = useSelector((store) => store);
//   const products = customersProduct?.products?.content || [];
//   const loading = customersProduct?.loading || false;
//   const totalPages = customersProduct?.products?.totalPages || 1;
//   const currentPage = customersProduct?.products?.currentPage || 1;

//   // local UI state
//   const [sortBy, setSortBy] = useState("featured");
//   const [showFilters, setShowFilters] = useState(false);

//   // IMPORTANT: default to CLOSED for every section (category removed)
//   const [openSections, setOpenSections] = useState(() => {
//     const keys = {};
//     FILTERS_CONFIG.forEach((f) => (keys[f.id] = false));
//     singleFilter.forEach((f) => (keys[f.id] = false));
//     return keys;
//   });

//   // UI checkboxes/radios (kept in sync with URL params)
//   const [filtersUI, setFiltersUI] = useState({});

//   // parse URL search params
//   const decodedQueryString = decodeURIComponent(location.search || "");
//   const searchParams = new URLSearchParams(decodedQueryString);

//   const colorParam = searchParams.get("color");
//   const sizeParam = searchParams.get("size");
//   const priceParam = searchParams.get("price");
//   const disccoutLegacy = searchParams.get("disccout");
//   const discountParam = searchParams.get("discount");
//   const discountParamValue = discountParam || disccoutLegacy || null;
//   const sortValue = searchParams.get("sort");
//   const pageNumber = searchParams.get("page") || "1";
//   const stockParam = searchParams.get("stock");
//   // categoryParam removed

//   // sync filtersUI with query params so UI checkboxes persist
//   useEffect(() => {
//     const newUI = {};

//     // multi-value from FILTERS_CONFIG (color, size, etc.)
//     FILTERS_CONFIG.forEach((section) => {
//       const val = searchParams.get(section.id);
//       newUI[section.id] = val ? val.split(",") : [];
//     });

//     // singleFilter entries (could be radio or single selection)
//     singleFilter.forEach((section) => {
//       const val = searchParams.get(section.id);
//       newUI[section.id] = val ? val.split(",") : [];
//     });

//     setFiltersUI(newUI);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [location.search]);

//   // Build server request payload when relevant params change
//   useEffect(() => {
//     // parse price -> minPrice / maxPrice
//     let [minPrice, maxPrice] = [0, 0];
//     if (priceParam) {
//       const parts = priceParam.split("-").map((p) => Number(p) || 0);
//       if (parts.length === 2) {
//         [minPrice, maxPrice] = parts;
//       } else {
//         minPrice = parts[0] || 0;
//       }
//     }

//     // category removed from payload; route-based category still possible if your backend expects it.
//     const categoryFromRoute = param.lavelThree || param.lavelTwo || null;

//     const data = {
//       // if your API supports category via route use categoryFromRoute, otherwise omit
//       category: categoryFromRoute,
//       colors: colorParam ? colorParam.split(",") : [],
//       sizes: sizeParam ? sizeParam.split(",") : [],
//       minPrice: minPrice || 0,
//       maxPrice: maxPrice || 10000,
//       minDiscount: discountParamValue ? Number(discountParamValue) : 0,
//       sort: sortValue || "price_low",
//       pageNumber: Number(pageNumber) || 1,
//       pageSize: 10,
//       stock: stockParam || null,
//     };

//     dispatch(findProducts(data));
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [
//     param.lavelTwo,
//     param.lavelThree,
//     colorParam,
//     sizeParam,
//     priceParam,
//     discountParamValue,
//     sortValue,
//     pageNumber,
//     stockParam,
//   ]);

//   // loader UI
//   const [isLoaderOpen, setIsLoaderOpen] = useState(false);
//   useEffect(() => setIsLoaderOpen(loading), [loading]);

//   // helper: toggle accordion sections
//   const toggleSection = (id) => {
//     setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
//   };

//   // Clear all filters
//   const clearFilters = () => {
//     navigate({ search: "" });
//   };

//   // update multi-value filter (checkbox behavior) and reflect in URL
//   const updateMultiFilter = (sectionId, value) => {
//     const sp = new URLSearchParams(location.search);
//     const existing = sp.get(sectionId);
//     let values = existing ? existing.split(",") : [];

//     if (values.includes(value)) {
//       values = values.filter((v) => v !== value);
//     } else {
//       values.push(value);
//     }

//     if (values.length === 0) sp.delete(sectionId);
//     else sp.set(sectionId, values.join(","));

//     // reset page when filters change
//     sp.set("page", "1");

//     navigate({ search: `?${sp.toString()}` });
//   };

//   // set a single-value filter (radio-like)
//   const setSingleFilter = (sectionId, value) => {
//     const sp = new URLSearchParams(location.search);
//     if (!value) sp.delete(sectionId);
//     else sp.set(sectionId, value);
//     sp.set("page", "1");
//     navigate({ search: `?${sp.toString()}` });
//   };

//   // handle sort change: update URL "sort" param
//   const handleSortChange = (value) => {
//     const sp = new URLSearchParams(location.search);
//     sp.set("sort", value);
//     sp.set("page", "1");
//     navigate({ search: `?${sp.toString()}` });
//     setSortBy(value);
//   };

//   // pagination handler
//   const handlePaginationChange = (event, value) => {
//     const sp = new URLSearchParams(location.search);
//     sp.set("page", value);
//     navigate({ search: `?${sp.toString()}` });
//   };

//   // small rating renderer
//   const renderStars = (rating = 0) => {
//     const stars = [];
//     const rounded = Math.round(rating || 0);
//     for (let i = 1; i <= 5; i += 1) {
//       if (i <= rounded)
//         stars.push(<Star key={i} className="w-3.5 h-3.5 text-yellow-400" />);
//       else stars.push(<StarOff key={i} className="w-3.5 h-3.5 text-gray-300" />);
//     }
//     return <div className="flex items-center gap-0.5">{stars}</div>;
//   };

//   // Helper: create mapping for color value -> colorCode from config
//   const colorSection = FILTERS_CONFIG.find((s) => s.id === "color") || {};
//   const colorOptions = colorSection.options || [];

//   // Client-side "fallback" sorting (useful when server returns unsorted)
//   const filteredProducts = useMemo(() => {
//     const list = [...products];

//     switch (sortBy) {
//       case "price-low":
//       case "price_low":
//         return list.sort((a, b) => (a.price || 0) - (b.price || 0));
//       case "price-high":
//       case "price_high":
//         return list.sort((a, b) => (b.price || 0) - (a.price || 0));
//       case "newest":
//         return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//       case "best-selling":
//         return list.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
//       default:
//         return list;
//     }
//   }, [products, sortBy]);

//   // utility to compute count of products matching option (normalizes underscore/dash)
//   const countForOption = (optionValue, productField = "availability") => {
//     const normalize = (s) => (String(s || "").toLowerCase().replace(/_/g, "-"));
//     const target = normalize(optionValue);
//     return products.filter((p) => {
//       const v = normalize(p[productField] || p[productField.replace(/-/g, "_")] || "");
//       return v === target;
//     }).length;
//   };

//   return (
//     <div className="min-h-screen bg-[#FFFDF6]">
//       {/* Mobile overlay */}
//       <div
//         className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
//           showFilters ? "opacity-100 visible" : "opacity-0 invisible"
//         }`}
//         onClick={() => setShowFilters(false)}
//       />

//       {/* Header */}
//       <div className="bg-linear-to-r from-[#8A6F4F] to-[#6B5B4A] text-white py-8 sm:py-12 md:py-16 px-4 sm:px-6">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm mb-3 sm:mb-4 text-white/80">
//             <span>Home</span>
//             <span>/</span>
//             <span>Products</span>
//           </div>
//           <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light mb-3 sm:mb-4">
//             Our Collection
//           </h1>
//           <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl">
//             Discover beauty essentials crafted for elegance
//           </p>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
//         <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
//           {/* Sidebar */}
//           <aside
//             className={`fixed lg:static top-0 left-0 h-full lg:h-auto w-80 max-w-[85vw] lg:w-64 xl:w-72 z-50 lg:z-auto transition-transform duration-300 lg:transition-none ${
//               showFilters ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
//             }`}
//           >
//             <div className="bg-white rounded-none lg:rounded-xl shadow-lg p-4 sm:p-5 md:p-6 lg:p-5 xl:p-6 lg:sticky lg:top-24 h-full lg:h-auto overflow-y-auto">
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-xl sm:text-2xl lg:text-xl xl:text-2xl font-serif font-semibold text-[#8A6F4F]">
//                   Filter by
//                 </h2>
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={clearFilters}
//                     className="text-sm px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50 transition"
//                   >
//                     Clear
//                   </button>
//                   <button
//                     onClick={() => setShowFilters(false)}
//                     className="lg:hidden p-2"
//                     aria-label="Close filters"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>

//               {/* Dynamic FILTERS_CONFIG (e.g., color, size) */}
//               {FILTERS_CONFIG.map((section) => (
//                 <div
//                   key={section.id}
//                   className="mb-4 sm:mb-5 lg:mb-6 pb-4 sm:pb-5 lg:pb-6 border-b border-gray-200"
//                 >
//                   <button
//                     onClick={() => toggleSection(section.id)}
//                     className="flex items-center justify-between w-full mb-4 text-left"
//                   >
//                     <h3 className="font-semibold text-[#222426]">{section.name}</h3>
//                     <ChevronDown
//                       className={`w-5 h-5 text-gray-400 transform transition-transform ${
//                         openSections[section.id] ? "rotate-180" : "rotate-0"
//                       }`}
//                     />
//                   </button>

//                   <div className={`${openSections[section.id] ? "block" : "hidden"}`}>
//                     {/* special case: color -> render swatches */}
//                     {section.id === "color" ? (
//                       <div className="flex flex-wrap gap-3">
//                         {section.options.map((opt) => {
//                           const selected = (filtersUI.color || []).includes(opt.value);
//                           const isGradient =
//                             typeof opt.colorCode === "string" &&
//                             opt.colorCode.startsWith("linear-gradient");
//                           const bgStyle = isGradient
//                             ? { backgroundImage: opt.colorCode }
//                             : { backgroundColor: opt.colorCode || "#fff" };

//                           return (
//                             <button
//                               key={opt.value}
//                               onClick={() => updateMultiFilter("color", opt.value)}
//                               title={opt.label}
//                               className={`w-10 h-10 rounded-full border-2 ${
//                                 selected ? "border-[#8A6F4F] scale-110" : "border-gray-200"
//                               } transform transition-all`}
//                               style={bgStyle}
//                               aria-pressed={selected}
//                             />
//                           );
//                         })}
//                       </div>
//                     ) : (
//                       // generic checkboxes for other sections (size, etc.)
//                       <div>
//                         {section.options.map((opt) => (
//                           <label
//                             key={opt.value}
//                             className="flex items-center gap-3 cursor-pointer group mb-2"
//                           >
//                             <input
//                               type="checkbox"
//                               checked={(filtersUI[section.id] || []).includes(opt.value)}
//                               onChange={() => updateMultiFilter(section.id, opt.value)}
//                               className="w-4 h-4 rounded border-gray-300 text-[#CBE600] focus:ring-[#CBE600]"
//                             />
//                             <span className="text-sm text-gray-700 capitalize">{opt.label}</span>
//                             {/* Show counts for availability-like sections if product data exists */}
//                             {section.id === "availability" && (
//                               <span className="text-xs text-gray-400 ml-auto">
//                                 {countForOption(opt.value)}
//                               </span>
//                             )}
//                           </label>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}

//               {/* Single filters section (price ranges, discount, stock) */}
//               {singleFilter.map((section) => (
//                 <div
//                   key={section.id}
//                   className="mb-4 sm:mb-5 lg:mb-6 pb-4 sm:pb-5 lg:pb-6 border-b border-gray-200"
//                 >
//                   <button
//                     onClick={() => toggleSection(section.id)}
//                     className="flex items-center justify-between w-full mb-4 text-left"
//                   >
//                     <h3 className="font-semibold text-[#222426]">{section.name}</h3>
//                     <ChevronDown
//                       className={`w-5 h-5 text-gray-400 transform transition-transform ${
//                         openSections[section.id] ? "rotate-180" : "rotate-0"
//                       }`}
//                     />
//                   </button>

//                   <div className={`${openSections[section.id] ? "block" : "hidden"}`}>
//                     {section.options.map((opt) => (
//                       <label key={opt.value} className="flex items-center gap-3 cursor-pointer group mb-2">
//                         <input
//                           type="checkbox"
//                           checked={(filtersUI[section.id] || []).includes(opt.value)}
//                           onChange={() => updateMultiFilter(section.id, opt.value)}
//                           className="w-4 h-4 rounded border-gray-300 text-[#CBE600] focus:ring-[#CBE600]"
//                         />
//                         <span className="text-sm text-gray-700">{opt.label}</span>
//                       </label>
//                     ))}
//                   </div>
//                 </div>
//               ))}

//             </div>
//           </aside>

//           {/* Main content */}
//           <main className="flex-1">
//             {/* Sort & filter bar */}
//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-6 lg:mb-8 bg-white rounded-lg sm:rounded-xl shadow-md p-3 sm:p-4">
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="lg:hidden flex items-center gap-2 px-3 sm:px-4 py-2 border-2 border-[#8A6F4F] text-[#8A6F4F] text-sm rounded-lg hover:bg-[#8A6F4F] hover:text-white transition-all duration-300"
//               >
//                 <SlidersHorizontal className="w-5 h-5" />
//                 <span>Filters</span>
//               </button>

//               <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
//                 <div className="flex items-center gap-2">
//                   <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-[#8A6F4F]" />
//                   <span className="text-xs sm:text-sm font-medium text-[#222426]">Sort by:</span>
//                 </div>
//                 <select
//                   value={sortValue || sortBy}
//                   onChange={(e) => handleSortChange(e.target.value)}
//                   className="px-3 sm:px-4 py-1.5 sm:py-2 border-2 border-gray-200 rounded-lg text-xs sm:text-sm font-medium text-[#222426] focus:border-[#CBE600] focus:outline-none focus:ring-2 focus:ring-[#CBE600]/20 transition-all flex-1 sm:flex-initial"
//                 >
//                   <option value="featured">Featured</option>
//                   <option value="price_low">Price: Low to High</option>
//                   <option value="price_high">Price: High to Low</option>
//                   <option value="newest">Newest</option>
//                   <option value="best_selling">Best Selling</option>
//                 </select>
//               </div>

//               <div className="text-xs sm:text-sm text-gray-600 w-full sm:w-auto text-center sm:text-left">
//                 <span className="font-semibold text-[#8A6F4F]">{filteredProducts.length}</span> products
//               </div>
//             </div>

//             {/* Products grid */}
//             <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-5 xl:gap-6">
//               {filteredProducts.map((product) => (
//                 <article
//                   key={product._id || product.id}
//                   onClick={() => navigate(`/product/${product?._id || product.id}`)}
//                   className="group bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-lg border-2 border-transparent hover:border-[#DFF200] transition-all duration-500 hover:shadow-2xl sm:hover:-translate-y-2 flex flex-col h-full cursor-pointer"
//                 >
//                   <div className="relative overflow-hidden bg-gray-100 aspect-square">
//                     <img
//                       src={product.image || (product.imageUrl && product.imageUrl[0])}
//                       alt={product.title || product.name}
//                       className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//                     />
//                     <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

//                     {String(product.availability || "").toLowerCase().includes("low") && (
//                       <span className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">Low Stock</span>
//                     )}
//                   </div>

//                   <div className="p-3 sm:p-4 md:p-4 lg:p-4 xl:p-5 flex flex-col grow">
//                     <h3 className="text-xs sm:text-sm md:text-base font-semibold text-[#222426] mb-2 group-hover:text-[#CBE600] transition-colors duration-300 line-clamp-2">
//                       {product.title || product.name}
//                     </h3>

//                     <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
//                       {renderStars(product.rating)}
//                       {product.reviews > 0 ? (
//                         <span className="text-[10px] sm:text-xs text-gray-500">
//                           {product.reviews === 1 ? "1 review" : `${product.reviews} reviews`}
//                         </span>
//                       ) : (
//                         <span className="text-xs text-gray-400">No review</span>
//                       )}
//                     </div>

//                     <div className="mb-2 sm:mb-3 md:mb-4">
//                       <span className="text-base sm:text-lg md:text-xl font-bold text-[#8A6F4F]">Rs. {product.price}</span>
//                     </div>

//                     {product.shades && (
//                       <div className="flex gap-1.5 sm:gap-2 mb-3 sm:mb-4">
//                         {product.shades.map((shade, idx) => (
//                           <div
//                             key={idx}
//                             className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full border-2 border-gray-300 hover:border-[#CBE600] transition-all cursor-pointer"
//                             style={{
//                               backgroundColor:
//                                 shade === "Pearl" ? "#FFC0CB" : shade === "Gold" ? "#FFD700" : "#CD7F32",
//                             }}
//                             title={shade}
//                           />
//                         ))}
//                       </div>
//                     )}

//                     <button className="mt-auto w-full py-2 sm:py-2.5 md:py-3 px-2 sm:px-3 md:px-4 bg-black text-white text-[10px] sm:text-xs md:text-sm font-semibold rounded-lg hover:bg-[#DFF200] hover:text-black transition-all duration-300 uppercase tracking-wide">
//                       {product.shades ? "Select Shades" : "Add to bag"}
//                     </button>
//                   </div>
//                 </article>
//               ))}

//               {filteredProducts.length === 0 && !loading && (
//                 <div className="col-span-full text-center py-16 text-gray-500">No products match the selected filters.</div>
//               )}
//             </div>

//             {/* Pagination */}
//             <div className="mt-6 flex items-center justify-center gap-3">
//               <button
//                 onClick={(e) => handlePaginationChange(e, Math.max(1, Number(currentPage) - 1))}
//                 disabled={Number(currentPage) <= 1}
//                 className="px-3 py-1 border rounded disabled:opacity-50"
//               >
//                 Prev
//               </button>
//               <span className="text-sm">Page {currentPage} of {totalPages}</span>
//               <button
//                 onClick={(e) => handlePaginationChange(e, Math.min(totalPages, Number(currentPage) + 1))}
//                 disabled={Number(currentPage) >= Number(totalPages)}
//                 className="px-3 py-1 border rounded disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductPage;

// ProductPage.jsx// ProductPage.jsx// ProductPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Star,
  StarOff,
  SlidersHorizontal,
  ChevronDown,
  X,
  Info,
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { findProducts } from "../redux/product/action";
import {
  filters as FILTERS_CONFIG,
  singleFilter,
  sortOptions as SORT_OPTIONS,
} from "./FilterData"; // adjust path if needed

const ProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const param = useParams();

  // Redux state
  const { customersProduct } = useSelector((store) => store);
  const products = customersProduct?.products?.content || [];

  const loading = customersProduct?.loading || false;
  const totalPages = customersProduct?.products?.totalPages || 1;
  const currentPage = customersProduct?.products?.currentPage || 1;

  // local UI state
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  // IMPORTANT: default to CLOSED for every section (category removed)
  const [openSections, setOpenSections] = useState(() => {
    const keys = {};
    FILTERS_CONFIG.forEach((f) => (keys[f.id] = false));
    singleFilter.forEach((f) => (keys[f.id] = false));
    return keys;
  });

  // UI checkboxes/radios (kept in sync with URL params)
  const [filtersUI, setFiltersUI] = useState({});

  // parse URL search params
  const decodedQueryString = decodeURIComponent(location.search || "");
  const searchParams = new URLSearchParams(decodedQueryString);

  const colorParam = searchParams.get("color");
  const sizeParam = searchParams.get("size");
  const priceParam = searchParams.get("price");
  const disccoutLegacy = searchParams.get("disccout");
  const discountParam = searchParams.get("discount");
  const discountParamValue = discountParam || disccoutLegacy || null;
  const sortValue = searchParams.get("sort");
  const pageNumber = searchParams.get("page") || "1";
  const stockParam = searchParams.get("stock");

  // derive selected category (route OR query)
  const selectedCategory =
    (param && (param.lavelThree || param.lavelTwo)) ||
    searchParams.get("category") ||
    null;

  // sync filtersUI with query params so UI checkboxes persist
  useEffect(() => {
    const newUI = {};

    FILTERS_CONFIG.forEach((section) => {
      const val = searchParams.get(section.id);
      newUI[section.id] = val ? val.split(",") : [];
    });

    singleFilter.forEach((section) => {
      const val = searchParams.get(section.id);
      newUI[section.id] = val ? val.split(",") : [];
    });

    setFiltersUI(newUI);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // Build server request payload when relevant params change
  useEffect(() => {
    let [minPrice, maxPrice] = [0, 0];
    if (priceParam) {
      const parts = priceParam.split("-").map((p) => Number(p) || 0);
      if (parts.length === 2) {
        [minPrice, maxPrice] = parts;
      } else {
        minPrice = parts[0] || 0;
      }
    }

    const categoryFromRoute = param.lavelThree || param.lavelTwo || null;

    const data = {
      category: categoryFromRoute,
      colors: colorParam ? colorParam.split(",") : [],
      sizes: sizeParam ? sizeParam.split(",") : [],
      minPrice: minPrice || 0,
      maxPrice: maxPrice || 10000,
      minDiscount: discountParamValue ? Number(discountParamValue) : 0,
      sort: sortValue || "price_low",
      pageNumber: Number(pageNumber) || 1,
      pageSize: 10,
      stock: stockParam || null,
    };

    dispatch(findProducts(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    param.lavelTwo,
    param.lavelThree,
    colorParam,
    sizeParam,
    priceParam,
    discountParamValue,
    sortValue,
    pageNumber,
    stockParam,
  ]);

  // loader UI
  const [isLoaderOpen, setIsLoaderOpen] = useState(false);
  useEffect(() => setIsLoaderOpen(loading), [loading]);

  // helper: toggle accordion sections
  const toggleSection = (id) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Clear all filters
  const clearFilters = () => {
    navigate({ search: "" });
  };

  // update multi-value filter (checkbox behavior) and reflect in URL
  const updateMultiFilter = (sectionId, value) => {
    const sp = new URLSearchParams(location.search);
    const existing = sp.get(sectionId);
    let values = existing ? existing.split(",") : [];

    if (values.includes(value)) {
      values = values.filter((v) => v !== value);
    } else {
      values.push(value);
    }

    if (values.length === 0) sp.delete(sectionId);
    else sp.set(sectionId, values.join(","));

    sp.set("page", "1");

    navigate({ search: `?${sp.toString()}` });
  };

  // set a single-value filter (radio-like)
  const setSingleFilter = (sectionId, value) => {
    const sp = new URLSearchParams(location.search);
    if (!value) sp.delete(sectionId);
    else sp.set(sectionId, value);
    sp.set("page", "1");
    navigate({ search: `?${sp.toString()}` });
  };

  // handle sort change: update URL "sort" param
  const handleSortChange = (value) => {
    const sp = new URLSearchParams(location.search);
    sp.set("sort", value);
    sp.set("page", "1");
    navigate({ search: `?${sp.toString()}` });
    setSortBy(value);
  };

  // pagination handler
  const handlePaginationChange = (event, value) => {
    const sp = new URLSearchParams(location.search);
    sp.set("page", value);
    navigate({ search: `?${sp.toString()}` });
  };

  // small rating renderer
  const renderStars = (rating = 0) => {
    const stars = [];
    const rounded = Math.round(rating || 0);
    for (let i = 1; i <= 5; i += 1) {
      if (i <= rounded)
        stars.push(<Star key={i} className="w-3.5 h-3.5 text-yellow-400" />);
      else
        stars.push(<StarOff key={i} className="w-3.5 h-3.5 text-gray-300" />);
    }
    return <div className="flex items-center gap-0.5">{stars}</div>;
  };

  // Helper: create mapping for color value -> colorCode from config
  const colorSection = FILTERS_CONFIG.find((s) => s.id === "color") || {};
  const colorOptions = colorSection.options || [];

  // Client-side "fallback" sorting (useful when server returns unsorted)
  const filteredProducts = useMemo(() => {
    const list = [...products];

    switch (sortBy) {
      case "price-low":
      case "price_low":
        return list.sort((a, b) => (a.price || 0) - (b.price || 0));
      case "price-high":
      case "price_high":
        return list.sort((a, b) => (b.price || 0) - (a.price || 0));
      case "newest":
        return list.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "best-selling":
        return list.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
      default:
        return list;
    }
  }, [products, sortBy]);

  // utility to compute count of products matching option (normalizes underscore/dash)
  const countForOption = (optionValue, productField = "availability") => {
    const normalize = (s) =>
      String(s || "")
        .toLowerCase()
        .replace(/_/g, "-");
    const target = normalize(optionValue);
    return products.filter((p) => {
      const v = normalize(
        p[productField] || p[productField.replace(/-/g, "_")] || ""
      );
      return v === target;
    }).length;
  };

  return (
    <div className="min-h-screen bg-[#FFFDF6]">
      {/* Mobile overlay */}
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
          {/* Sidebar */}
          <aside
            className={`fixed lg:static top-0 left-0 h-full lg:h-auto w-80 max-w-[85vw] lg:w-64 xl:w-72 z-50 lg:z-auto transition-transform duration-300 lg:transition-none ${
              showFilters
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }`}
            data-aos="fade-right"
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

              {/* Dynamic FILTERS_CONFIG (e.g., color, size) */}
              {FILTERS_CONFIG.map((section) => (
                <div
                  key={section.id}
                  className="mb-4 sm:mb-5 lg:mb-6 pb-4 sm:pb-5 lg:pb-6 border-b border-gray-200"
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="flex items-center justify-between w-full mb-4 text-left"
                  >
                    <h3 className="font-semibold text-[#222426]">
                      {section.name}
                    </h3>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transform transition-transform ${
                        openSections[section.id] ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>

                  <div
                    className={`${
                      openSections[section.id] ? "block" : "hidden"
                    }`}
                  >
                    {/* special case: color -> render swatches */}
                    {section.id === "color" ? (
                      <div className="flex flex-wrap gap-3">
                        {section.options.map((opt) => {
                          const selected = (filtersUI.color || []).includes(
                            opt.value
                          );
                          const isGradient =
                            typeof opt.colorCode === "string" &&
                            opt.colorCode.startsWith("linear-gradient");
                          const bgStyle = isGradient
                            ? { backgroundImage: opt.colorCode }
                            : { backgroundColor: opt.colorCode || "#fff" };

                          return (
                            <button
                              key={opt.value}
                              onClick={() =>
                                updateMultiFilter("color", opt.value)
                              }
                              title={opt.label}
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
                    ) : (
                      // generic checkboxes for other sections (size, etc.)
                      <div>
                        {section.options.map((opt) => (
                          <label
                            key={opt.value}
                            className="flex items-center gap-3 cursor-pointer group mb-2"
                          >
                            <input
                              type="checkbox"
                              checked={(filtersUI[section.id] || []).includes(
                                opt.value
                              )}
                              onChange={() =>
                                updateMultiFilter(section.id, opt.value)
                              }
                              className="w-4 h-4 rounded border-gray-300 text-[#CBE600] focus:ring-[#CBE600]"
                            />
                            <span className="text-sm text-gray-700 capitalize">
                              {opt.label}
                            </span>
                            {section.id === "availability" && (
                              <span className="text-xs text-gray-400 ml-auto">
                                {countForOption(opt.value)}
                              </span>
                            )}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Single filters section (price ranges, discount, stock) */}
              {singleFilter.map((section) => (
                <div
                  key={section.id}
                  className="mb-4 sm:mb-5 lg:mb-6 pb-4 sm:pb-5 lg:pb-6 border-b border-gray-200"
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="flex items-center justify-between w-full mb-4 text-left"
                  >
                    <h3 className="font-semibold text-[#222426]">
                      {section.name}
                    </h3>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transform transition-transform ${
                        openSections[section.id] ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>

                  <div
                    className={`${
                      openSections[section.id] ? "block" : "hidden"
                    }`}
                  >
                    {section.options.map((opt) => (
                      <label
                        key={opt.value}
                        className="flex items-center gap-3 cursor-pointer group mb-2"
                      >
                        <input
                          type="checkbox"
                          checked={(filtersUI[section.id] || []).includes(
                            opt.value
                          )}
                          onChange={() =>
                            updateMultiFilter(section.id, opt.value)
                          }
                          className="w-4 h-4 rounded border-gray-300 text-[#CBE600] focus:ring-[#CBE600]"
                        />
                        <span className="text-sm text-gray-700">
                          {opt.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            {/* Sort & filter bar */}
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
                  value={sortValue || sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 border-2 border-gray-200 rounded-lg text-xs sm:text-sm font-medium text-[#222426] focus:border-[#CBE600] focus:outline-none focus:ring-2 focus:ring-[#CBE600]/20 transition-all flex-1 sm:flex-initial"
                >
                  <option value="featured">Featured</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                  <option value="best_selling">Best Selling</option>
                </select>
              </div>

              <div className="text-xs sm:text-sm text-gray-600 w-full sm:w-auto text-center sm:text-left">
                <span className="font-semibold text-[#8A6F4F]">
                  {filteredProducts.length}
                </span>{" "}
                products
              </div>
            </div>

            {/* Products grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-5 xl:gap-6">
              {filteredProducts.map((product) => {
                // parse price numbers (works for "₹1,299", "1299", or number)
                const parseNumber = (v) => {
                  if (v === undefined || v === null) return 0;
                  if (typeof v === "number") return v;
                  const num = Number(String(v).replace(/[^0-9.-]/g, ""));
                  return Number.isNaN(num) ? 0 : num;
                };

                // robust extractors for rating and reviews (works with many backend shapes)
                const ratingVal =
                  product.averageRating ??
                  product.avgRating ??
                  product.rating ??
                  product.ratingSummary?.averageRating ??
                  product.ratingSummary?.average ??
                  product.ratings?.average ??
                  0;

                const reviewsCountRaw =
                  (typeof product.reviews === "number"
                    ? product.reviews
                    : undefined) ??
                  product.reviewCount ??
                  product.reviewsCount ??
                  product.totalReviews ??
                  (Array.isArray(product.reviews)
                    ? product.reviews.length
                    : undefined) ??
                  product.ratingSummary?.totalRatings ??
                  product.ratings?.total ??
                  0;

                const ratingNumber = Number(ratingVal) || 0;
                const reviewsNumber = Number(reviewsCountRaw) || 0;

                // Determine current (selling) price and original (MRP) price from common fields
                const currentPriceRaw =
                  product.discountedPrice ??
                  product.discounted_price ??
                  product.discountPrice ??
                  product.sellingPrice ??
                  product.selling_price ??
                  product.price ??
                  0;

                const originalPriceRaw =
                  product.originalPrice ??
                  product.original_price ??
                  product.mrp ??
                  product.price ??
                  currentPriceRaw;

                const priceNum = parseNumber(currentPriceRaw);
                const originalNum = parseNumber(originalPriceRaw);
                const isDiscounted = originalNum > 0 && originalNum > priceNum;
                const discountAmount = isDiscounted
                  ? originalNum - priceNum
                  : 0;
                const discountPercent = isDiscounted
                  ? Math.round(((originalNum - priceNum) / originalNum) * 100)
                  : 0;

                // format for display
                const fmt = (n) =>
                  `₹${(Number(n) || 0).toLocaleString("en-IN")}`;

                return (
                  <article
                    key={product._id || product.id}
                    onClick={() =>
                      navigate(`/product/${product?._id || product.id}`)
                    }
                    className="group bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-lg border-2 border-transparent hover:border-[#DFF200] transition-all duration-500 hover:shadow-2xl sm:hover:-translate-y-2 flex flex-col h-full cursor-pointer"
                    data-aos="fade-up"
                  >
                    <div className="relative overflow-hidden bg-gray-100 aspect-square">
                      <img
                        src={
                          product.image ||
                          (product.imageUrl && product.imageUrl[0])
                        }
                        alt={product.title || product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Low stock indicator */}
                      {String(product.availability || "")
                        .toLowerCase()
                        .includes("low") && (
                        <span className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                          Low Stock
                        </span>
                      )}

                      {/* Discount percent badge (new) */}
                      {discountPercent > 0 && (
                        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
                          {discountPercent}% OFF
                        </div>
                      )}
                    </div>

                    <div className="p-3 sm:p-4 md:p-4 lg:p-4 xl:p-5 flex flex-col grow">
                      <h3 className="text-xs sm:text-sm md:text-base font-semibold text-[#222426] mb-2 group-hover:text-[#CBE600] transition-colors duration-300 line-clamp-2">
                        {product.title || product.name}
                      </h3>

                      <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                        {renderStars(ratingNumber)}
                        {reviewsNumber > 0 ? (
                          <span className="text-[10px] sm:text-xs text-gray-500">
                            {reviewsNumber === 1
                              ? "1 review"
                              : `${reviewsNumber} reviews`}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">
                            No review
                          </span>
                        )}
                      </div>

                      {/* Price block — uses your requested layout */}
                      <div className="flex flex-wrap items-baseline gap-2 sm:gap-4 pb-4 sm:pb-6 border-b border-gray-200">
                        <span className="text-3xl sm:text-4xl font-bold text-[#8A6F4F]">
                          {fmt(priceNum)}
                        </span>
                        {isDiscounted && (
                          <>
                            <span className="text-xl sm:text-2xl text-gray-400 line-through">
                              {fmt(originalNum)}
                            </span>
                            <span className="px-2 sm:px-3 py-1 bg-red-100 text-red-600 text-xs sm:text-sm font-semibold rounded-full">
                              Save {fmt(discountAmount)}
                            </span>
                          </>
                        )}
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

                      <button className="mt-auto w-full py-2 sm:py-2.5 md:py-3 px-2 sm:px-3 md:px-4 bg-black text-white text-[10px] sm:text-xs md:text-sm font-semibold rounded-lg hover:bg-[#DFF200] hover:text-black transition-all duration-300 uppercase tracking-wide">
                        {product.shades ? "Select Shades" : "Add to bag"}
                      </button>
                    </div>
                  </article>
                );
              })}

              {/* If no products AND not loading */}
              {filteredProducts.length === 0 &&
                !loading &&
                (selectedCategory ? (
                  <div className="col-span-full flex flex-col items-center justify-center gap-6 py-20 text-center">
                    <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#F3F7EE]">
                      <Info className="w-10 h-10 text-[#8A6F4F]" />
                    </div>
                    <h2 className="text-2xl font-semibold text-[#222426]">
                      We're expanding this category
                    </h2>
                    <p className="text-gray-600 max-w-xl">
                      We don't have products in{" "}
                      <span className="font-medium text-[#8A6F4F]">
                        {selectedCategory}
                      </span>{" "}
                      yet — but we're working on it. New items will be added
                      soon. In the meantime, you can browse similar products or
                      request a notification when this category is live.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate("/")}
                        className="px-5 py-2 bg-[#8A6F4F] text-white rounded-md hover:opacity-95 transition"
                      >
                        Browse similar products
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(
                            `We'll notify you when products for "${selectedCategory}" are available.`
                          );
                        }}
                        className="px-5 py-2 bg-white text-[#8A6F4F] border border-[#8A6F4F] rounded-md hover:bg-[#F8FFF2] transition"
                      >
                        Notify me
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="col-span-full text-center py-16 text-gray-500">
                    No products match the selected filters.
                  </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={(e) =>
                  handlePaginationChange(
                    e,
                    Math.max(1, Number(currentPage) - 1)
                  )
                }
                disabled={Number(currentPage) <= 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={(e) =>
                  handlePaginationChange(
                    e,
                    Math.min(totalPages, Number(currentPage) + 1)
                  )
                }
                disabled={Number(currentPage) >= Number(totalPages)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
