// ProductDetailsPage.jsx
import React, { useEffect, useState } from "react";
import { Star, StarOff, Heart, Share2, ShoppingBag, Truck, RefreshCw, Shield, ChevronLeft, ChevronRight, Check, Minus, Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {jwtDecode} from "jwt-decode";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Typography,Stack,Avatar, Box, Grid, LinearProgress, Rating, Button, IconButton, Tooltip, Snackbar, Alert } from "@mui/material";
import { RadioGroup } from "@headlessui/react";

// <-- adjust these paths to your project structure if necessary
import { findProductById } from "../redux/product/action";
import { addItemToCart, getCart } from "../redux/Cart/Action";
import { getAllReviews, getRatingSummary } from "../redux/Review/Action";
import ProductReviewCard from "./ProductReviewCard";


const ProductDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productId } = useParams();
  const baseUrl = import.meta.env.VITE_React_BASE_API_URL;

  // redux slices (expected shapes like in your other components)
  const { customersProduct, review } = useSelector((s) => s);
  const product = customersProduct?.product || {};
console.log("product details....", review)
  // local UI state (kept similar to reference)
  const [loginAlert, setLoginAlert] = useState(false);
  const [sizeChart, setSizeChart] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null); // stores size name (e.g., "M")
  const [selectedImage, setSelectedImage] = useState(0); // index of image
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [isLoading, setIsLoading] = useState(true);
  const [sizeError, setSizeError] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const jwt = typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
// Derive reviews array (backend returns review.reviews.reviews in your console)
const reviewsList =
  // shape: review.reviews.reviews (your console output)
  Array.isArray(review?.reviews?.reviews)
    ? review.reviews.reviews
    // shape: review.reviews (sometimes backend returns array directly)
    : Array.isArray(review?.reviews)
      ? review.reviews
      : [];

// ratingSummary sits under review.reviews.ratingSummary (per console)
const ratingSummary =
  review?.reviews?.ratingSummary ||
  review?.ratingSummary ||
  review?.ratings?.ratingSummary ||
  {};


  // images array (fallbacks)
  const productImages = Array.isArray(product?.imageUrl)
    ? product.imageUrl
    : Array.isArray(product?.images)
      ? product.images
      : [];

  // set initial image and hide loader when product images arrive
  useEffect(() => {
    if (productImages.length > 0) {
      setSelectedImage(0);
      setIsLoading(false);
    } else if (Object.keys(product || {}).length > 0) {
      // product loaded but no images
      setIsLoading(false);
    }
  }, [productImages, product]);

  // fetch product, reviews, rating summary on mount / productId change
  useEffect(() => {
    const data = { productId: productId, jwt };
    dispatch(findProductById(data));
    dispatch(getAllReviews(productId));
    dispatch(getRatingSummary(productId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  // fetch size chart based on product category (like your reference)
  useEffect(() => {
    const fetchSizeChart = async () => {
      try {
        const categoryName = customersProduct?.product?.category?.name;
        if (!categoryName) return;
        const res = await fetch(`${baseUrl}/api/admin/products/${categoryName}`);
        const data = await res.json();
        setSizeChart(data.sizes || []);
      } catch (err) {
        console.error("Failed to fetch size chart", err);
      }
    };
    fetchSizeChart();
  }, [customersProduct?.product?.category?.name, baseUrl]);

  // utility: JWT expiry check
  const isJwtExpired = (token) => {
    if (!token) return true;
    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      return decoded.exp && decoded.exp < now;
    } catch (e) {
      return true;
    }
  };

  // Add to cart handler (keeps same flow & validation as reference)
// top of file already imports: addItemToCart, getCart
const handleSubmit = async (e) => {
  e.preventDefault();

  // validate login
  if (!jwt || jwt === "undefined" || isJwtExpired(jwt)) {
    setLoginAlert(true);
    return;
  }

  // validate size
  if (!selectedSize || !selectedSize.name) {
    setSizeError(true);
    return;
  }

  setSizeError(false);
  setIsAdding(true);

  try {
    // Ensure cart exists (server create-if-missing lives in getCart service)
    await dispatch(getCart(jwt));

    // Now add item
    const payload = {
      data: {
        productId,
        size: selectedSize.name,
      },
      jwt,
    };

    await dispatch(addItemToCart(payload));

    // refresh cart to pick up latest server state
    await dispatch(getCart(jwt));

    navigate("/cart");
  } catch (error) {
    console.error("Error adding to cart:", error);

    // If server says token expired
    if (error.response?.data?.error === "jwt expired" || error.response?.status === 401) {
      setLoginAlert(true);
    } else {
      // show a toast/snackbar or console error
      // optional: set an error state and show message to user
    }
  } finally {
    setIsAdding(false);
  }
};


  // share handler (web share or clipboard)
  const handleShare = async () => {
    const shareData = {
      title: product?.title || product?.name || "Product",
      text: `Check out ${product?.title || ""} on Fluteon`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        // fallback alert
        window.alert("Product link copied to clipboard!");
      }
    } catch (err) {
      console.error("Share failed", err);
    }
  };

  // helper to render stars similar to reference (uses average from ratingSummary if present)
const renderStars = (ratingVal = 0) => {
  const avg = ratingSummary?.averageRating || ratingVal || 0;
    const rounded = Math.round(avg || 0);
    return (
      <div className="flex gap-1">
        {[1,2,3,4,5].map((n) =>
          n <= rounded ? (
            <Star key={n} className="w-4 h-4 text-[#CBE600]" />
          ) : (
            <StarOff key={n} className="w-4 h-4 text-gray-300" />
          )
        )}
      </div>
    );
  };

  // derived values (price, discount, stock)
  const displayImage = productImages[selectedImage] || productImages[0] || "";
  const productName = product?.title || product?.name || "Product";
  const productSku = product?._id || "-";
  const currentPrice = product?.discountedPrice ?? product?.price ?? 0;
  const originalPrice = product?.price ?? currentPrice;
  const isDiscounted = originalPrice > currentPrice;
  const discountAmount = isDiscounted ? originalPrice - currentPrice : 0;
  const discountPercent = isDiscounted ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;
  const totalStock = (Array.isArray(product?.sizes) ? product.sizes.reduce((s, it) => s + (it.quantity || 0), 0) : (product?.quantity || 0)) || 0;
  const mappedColors = Array.isArray(product?.color) ? product.color.map((c) => ({ name: c, hex: c === 'white' ? '#fff' : c === 'black' ? '#000' : '#808080' })) : [];

  // loading state
  if (isLoading) {
    return (
      <Backdrop open sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: "#fff" }}>
        <CircularProgress color="inherit" />
        <span className="ml-3 text-white text-lg font-medium">Loading Product...</span>
      </Backdrop>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF6]">

      {/* Floating share on md+ */}
      <Tooltip title="Share Product" arrow>
        <IconButton
          onClick={handleShare}
          sx={{
            position: 'fixed',
            top: '50%',
            right: '20px',
            zIndex: 1000,
            backgroundColor: '#fff',
            boxShadow: 3,
            border: '1px solid #ccc',
            '&:hover': { backgroundColor: '#f1f1f1' },
            display: { xs: 'none', sm: 'none', md: 'flex' },
          }}
        >
          <Share2 />
        </IconButton>
      </Tooltip>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 py-3 sm:py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 overflow-x-auto">
            <a href="/" className="hover:text-[#8A6F4F] transition-colors whitespace-nowrap">Home</a>
            <span>/</span>
            <a href="/products" className="hover:text-[#8A6F4F] transition-colors whitespace-nowrap">Products</a>
            <span>/</span>
            <span className="text-[#8A6F4F] font-medium truncate">{productName}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 xl:py-12">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 xl:gap-12 mb-8 sm:mb-12 xl:mb-16">
          {/* Image gallery */}
          <div className="space-y-3 sm:space-y-4">
            <div className="relative bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-xl aspect-square group">
              <img src={displayImage} alt={productName} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <button
                onClick={() => setSelectedImage((p) => (p === 0 ? Math.max(0, productImages.length - 1) : p - 1))}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-[#DFF200] transition-all duration-300 hover:scale-110"
                aria-label="previous image"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={() => setSelectedImage((p) => (p === productImages.length - 1 ? 0 : Math.min(productImages.length - 1, p + 1)))}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-[#DFF200] transition-all duration-300 hover:scale-110"
                aria-label="next image"
              >
                <ChevronRight />
              </button>

              {discountPercent > 0 && (
                <div className="absolute top-3 sm:top-6 left-3 sm:left-6 px-3 py-1.5 bg-red-500 text-white font-bold text-xs sm:text-sm rounded-full shadow-lg">
                  {discountPercent}% OFF
                </div>
              )}

              {/* small share button over image */}
              <Tooltip title="Share Product" arrow>
                <IconButton
                  onClick={handleShare}
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    zIndex: 10,
                    backgroundColor: "white",
                    padding: "6px",
                    boxShadow: 1,
                    "&:hover": { backgroundColor: "#f3f3f3" },
                  }}
                >
                  <Share2 fontSize="small" />
                </IconButton>
              </Tooltip>
            </div>

            {/* thumbnails */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative bg-white rounded-lg overflow-hidden aspect-square border-2 transition-all duration-300 ${selectedImage === idx ? "border-[#CBE600] shadow-lg scale-105" : "border-gray-200 hover:border-[#DFF200]"}`}
                  aria-label={`thumbnail-${idx}`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product info */}
          <div className="space-y-3 md:space-y-4 xl:space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-semibold text-[#222426] mb-2 sm:mb-3">{productName}</h1>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                <div className="flex items-center gap-2">
                  {renderStars()}
                  <span className="text-xs sm:text-sm text-gray-600">({ratingSummary.totalRatings || 0} reviews)</span>
                </div>
                <span className="text-xs sm:text-sm text-[#CBE600] font-semibold">{totalStock > 0 ? "In Stock" : "Sold Out"}</span>
              </div>

              <p className="text-xs sm:text-sm text-gray-500">SKU: {productSku}</p>
            </div>

            {/* price */}
            <div className="flex flex-wrap items-baseline gap-2 sm:gap-4 pb-4 sm:pb-6 border-b border-gray-200">
              <span className="text-3xl sm:text-4xl font-bold text-[#8A6F4F]">₹{currentPrice}</span>
              {isDiscounted && (
                <>
                  <span className="text-xl sm:text-2xl text-gray-400 line-through">₹{originalPrice}</span>
                  <span className="px-2 sm:px-3 py-1 bg-red-100 text-red-600 text-xs sm:text-sm font-semibold rounded-full">Save ₹{discountAmount}</span>
                </>
              )}
            </div>

            {/* color */}
            {mappedColors.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-[#222426] mb-2 sm:mb-3">Color: <span className="text-[#8A6F4F]">{selectedColor || mappedColors[0].name}</span></label>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {mappedColors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all duration-300 hover:scale-110 ${selectedColor === c.name ? "border-[#CBE600] shadow-lg scale-110" : "border-gray-300"}`}
                      style={{ backgroundColor: c.hex || "#fff" }}
                      title={c.name}
                    >
                      {selectedColor === c.name && <Check className="w-5 h-5 text-black absolute inset-0 m-auto" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* add to cart */}
        <form className="pt-4" onSubmit={handleSubmit}>
          <div>
            <h3 className="text-sm font-medium text-gray-900">Choose Size:</h3>

<h3 className="text-sm font-medium text-gray-900">Choose Size:</h3>

<div
  role="radiogroup"
  aria-label="Choose size"
  className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3"
>
  {customersProduct.product?.sizes?.map((size) => {
    const outOfStock = size.quantity === 0;
    const checked = selectedSize?.name === size.name;

    return (
      <button
        key={size.name}
        type="button"
        role="radio"
        aria-checked={checked}
        aria-disabled={outOfStock}
        tabIndex={outOfStock ? -1 : checked ? 0 : -1}
        onClick={() => !outOfStock && setSelectedSize(size)}
        onKeyDown={(e) => {
          if (outOfStock) return;
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            setSelectedSize(size);
          }
        }}
        className={`relative flex items-center justify-center border rounded-md py-2 px-4 text-sm font-medium uppercase transition-all duration-200 focus:outline-none
          ${outOfStock ? "cursor-not-allowed bg-gray-100 text-gray-400 line-through" : "cursor-pointer bg-white text-gray-900 shadow-sm hover:bg-gray-50"}
          ${checked && !outOfStock ? "ring-2 ring-indigo-500 border-indigo-500" : "border-gray-300"}`}
        disabled={outOfStock}
      >
        <span>{size.name}</span>

        {/* selected ring visual */}
        {checked && !outOfStock && (
          <span
            className="absolute -inset-px rounded-md pointer-events-none"
            aria-hidden="true"
          />
        )}
      </button>
    );
  })}
</div>

            {sizeError && (
              <FormHelperText error sx={{ marginTop: 1 }}>
                Please select a size before adding to cart.
              </FormHelperText>
            )}
          </div>
          <Button
  type="submit"
  variant="contained"
  color="primary"
  sx={{ padding: ".8rem 2rem", marginTop: "2rem" }}
  disabled={isAdding}
>
  {isAdding ? "Adding..." : "Add to Cart"}
</Button>

        </form>

            {/* features */}
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

        {/* Tabs */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12 lg:mb-16">
          <div className="border-b border-gray-200 mb-6 sm:mb-8">
            <div className="flex gap-4 sm:gap-8 overflow-x-auto">
              {["description", "ingredients", "how-to-use", "reviews"].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 sm:pb-4 px-1 sm:px-2 font-semibold capitalize transition-all duration-300 whitespace-nowrap text-sm sm:text-base ${activeTab === tab ? "text-[#8A6F4F] border-b-2 border-[#CBE600]" : "text-gray-500 hover:text-[#8A6F4F]"}`}>
                  {tab.replace("-", " ")}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "description" && (
            <div className="space-y-4 sm:space-y-6">
              <p className="text-gray-700 leading-relaxed text-sm md:text-base lg:text-lg">{product?.description}</p>
              {Array.isArray(product?.features) && (
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-[#222426] mb-3 sm:mb-4">Key Features:</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {product.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 sm:gap-3">
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#CBE600] flex-shrink-0 mt-0.5" />
                        <span className="text-sm sm:text-base text-gray-700">{f}</span>
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
  <Box className="space-y-4 sm:space-y-6">
    {/* Header: average + CTA */}
    <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" gap={2}>
      <Box display="flex" alignItems="center" gap={2}>
        <Typography variant="h3" component="span" sx={{ color: "#8A6F4F", fontWeight: 700 }}>
          {(ratingSummary.averageRating || 0).toFixed(1)}
        </Typography>
        <Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Rating value={ratingSummary.averageRating || 0} precision={0.5} readOnly />
            <Typography variant="body2" color="text.secondary">
              ({ratingSummary.totalRatings || 0} reviews)
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            Overall customer rating
          </Typography>
        </Box>
      </Box>

      <Button
        variant="outlined"
        sx={{
          borderColor: "#8A6F4F",
          color: "#8A6F4F",
          '&:hover': { backgroundColor: "#8A6F4F", color: "#fff" }
        }}
        onClick={() => {
          // open write-review modal / route — replace with your handler
          console.log("Write review clicked");
        }}
      >
        Write a review
      </Button>
    </Box>

    {/* Main content: reviews list + ratings breakdown */}
    <Box className="border rounded-lg p-5" sx={{ backgroundColor: "#fff" }}>
      <Grid container spacing={3}>
        {/* Reviews list */}
        <Grid item xs={12} md={7}>
          <Stack spacing={3}>
            { (showAll ? reviewsList : reviewsList.slice(0, 5)).length > 0 ? (
              (showAll ? reviewsList : reviewsList.slice(0, 5)).map((r, i) => (
                <ProductReviewCard key={r._id || r.id || i} item={r} />
              ))
            ) : (
              <Typography color="text.secondary">No reviews available.</Typography>
            )}

            {reviewsList.length > 5 && (
              <Box textAlign="center" pt={2}>
                <Button variant="text" onClick={() => setShowAll(!showAll)}>
                  {showAll ? "Show less reviews" : `Show more reviews (${reviewsList.length - 5} more)`}
                </Button>
              </Box>
            )}
          </Stack>
        </Grid>

        {/* Ratings distribution */}
        <Grid item xs={12} md={5}>
          <Typography variant="h6" gutterBottom>Product Ratings</Typography>

          {(!ratingSummary || ratingSummary.totalRatings === 0) ? (
            <Typography color="text.secondary">No ratings yet.</Typography>
          ) : (
            <>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Rating value={ratingSummary.averageRating || 0} precision={0.5} readOnly />
                <Typography variant="body2" color="text.secondary">
                  {ratingSummary.totalRatings} rating{ratingSummary.totalRatings > 1 ? "s" : ""}
                </Typography>
              </Box>

              {/* bars */}
              {[
                { label: "Excellent", star: 5, color: "#4caf50" },
                { label: "Very Good", star: 4, color: "#8bc34a" },
                { label: "Good", star: 3, color: "#ffc107" },
                { label: "Average", star: 2, color: "#ff9800" },
                { label: "Poor", star: 1, color: "#f44336" }
              ].map((bar, idx) => {
                const count = ratingSummary.counts?.[bar.star] || 0;
                const percentage = ratingSummary.totalRatings ? (count / ratingSummary.totalRatings) * 100 : 0;
                return (
                  <Box key={idx} mb={2}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">{bar.label}</Typography>
                      <Typography variant="caption" color="text.secondary">{count}</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{
                        height: 8,
                        borderRadius: 2,
                        '& .MuiLinearProgress-bar': { backgroundColor: bar.color }
                      }}
                    />
                  </Box>
                );
              })}
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  </Box>
)}

        </div>

        {/* Related products */}
        <div>
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-semibold text-[#8A6F4F] mb-2 sm:mb-4">You May Also Like</h2>
            <p className="text-sm sm:text-base text-gray-600">Complete your beauty collection with these essentials</p>
          </div>

          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 xl:gap-6">
            {(customersProduct?.products?.content || []).slice(0, 4).map((item) => (
              <article key={item._id || item.id} className="group bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-lg border-2 border-transparent hover:border-[#DFF200] transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                <div className="relative overflow-hidden bg-gray-100 aspect-square">
                  <img src={item.imageUrl?.[0] || item.image || item.images?.[0]} alt={item.title || item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="p-3 sm:p-5">
                  <h3 className="text-sm sm:text-base font-semibold text-[#222426] mb-1.5 sm:mb-2 group-hover:text-[#CBE600] transition-colors duration-300 line-clamp-2">{item.title || item.name}</h3>
                  <div className="flex items-center gap-1 sm:gap-2 mb-2">{renderStars(item.averageRating || item.rating)}</div>
                  <div className="mb-3 sm:mb-4"><span className="text-lg sm:text-xl font-bold text-[#8A6F4F]">Rs. {item.discountedPrice || item.price}</span></div>
                  <button className="w-full py-2 sm:py-3 px-3 sm:px-4 bg-black text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-[#CBE600] hover:text-black transition-all duration-300 uppercase tracking-wide">Add to bag</button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* login snackbar */}
      <Snackbar open={loginAlert} autoHideDuration={4000} onClose={() => setLoginAlert(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setLoginAlert(false)} severity="warning" variant="filled" sx={{ width: '100%' }} action={<Button color="inherit" size="small" onClick={() => navigate('/login')}>Login</Button>}>
          Please login to add items to your cart.
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ProductDetailsPage;
