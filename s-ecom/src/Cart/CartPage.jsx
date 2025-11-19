import React, { useEffect, useState } from 'react';
import Confetti from "react-confetti";
import { X, Plus, Minus, ShoppingBag, Truck, Tag, Lock, ArrowRight, Heart, Trash2 } from 'lucide-react';
import { Box, Backdrop, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// redux actions (make sure these exist in your project)
import { getCart } from "../redux/Cart/Action";


// --- small hook to get window size for confetti
const useWindowSize = () => {
  const getSize = () => ({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height:
      typeof window !== "undefined"
        ? Math.max(window.innerHeight, document.documentElement.clientHeight, document.body.scrollHeight)
        : 800,
  });

  const [windowSize, setWindowSize] = useState(getSize());

  React.useEffect(() => {
    const handleResize = () => setWindowSize(getSize());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return windowSize;
};

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // --- local fallback sample cart (keeps original design/data)
  const [localCartItems, setLocalCartItems] = useState([
    {
      id: 1,
      name: "Glowfly Liquid Highlighter",
      price: 399,
      originalPrice: 599,
      quantity: 2,
      color: "Rose Pink",
      size: "M",
      image: "https://images.unsplash.com/photo-1596704017254-9b121068ec31?auto=format&fit=crop&w=400&q=80",
      inStock: true
    },
    {
      id: 2,
      name: "Velvet Matte Lipstick",
      price: 699,
      originalPrice: 899,
      quantity: 1,
      color: "Ruby Red",
      size: "Standard",
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=400&q=80",
      inStock: true
    },
    {
      id: 3,
      name: "Silk Finish Foundation",
      price: 1599,
      originalPrice: 1999,
      quantity: 1,
      color: "Ivory",
      size: "30ml",
      image: "https://images.unsplash.com/photo-1631730486572-226d1f595b68?auto=format&fit=crop&w=400&q=80",
      inStock: true
    }
  ]);

  // --- UI states
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, discount (percent), amount (currency) }
  const [showConfetti, setShowConfetti] = useState(false);

  // --- redux slices (expected shape: cart: { cartItems, cart, loading }, auth: { user }, coupon: {...})
  const store = useSelector((s) => s);
  const cartSlice = store.cart || {};
  const authSlice = store.auth || {};
  const couponSlice = store.coupon || {};

  // Unpack commonly-used redux fields (if present)
  const { cartItems: reduxCartItems = [], cart: reduxCart = null, loading: cartLoading = false } = cartSlice;
  const user = authSlice.user || null;
  const { message: couponMessage, error: couponError, difference: couponDifference, discountAmount: couponDiscountAmount, allCoupons = [] } = couponSlice;

  // Confetti size
  const { width, height } = useWindowSize();

  // detect JWT (if present we use backend flows)
  const jwt = typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
  const isLoggedIn = Boolean(jwt && user && user._id);

  // --- Effects: on mount, clear coupon state and if logged in fetch cart + coupons
  useEffect(() => {
    // clear any previous coupon state to avoid auto-message on refresh
    try { dispatch(clearCouponState()); } catch (e) {}

    if (isLoggedIn) {
      dispatch(getCart(jwt));
      dispatch(allCoupon());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isLoggedIn, jwt]);

  // show confetti when coupon message appears (same behavior as original component)
  useEffect(() => {
    if (couponMessage && !couponError) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 5000);
      // reflect backend coupon into local appliedCoupon state (safe mapping)
      const inferredDiscountPercent = couponSlice.discountPercent || couponSlice.discountValue || 0;
      const inferredAmount = couponDifference || couponDiscountAmount || 0;
      setAppliedCoupon({ code: couponCode || couponSlice.code || "", discount: inferredDiscountPercent, amount: inferredAmount });
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [couponMessage, couponError]);

  // If backend clears coupon (or error), update local appliedCoupon state
  useEffect(() => {
    if (couponError) {
      // clear any local applied coupon if backend says error
      setAppliedCoupon(null);
    }
  }, [couponError]);

  // Utility: read current items either from redux (if logged in) or local fallback
  const getCurrentItems = () => {
    if (isLoggedIn && Array.isArray(reduxCartItems) && reduxCartItems.length > 0) {
      // handle branch where redux cartItems might be nested arrays or objects from your api
      // normalize to array of items with id, price, originalPrice, quantity, etc.
      return reduxCartItems.flat().map((it, idx) => ({
        id: it._id || it.productId || `r-${idx}`,
        name: it.name || it.title || (it.product && it.product.name) || "Product",
        price: Number(it.price ?? it.salePrice ?? (it.product && it.product.price) ?? 0),
        originalPrice: Number(it.originalPrice ?? it.mrp ?? (it.product && it.product.originalPrice) ?? 0),
        quantity: Number(it.quantity ?? it.qty ?? it.count ?? 1),
        color: it.color || (it.product && it.product.color) || "",
        size: it.size || (it.product && it.product.size) || "",
        image: (it.images && it.images[0]) || it.image || (it.product && it.product.image) || "",
        inStock: typeof it.inStock === "boolean" ? it.inStock : true,
        raw: it
      }));
    }
    return localCartItems;
  };

  const currentItems = getCurrentItems();

  // --- handlers that preserve exact UI (updateQuantity/removeItem) but update redux if logged in
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;

    if (isLoggedIn) {
      // If you have a redux action to update cart item quantity, call it here.
      // I don't know your exact action name, so fallback to re-fetching cart (safer) or local update.
      // Example: dispatch(updateCartItemQuantity(id, newQuantity, jwt))
      // For now: optimistic local update of reduxCartItems is avoided — instead, call getCart after potential server-side update.
      // TODO: replace with your update-quantity redux action.
      console.warn("Logged-in updateQuantity called — replace with your updateCartItemQuantity action for server update.");
      // fallback: modify localCartItems for UI responsiveness (won't persist)
      setLocalCartItems(prev => prev.map(it => it.id === id ? { ...it, quantity: newQuantity } : it));
      try { dispatch(getCart(jwt)); } catch (e) {}
      return;
    }

    // local fallback
    setLocalCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
  };

  const removeItem = (id) => {
    if (isLoggedIn) {
      // TODO: replace with your redux action to remove item from cart on server
      console.warn("Logged-in removeItem called — replace with your remove-from-cart redux action to persist.");
      setLocalCartItems(prev => prev.filter(item => item.id !== id));
      try { dispatch(getCart(jwt)); } catch (e) {}
      return;
    }
    setLocalCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Coupon apply logic: if logged in, dispatch applyCoupon (server) else local fallback
  const handleApplyCoupon = () => {
    if (!couponCode || couponCode.trim() === "") return;

    if (isLoggedIn && user && reduxCart && reduxCart._id) {
      // dispatch to backend: applyCoupon(code, userId, cartId, cartTotal)
      const cartTotal = Number(reduxCart.totalDiscountedPrice ?? reduxCart.totalPrice ?? 0);
      dispatch(applyCoupon(couponCode.trim(), user._id, reduxCart._id, cartTotal));
      return;
    }

    // local fallback coupon logic (keeps original behavior)
    const code = couponCode.trim().toUpperCase();
    if (code === 'SAVE10') {
      setAppliedCoupon({ code: 'SAVE10', discount: 10, amount: 0 });
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    } else if (code === 'WELCOME20') {
      setAppliedCoupon({ code: 'WELCOME20', discount: 20, amount: 0 });
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    } else {
      // invalid coupon — clear any applied
      setAppliedCoupon(null);
    }
  };

  // If you want to apply coupon from a list (backend) without changing UI, this helper exists.
  const handleApplyCouponFromList = (code) => {
    setCouponCode(code);
    if (isLoggedIn && user && reduxCart && reduxCart._id) {
      const cartTotal = Number(reduxCart.totalDiscountedPrice ?? reduxCart.totalPrice ?? 0);
      dispatch(applyCoupon(code, user._id, reduxCart._id, cartTotal));
    } else {
      setCouponCode(code);
      handleApplyCoupon();
    }
  };

  // --- derived totals (use currentItems so UI stays identical)
  const subtotal = currentItems.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 1)), 0);
  const savings = currentItems.reduce((sum, item) => sum + (Number((item.originalPrice || 0) - (item.price || 0)) * Number(item.quantity || 1)), 0);
  const shipping = subtotal >= 999 ? 0 : 99;

  // coupon discount calculation:
  // - if appliedCoupon has `discount` treat it as percent
  // - if backend provides `amount` (difference) use that
  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.amount && Number(appliedCoupon.amount) > 0) {
      couponDiscount = Number(appliedCoupon.amount);
    } else if (appliedCoupon.discount) {
      couponDiscount = (subtotal * Number(appliedCoupon.discount)) / 100;
    }
  } else if (isLoggedIn && couponDifference) {
    // backend returned a difference number (absolute rupees)
    couponDiscount = Number(couponDifference);
  } else if (isLoggedIn && couponDiscountAmount) {
    couponDiscount = Number(couponDiscountAmount);
  }

  const total = subtotal + shipping - couponDiscount;

  // If user not logged in and you want to show RequireLogin instead of the page, uncomment below:
  // if (!jwt) return <RequireLogin message="Please log in to view your cart." />;

  // Show loading backdrop when redux cart is loading
  if (cartLoading) {
    return (
      <Backdrop open sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF6]">
      {/* Confetti + floating success banner (matches original behavior without changing layout) */}
      {showConfetti && (
        <>
          <div className="fixed top-0 left-0 w-full h-full z-[9998] pointer-events-none">
            <Confetti width={width} height={height} numberOfPieces={width < 768 ? 100 : 300} gravity={0.3} recycle={false} />
          </div>

          <Box
            sx={{
              position: "fixed",
              top: "1.5rem",
              left: "50%",
              transform: "translateX(-50%)",
              bgcolor: "success.main",
              color: "common.white",
              px: 3,
              py: 1.5,
              borderRadius: "12px",
              boxShadow: 6,
              fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem" },
              fontWeight: 600,
              textAlign: "center",
              zIndex: (theme) => theme.zIndex.modal + 2,
              width: { xs: "92%", sm: "auto" },
              maxWidth: 400,
              animation: "bounce 1s infinite",
              "@keyframes bounce": {
                "0%, 100%": { transform: "translateX(-50%) translateY(0)" },
                "50%": { transform: "translateX(-50%) translateY(-8px)" },
              },
            }}
          >
            🎉 Coupon Applied Successfully!
          </Box>
        </>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-[#8A6F4F] to-[#6B5B4A] text-white py-8 md:py-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm mb-3 md:mb-4 text-white/80">
            <a href="/" className="hover:text-white transition-colors">
              Home
            </a>
            <span>/</span>
            <span>Shopping Cart</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light mb-2">
            Shopping Cart
          </h1>
          <p className="text-base md:text-lg text-white/90">
            {currentItems.length} {currentItems.length === 1 ? "item" : "items"} in
            your cart
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
          {/* Cart Items */}
          <div className="xl:col-span-2 space-y-4">
            {/* Free Shipping Banner */}
            {subtotal < 999 && (
              <div className="bg-gradient-to-r from-[#CBE600]/20 to-[#DFF200]/20 border-2 border-[#CBE600] rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 md:w-6 md:h-6 text-[#8A6F4F] flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-[#222426] text-sm md:text-base">
                      Add ₹{Math.max(0, 999 - subtotal)} more to get FREE shipping!
                    </p>
                    <div className="w-full bg-white rounded-full h-2 mt-2 overflow-hidden">
                      <div
                        className="h-full bg-[#CBE600] transition-all duration-500"
                        style={{ width: `${Math.min(100, (subtotal / 999) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cart Items List (preserved design) */}
            {currentItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-lg p-4 md:p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                  {/* Image */}
                  <div className="w-full md:w-28 lg:w-32 h-28 lg:h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden mx-auto md:mx-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-base md:text-lg font-semibold text-[#222426] mb-1 hover:text-[#8A6F4F] transition-colors cursor-pointer pr-2">
                          {item.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-600 mb-2">
                          <span>Color: <span className="font-medium text-[#222426]">{item.color}</span></span>
                          <span className="hidden sm:inline">•</span>
                          <span>Size: <span className="font-medium text-[#222426]">{item.size}</span></span>
                        </div>
                        {item.inStock ? (
                          <span className="text-xs text-[#CBE600] font-semibold">In Stock</span>
                        ) : (
                          <span className="text-xs text-red-500 font-semibold">Out of Stock</span>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors h-fit"
                        title="Remove item"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden mx-auto md:mx-0">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 md:w-10 h-8 md:h-10 flex items-center justify-center hover:bg-gray-100 transition-colors">
                          <Minus className="w-3 md:w-4 h-3 md:h-4" />
                        </button>
                        <span className="w-10 md:w-12 text-center font-semibold text-sm md:text-base">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 md:w-10 h-8 md:h-10 flex items-center justify-center hover:bg-gray-100 transition-colors">
                          <Plus className="w-3 md:w-4 h-3 md:h-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-left sm:text-right">
                        <div className="flex items-center gap-2 md:gap-3">
                          <span className="text-lg md:text-xl font-bold text-[#8A6F4F]">₹{item.price * item.quantity}</span>
                          {item.originalPrice && <span className="text-xs md:text-sm text-gray-400 line-through">₹{item.originalPrice * item.quantity}</span>}
                        </div>
                        {item.originalPrice && <span className="text-xs text-[#CBE600] font-semibold">Save ₹{(item.originalPrice - item.price) * item.quantity}</span>}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 md:gap-4 mt-4 pt-4 border-t border-gray-200">
                      <button className="flex items-center gap-2 text-xs md:text-sm text-[#8A6F4F] hover:text-[#CBE600] transition-colors font-medium">
                        <Heart className="w-4 h-4" /> Save for Later
                      </button>
                      <button onClick={() => removeItem(item.id)} className="flex items-center gap-2 text-xs md:text-sm text-gray-600 hover:text-red-500 transition-colors font-medium">
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <a href="/products" className="inline-flex items-center gap-2 text-sm md:text-base text-[#8A6F4F] font-semibold hover:gap-3 transition-all duration-300">
              <ArrowRight className="w-4 md:w-5 h-4 md:h-5 rotate-180" />
              Continue Shopping
            </a>
          </div>

          {/* Order Summary (preserved design) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 sticky top-20 md:top-24">
              <h2 className="text-xl md:text-2xl font-serif font-semibold text-[#222426] mb-4 md:mb-6">Order Summary</h2>

              {/* Coupon Code */}
              <div className="mb-4 md:mb-6 pb-4 md:pb-6 border-b border-gray-200">
                <label className="block text-sm font-semibold text-[#222426] mb-3">Have a Coupon?</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border-2 border-gray-300 rounded-lg focus:border-[#CBE600] focus:outline-none focus:ring-2 focus:ring-[#CBE600]/20 transition-all"
                  />
                  <button onClick={handleApplyCoupon} className="px-4 md:px-6 py-2 md:py-3 text-sm md:text-base bg-[#8A6F4F] text-white font-semibold rounded-lg hover:bg-[#CBE600] hover:text-black transition-all duration-300">
                    Apply
                  </button>
                </div>

                {/* coupon success message (keeps original tiny tag look) */}
                { (appliedCoupon || couponMessage) && (
                  <div className="mt-3 flex items-center gap-2 text-xs md:text-sm text-[#CBE600] font-semibold">
                    <Tag className="w-4 h-4" />
                    Coupon "{appliedCoupon?.code || couponSlice?.code || couponCode}" applied!
                    {appliedCoupon?.discount ? ` ${appliedCoupon.discount}% off` : appliedCoupon?.amount ? ` -₹${appliedCoupon.amount}` : couponDifference ? ` -₹${couponDifference}` : ""}
                  </div>
                )}

                {/* backend error fallback */}
                {couponError && (
                  <div className="mt-3 text-xs md:text-sm text-red-600 font-medium">
                    {couponError}
                  </div>
                )}

                <div className="mt-3 space-y-1">
                  <p className="text-xs text-gray-500">
                    Try: <span className="font-semibold text-[#8A6F4F]">SAVE10</span> or <span className="font-semibold text-[#8A6F4F]">WELCOME20</span>
                  </p>
              </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                <div className="flex justify-between text-sm md:text-base text-gray-700">
                  <span>Subtotal ({currentItems.length} items)</span>
                  <span className="font-semibold">₹{subtotal}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-sm md:text-base text-[#CBE600] font-semibold">
                    <span>You Save</span>
                    <span>-₹{savings}</span>
                  </div>
                )}
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-sm md:text-base text-[#CBE600] font-semibold">
                    <span>Coupon Discount</span>
                    <span>-₹{Math.round(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm md:text-base text-gray-700">
                  <span>Shipping</span>
                  {shipping === 0 ? (
                    <span className="font-semibold text-[#CBE600]">FREE</span>
                  ) : (
                    <span className="font-semibold">₹{shipping}</span>
                  )}
                </div>
                <div className="pt-3 md:pt-4 border-t-2 border-gray-200 flex justify-between text-lg md:text-xl font-bold text-[#222426]">
                  <span>Total</span>
                  <span className="text-[#8A6F4F]">₹{Math.round(total)}</span>
                </div>
              </div>

              <button onClick={() => navigate("/checkout?step=2")} className="w-full py-3 md:py-4 px-4 md:px-6 bg-[#CBE600] text-white font-bold text-base md:text-lg rounded-xl hover:bg-[#DFF200] hover:text-black transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 uppercase tracking-wide mb-4">
                Proceed to Checkout
              </button>

              <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-gray-600">
                <Lock className="w-4 h-4" />
                <span>Secure Checkout</span>
              </div>

              <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center gap-3 text-xs md:text-sm text-gray-700">
                  <div className="w-8 md:w-10 h-8 md:h-10 bg-[#CBE600]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Truck className="w-4 md:w-5 h-4 md:h-5 text-[#8A6F4F]" />
                  </div>
                  <div>
                    <p className="font-semibold">Free Shipping</p>
                    <p className="text-xs text-gray-500">On orders over ₹999</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs md:text-sm text-gray-700">
                  <div className="w-8 md:w-10 h-8 md:h-10 bg-[#CBE600]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Lock className="w-4 md:w-5 h-4 md:h-5 text-[#8A6F4F]" />
                  </div>
                  <div>
                    <p className="font-semibold">Secure Payment</p>
                    <p className="text-xs text-gray-500">100% protected</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        <div className="mt-12 md:mt-16">
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-[#8A6F4F] mb-6 md:mb-8 text-center">
            Complete Your Look
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
            {[  // sample recommended products — kept identical to original
              {
                id: 101,
                name: "Pearl Blush Duo",
                price: 749,
                image: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=400&q=80"
              },
              {
                id: 102,
                name: "Volume Max Mascara",
                price: 549,
                image: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=400&q=80"
              },
              {
                id: 103,
                name: "Luxe Makeup Brush Set",
                price: 1899,
                image: "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?auto=format&fit=crop&w=400&q=80"
              }
            ].map((product) => (
              <article key={product.id} className="group bg-white rounded-xl overflow-hidden shadow-lg border-2 border-transparent hover:border-[#DFF200] transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                <div className="relative overflow-hidden bg-gray-100 aspect-square">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="p-4 md:p-5">
                  <h3 className="text-sm md:text-base font-semibold text-[#222426] mb-3 group-hover:text-[#CBE600] transition-colors duration-300 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg md:text-xl font-bold text-[#8A6F4F]">₹{product.price}</span>
                    <button className="px-3 md:px-4 py-2 bg-black text-white text-xs md:text-sm font-semibold rounded-lg hover:bg-[#CBE600] hover:text-black transition-all duration-300 uppercase">Add</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
