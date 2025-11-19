// ProductDetailsPage.jsx
import React, { useEffect, useState } from "react";
import {
  Star,
  StarOff,
  Heart,
  Share2,
  ShoppingBag,
  Truck,
  RefreshCw,
  Shield,
  ChevronLeft,
  ChevronRight,
  Check,
  Minus,
  Plus,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

// <-- adjust these paths to your project structure
import { findProductById } from "../redux/Product/Action";
import { addItemToCart, getCart } from "../redux/Cart/Action";
import { getAllReviews, getRatingSummary } from "../redux/Review/Action";

const ProductDetailsPage = () => {
  // UI / local state
  const [loginAlert, setLoginAlert] = useState(false);
  const [sizeChart, setSizeChart] = useState([]);
  // selectedSize will store the size NAME (e.g., "M", "L")
  const [selectedSize, setSelectedSize] = useState(null); 
  const [selectedImage, setSelectedImage] = useState(0); // index
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [isLoading, setIsLoading] = useState(true);
  const [sizeError, setSizeError] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { productId } = useParams();
  const jwt = localStorage.getItem("jwt");

  // Redux slices
const { customersProduct, review } = useSelector((store) => store);  // customersProduct.product should contain the product object from your reducer
const product = customersProduct?.product || {}; 

  // reviews slice: adapt to your shape (this follows your prior code)
  const reviewsList = Array.isArray(review?.reviews?.reviews)
    ? review.reviews.reviews
    : [];

  // summary (ratingSummary)
  const ratingSummary = review?.ratingSummary || {};

  // Data Mapping based on new backend structure
  // 1. Image URLs: Use 'imageUrl' field from backend
  const productImages = Array.isArray(product?.imageUrl) 
    ? product.imageUrl 
    : Array.isArray(product?.images) 
      ? product.images 
      : [];

  const relatedProducts =
    customersProduct?.products?.content?.slice(0, 4) || []; // fallback

  // set initial selected image when product loads
  useEffect(() => {
    if (productImages.length > 0) {
      setSelectedImage(0);
      setIsLoading(false);
    } else {
      // if product exists but no images yet, stop loading
      if (Object.keys(product).length > 0) setIsLoading(false);
    }
  }, [productImages, product]);

  // load product & reviews & rating summary
  useEffect(() => {
    if (!productId) return;
    const data = { productId, jwt };
    dispatch(findProductById(data));
    dispatch(getAllReviews(productId));
    dispatch(getRatingSummary(productId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);


  // helper: JWT expiry check
  const isJwtExpired = (token) => {
    if (!token) return true;
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; // seconds
      return decoded.exp && decoded.exp < currentTime;
    } catch (e) {
      return true;
    }
  };

  // Add to cart handler
  const handleSubmit = async (e) => {
    e && e.preventDefault && e.preventDefault();

    if (!jwt || jwt === "undefined" || isJwtExpired(jwt)) {
      setLoginAlert(true);
      return;
    }

    // Check if selectedSize is valid for products with sizes
    if (Array.isArray(product?.sizes) && product.sizes.length > 0 && !selectedSize) {
      setSizeError(true);
      return;
    }

    // Check if the selected size has stock
    if (selectedSize) {
      const selectedSizeData = product?.sizes?.find(s => s.name === selectedSize);
      if (selectedSizeData?.quantity === 0) {
        setSizeError(true); // Size selected is out of stock
        return;
      }
    }

    setSizeError(false);
    setIsAdding(true);

    try {
      await dispatch(
        addItemToCart({
          data: { productId, size: selectedSize, quantity },
          jwt,
        })
      );

      // refresh cart and navigate
      await dispatch(getCart(jwt));
      navigate("/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      // if backend tells us jwt expired
      if (error.response?.data?.error === "jwt expired") {
        setLoginAlert(true);
      }
    } finally {
      setIsAdding(false);
    }
  };

  // share action
  const handleShare = async () => {
    const shareData = {
      title: product?.title || product?.name || "Product",
      text: "Check out this product!",
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Product link copied to clipboard!");
      }
    } catch (err) {
      console.error("Sharing failed", err);
    }
  };


  // render stars (preserve appearance)
  const renderStars = (rating = 0) => {
    // Use ratings field from backend data
    const avgRating = (Array.isArray(product?.ratings) && product.ratings.length > 0)
      ? product.ratings.reduce((sum, r) => sum + r.rating, 0) / product.ratings.length
      : product?.numRatings > 0 ? product.ratings[0].rating : 0; // Fallback or assume simple rating 
    
    // Since the example data had ratings: [], we'll use a hardcoded 0 until real data comes.
    const finalRating = product?.ratings?.length > 0 ? avgRating : 0; 
    
    const rounded = Math.round(finalRating || 0);

    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= rounded ? (
              <Star className="w-4 h-4 fill-[#CBE600] text-[#CBE600]" />
            ) : (
              <StarOff className="w-4 h-4 text-gray-300" />
            )}
          </span>
        ))}
      </div>
    );
  };

  // UI loader while initial fetch
//   if (isLoading) {
//     return (
//       <Backdrop
//         open
//         sx={{
//           zIndex: (theme) => theme.zIndex.drawer + 1,
//           color: "#fff",
//         }}
//       >
//         <CircularProgress color="inherit" />
//         <span className="ml-3 text-white text-lg font-medium">Loading Product...</span>
//       </Backdrop>
//     );
//   }
  
  // ----------------------------------------------------
  // 🔥 Data Mapping and Calculation for JSX RENDERING
  // ----------------------------------------------------

  

  const displayImage = productImages[selectedImage] || productImages[0] || "";
  
  // Use 'title' for product name
  const productName = product?.title || product?.name || "Product"; 
  // Use '_id' for SKU
  const productSku = product?._id || "-"; 

  // Price Mapping
  const currentPrice = product?.discountedPrice; // 10
  const originalPrice = product?.price; // 100

  // Discount Calculation
  const isDiscounted = originalPrice > currentPrice;
  const discountAmount = isDiscounted ? originalPrice - currentPrice : 0;
  const discountPercent = isDiscounted 
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) 
    : null;

  // Stock Calculation
  const totalStock = product?.sizes?.reduce((sum, size) => sum + (size?.quantity || 0), 0) || 0;
  
  // Color Mapping: Transform simple string array to object array for the picker logic
  const mappedColors = product?.color?.map(name => ({ 
    name, 
    // Simple mapping, you might need a more comprehensive color map in a real app
    hex: name === 'white' ? '#ffffff' : name === 'black' ? '#000000' : '#808080' 
  })) || [];



  return (
    <div className="min-h-screen bg-[#FFFDF6]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 py-3 sm:py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 overflow-x-auto">
            <a href="/" className="hover:text-[#8A6F4F] transition-colors whitespace-nowrap">
              Home
            </a>
            <span>/</span>
            <a href="/products" className="hover:text-[#8A6F4F] transition-colors whitespace-nowrap">
              Products
            </a>
            <span>/</span>
            <span className="text-[#8A6F4F] font-medium truncate">{productName}</span> {/* Use productName (title) */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 xl:py-12">
        {/* Product Main Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 xl:gap-12 mb-8 sm:mb-12 xl:mb-16">
          {/* Image Gallery */}
          <div className="space-y-3 sm:space-y-4">
            <div className="relative bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-xl aspect-square group">
              <img
                src={displayImage}
                alt={productName}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <button
                onClick={() =>
                  setSelectedImage((prev) =>
                    prev === 0 ? Math.max(0, productImages.length - 1) : prev - 1
                  )
                }
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-[#DFF200] transition-all duration-300 hover:scale-110"
                aria-label="previous image"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={() =>
                  setSelectedImage((prev) =>
                    prev === productImages.length - 1 ? 0 : Math.min(productImages.length - 1, prev + 1)
                  )
                }
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-[#DFF200] transition-all duration-300 hover:scale-110"
                aria-label="next image"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Discount Badge */}
              {discountPercent !== null && discountPercent > 0 && (
                <div className="absolute top-3 sm:top-6 left-3 sm:left-6 px-3 py-1.5 sm:px-4 sm:py-2 bg-red-500 text-white font-bold text-xs sm:text-sm rounded-full shadow-lg">
                  {discountPercent}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative bg-white rounded-lg overflow-hidden aspect-square border-2 transition-all duration-300 ${
                    selectedImage === idx ? "border-[#CBE600] shadow-lg scale-105" : "border-gray-200 hover:border-[#DFF200]"
                  }`}
                  aria-label={`thumbnail-${idx}`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-3 md:space-y-4 xl:space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-semibold text-[#222426] mb-2 sm:mb-3">
                {productName} {/* Use 'title' field */}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                <div className="flex items-center gap-2">
                  {renderStars(product?.numRatings)} {/* Use numRatings for rendering */}
                  <span className="text-xs sm:text-sm text-gray-600">({product?.numRatings || 0} reviews)</span> {/* Use numRatings for count */}
                </div>
                <span className="text-xs sm:text-sm text-[#CBE600] font-semibold">
                  {totalStock > 0 ? "In Stock" : "Sold Out"} {/* Use totalStock */}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500">SKU: {productSku}</p> {/* Use '_id' field */}
            </div>

            {/* Price */}
            <div className="flex flex-wrap items-baseline gap-2 sm:gap-4 pb-4 sm:pb-6 border-b border-gray-200">
              {/* Display discountedPrice as the main price */}
              <span className="text-3xl sm:text-4xl font-bold text-[#8A6F4F]">Rs. {currentPrice ?? "-"}</span>
              {isDiscounted && (
                <>
                  {/* Display price as the original price */}
                  <span className="text-xl sm:text-2xl text-gray-400 line-through">Rs. {originalPrice}</span>
                  <span className="px-2 sm:px-3 py-1 bg-red-100 text-red-600 text-xs sm:text-sm font-semibold rounded-full">
                    Save Rs. {discountAmount}
                  </span>
                </>
              )}
            </div>

            {/* Color Selection */}
            {mappedColors.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-[#222426] mb-2 sm:mb-3">
                  Color: <span className="text-[#8A6F4F]">{selectedColor || mappedColors[0].name}</span>
                </label>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {mappedColors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
                        selectedColor === color.name ? "border-[#CBE600] shadow-lg scale-110" : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color.hex || "#fff" }}
                      title={color.name}
                    >
                      {selectedColor === color.name && (
                        <Check className="w-5 h-5 sm:w-6 sm:h-6 text-black absolute inset-0 m-auto drop-shadow-lg" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
<form onSubmit={handleSubmit}>

                {Array.isArray(product?.sizes) && product.sizes.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-[#222426] mb-2 sm:mb-3">Size</label>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size.name}
                      onClick={() => {
                        if (size.quantity > 0) { // Only allow selection if in stock
                          setSelectedSize(size.name);
                          setSizeError(false);
                        }
                      }}
                      disabled={size.quantity === 0} // Disable if out of stock
                      className={`w-14 h-10 sm:w-16 sm:h-12 rounded-lg border-2 font-semibold transition-all duration-300 ${
                        selectedSize === size.name 
                          ? "border-[#CBE600] bg-[#CBE600] text-white shadow-lg" 
                          : size.quantity === 0
                            ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed line-through" // Style for sold out
                            : "border-gray-300 bg-white text-gray-700 hover:border-[#DFF200]"
                      }`}
                    >
                      {size.name} {/* Use 'name' property of size object */}
                    </button>
                  ))}
                </div>
                {sizeError && <p className="text-sm text-red-500 mt-2">Please select a size or selected size is out of stock.</p>}
              </div>
            )}
</form>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold text-[#222426] mb-2 sm:mb-3">Quantity</label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 sm:w-16 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs sm:text-sm text-gray-600">
                  Only {totalStock} items left in stock! {/* Use totalStock */}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
              <button
                onClick={handleSubmit}
                disabled={isAdding || totalStock === 0} // Disable if out of stock
                className="flex-1 py-3 sm:py-4 px-4 sm:px-6 bg-[#CBE600] text-white font-bold text-base sm:text-lg rounded-xl hover:bg-[#DFF200] hover:text-black transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 shadow-lg hover:shadow-2xl hover:-translate-y-1 uppercase tracking-wide"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                {totalStock === 0 ? "Out of Stock" : isAdding ? "Adding..." : "Add to Cart"}
              </button>

              <div className="flex gap-3 sm:gap-4">
                <button
                  onClick={() => setIsFavorite((v) => !v)}
                  className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl border-2 flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                    isFavorite ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
                  }`}
                >
                  <Heart className={`w-5 h-5 sm:w-6 sm:h-6 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                </button>

                <button
                  onClick={handleShare}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl border-2 border-gray-300 bg-white flex items-center justify-center hover:border-[#CBE600] hover:bg-[#CBE600]/10 transition-all duration-300 hover:scale-110"
                  aria-label="share"
                >
                  <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Buy Now Button */}
            <button
              onClick={() => navigate(`/checkout?productId=${productId}&size=${encodeURIComponent(selectedSize || "")}&qty=${quantity}`)}
              disabled={totalStock === 0} // Disable if out of stock
              className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-black text-white font-bold text-base sm:text-lg rounded-xl hover:bg-[#8A6F4F] transition-all duration-300 shadow-lg uppercase tracking-wide disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              Buy Now
            </button>

            {/* Features */}
            <div className="grid grid-cols-3 gap-2 md:gap-3 xl:gap-4 pt-4 sm:pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-1.5 sm:mb-2 bg-[#CBE600]/10 rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5 md:w-6 md:h-6 text-[#8A6F4F]" />
                </div>
                <p className="text-xs font-semibold text-gray-700">Free Shipping</p>
                <p className="text-xs text-gray-500 hidden lg:block">On orders over ₹999</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-1.5 sm:mb-2 bg-[#CBE600]/10 rounded-full flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 md:w-6 md:h-6 text-[#8A6F4F]" />
                </div>
                <p className="text-xs font-semibold text-gray-700">Easy Returns</p>
                <p className="text-xs text-gray-500 hidden lg:block">30-day return policy</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-1.5 sm:mb-2 bg-[#CBE600]/10 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 md:w-6 md:h-6 text-[#8A6F4F]" />
                </div>
                <p className="text-xs font-semibold text-gray-700">Secure Payment</p>
                <p className="text-xs text-gray-500 hidden lg:block">100% protected</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12 lg:mb-16">
          <div className="border-b border-gray-200 mb-6 sm:mb-8">
            <div className="flex gap-4 sm:gap-8 overflow-x-auto">
              {["description", "ingredients", "how-to-use", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 sm:pb-4 px-1 sm:px-2 font-semibold capitalize transition-all duration-300 whitespace-nowrap text-sm sm:text-base ${
                    activeTab === tab ? "text-[#8A6F4F] border-b-2 border-[#CBE600]" : "text-gray-500 hover:text-[#8A6F4F]"
                  }`}
                >
                  {tab.replace("-", " ")}
                </button>
              ))}
          </div>
          </div>

          {activeTab === "description" && (
            <div className="space-y-4 sm:space-y-6">
              <p className="text-gray-700 leading-relaxed text-sm md:text-base lg:text-lg">{product?.description}</p> {/* Use 'description' field */}
              {Array.isArray(product?.features) && (
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-[#222426] mb-3 sm:mb-4">Key Features:</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 sm:gap-3">
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#CBE600] flex-shrink-0 mt-0.5" />
                        <span className="text-sm sm:text-base text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === "ingredients" && (
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-[#222426] mb-3 sm:mb-4">Ingredients:</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{product?.ingredients}</p>
            </div>
          )}

          {activeTab === "how-to-use" && (
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-[#222426] mb-3 sm:mb-4">How to Use:</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{product?.howToUse}</p>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-4 sm:mb-6">
                <div>
                  <div className="flex items-center gap-3 sm:gap-4 mb-2">
                    <span className="text-3xl sm:text-4xl font-bold text-[#8A6F4F]">
                      {(product?.numRatings || 0).toFixed(1)} {/* Use numRatings, though it's the count, assume it's the average rating display */}
                    </span>
                    <div>
                      {renderStars(product?.numRatings)}
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">Based on {product?.numRatings || 0} reviews</p> {/* Use numRatings for count */}
                    </div>
                  </div>
                </div>
                <button className="px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-[#8A6F4F] text-[#8A6F4F] rounded-lg hover:bg-[#8A6F4F] hover:text-white transition-all duration-300 font-semibold text-sm sm:text-base w-full sm:w-auto">
                  Write a Review
                </button>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {/* Use 'reviews' field from the review slice (assuming it populates with backend data) */}
                {(showAll ? reviewsList : reviewsList.slice(0, 5)).map((r) => (
                  <div key={r.id || r._id} className="border-b border-gray-200 pb-4 sm:pb-6 last:border-0">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-0 mb-2 sm:mb-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                          <span className="font-semibold text-[#222426] text-sm sm:text-base">{r.author || r.name || "User"}</span>
                          {r.verified && (
                            <span className="px-2 py-1 bg-[#CBE600]/10 text-[#8A6F4F] text-xs font-semibold rounded">Verified Purchase</span>
                          )}
                        </div>
                        {renderStars(r.rating)}
                      </div>
                      <span className="text-xs sm:text-sm text-gray-500">{new Date(r.date || r.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{r.comment || r.text}</p>
                  </div>
                ))}

                {reviewsList.length > 5 && (
                  <button onClick={() => setShowAll((s) => !s)} className="text-sm text-[#8A6F4F] underline">
                    {showAll ? "Show less" : `Show all ${reviewsList.length} reviews`}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        <div>
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-semibold text-[#8A6F4F] mb-2 sm:mb-4">
              You May Also Like
            </h2>
            <p className="text-sm sm:text-base text-gray-600">Complete your beauty collection with these essentials</p>
          </div>

          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 xl:gap-6">
            {relatedProducts.map((item) => (
              <article key={item._id || item.id} className="group bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-lg border-2 border-transparent hover:border-[#DFF200] transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                <div className="relative overflow-hidden bg-gray-100 aspect-square">
                  {/* Use imageURL field for related products if available */}
                  <img src={item.imageUrl?.[0] || item.image || item.images?.[0]} alt={item.title || item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="p-3 sm:p-5">
                  <h3 className="text-sm sm:text-base font-semibold text-[#222426] mb-1.5 sm:mb-2 group-hover:text-[#CBE600] transition-colors duration-300 line-clamp-2">
                    {item.title || item.name}
                  </h3>
                  <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                    {renderStars(item.numRatings || item.rating)}
                  </div>
                  <div className="mb-3 sm:mb-4">
                    {/* Use discountedPrice if available for related items */}
                    <span className="text-lg sm:text-xl font-bold text-[#8A6F4F]">Rs. {item.discountedPrice || item.price}</span>
                  </div>
                  <button className="w-full py-2 sm:py-3 px-3 sm:px-4 bg-black text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-[#CBE600] hover:text-black transition-all duration-300 uppercase tracking-wide">
                    Add to bag
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;