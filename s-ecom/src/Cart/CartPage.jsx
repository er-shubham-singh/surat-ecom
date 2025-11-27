import Confetti from "react-confetti";
import React, { useEffect, useState } from "react";
import CartItem from "./CartItem";
import { Backdrop, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCart } from "../redux/Cart/Action";
import RequireLogin from "../Component/auth/RequireLogin";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Box } from "@mui/material";
import {
  applyCoupon,
  allCoupon,
  clearCouponState,
} from "../redux/Coupon/couponActions";

// A custom hook to get the window size for the confetti
const useWindowSize = () => {
  const getSize = () => ({
    width: window.innerWidth,
    height: Math.max(
      window.innerHeight,
      document.documentElement.clientHeight,
      document.body.scrollHeight
    ),
  });

  const [windowSize, setWindowSize] = useState(getSize());

  useEffect(() => {
    const handleResize = () => setWindowSize(getSize());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

const CartPage = () => {
  const [couponCode, setCouponCode] = useState("");
  const [showAvailableCoupons, setShowAvailableCoupons] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, auth, coupon } = useSelector((store) => store);

  const availableCoupons = coupon?.allCoupons || [];

  const jwt = localStorage.getItem("jwt");
  const user = auth.user;

  const { discountAmount, message, error } = coupon;

  useEffect(() => {
    dispatch(clearCouponState());
  }, [dispatch]);

  useEffect(() => {
    if (jwt) {
      dispatch(getCart(jwt));
      dispatch(allCoupon());
    }
  }, [dispatch, jwt]);

  useEffect(() => {
    if (message && !error) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  const handleApplyCoupon = () => {
    if (!couponCode || !user || !user._id || !cart.cart?._id) return;
    const cartTotal = cart.cart.totalDiscountedPrice;
    dispatch(applyCoupon(couponCode, user._id, cart.cart._id, cartTotal));
  };

  const handleApplyCouponFromList = (code) => {
    setCouponCode(code);
    dispatch(
      applyCoupon(code, user._id, cart.cart._id, cart.cart.totalDiscountedPrice)
    );
  };

  const toggleCoupons = () => {
    setShowAvailableCoupons((prev) => !prev);
  };

  if (!jwt) {
    return <RequireLogin message="Please log in to view your cart." />;
  }

  if (cart.loading) {
    return (
      <Backdrop
        open
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF6] font-sans relative">
      {/* Confetti & Success Message */}
      {showConfetti && (
        <>
          <div className="fixed top-0 left-0 w-full h-full z-[9998] pointer-events-none">
            <Confetti
              width={width}
              height={height}
              numberOfPieces={width < 768 ? 100 : 300}
              gravity={0.3}
              recycle={false}
            />
          </div>

          <Box
            sx={{
              position: "fixed",
              top: "1.5rem",
              left: "50%",
              transform: "translateX(-50%)",
              bgcolor: "#DFF200",
              color: "#111111",
              px: 4,
              py: 2,
              borderRadius: "16px",
              boxShadow: "0 8px 32px rgba(223, 242, 0, 0.4)",
              fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem" },
              fontWeight: 700,
              textAlign: "center",
              zIndex: 9999,
              width: { xs: "92%", sm: "auto" },
              maxWidth: 400,
              border: "2px solid #CBE600",
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

      {cart.cartItems?.length > 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {/* Page Header */}
          <div className="mb-6 lg:mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-[#111111] flex items-center gap-3">
              <ShoppingCartOutlinedIcon
                sx={{ fontSize: { xs: 32, lg: 40 }, color: "#111111" }}
              />
              Shopping Cart
              <span className="ml-3 text-base lg:text-lg font-semibold text-[#111111]/60 bg-[#DFF200] px-4 py-1 rounded-full">
                {cart.cart?.totalItem || 0}{" "}
                {cart.cart?.totalItem === 1 ? "Item" : "Items"}
              </span>
            </h1>
          </div>

          <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">
            {/* Cart Items Section - 7 columns */}
            <div className="lg:col-span-7 lg:min-h-screen lg:max-h-[calc(100vh-12rem)] lg:overflow-y-auto lg:pr-4 scrollbar-thin scrollbar-thumb-[#CBE600] scrollbar-track-transparent">
              <div className="space-y-4">
                {cart.cartItems
                  .flat()
                  .map((item, i) =>
                    item ? (
                      <CartItem
                        item={item}
                        showButton={true}
                        key={item._id || item.productId || i}
                      />
                    ) : null
                  )}
              </div>
            </div>

            {/* Price Summary Section - 5 columns */}
            <div className="lg:col-span-5 mt-8 lg:mt-0">
              <div className="sticky top-6">
                {/* Order Summary Card */}
                <div className="bg-white rounded-2xl border-2 border-[#DFF200] shadow-lg overflow-hidden">
                  {/* Header */}
                  <div className="bg-linear-to-r from-[#DFF200] to-[#CBE600] px-6 py-5 border-b-2 border-[#CBE600]">
                    <h2 className="text-2xl font-bold text-[#111111] uppercase tracking-wide">
                      Order Summary
                    </h2>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Price Breakdown */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-base">
                        <span className="text-[#111111]/70 font-medium">
                          Subtotal ({cart.cart?.totalItem || 0} items)
                        </span>
                        <span className="font-bold text-[#111111]">
                          ₹{cart.cart?.totalPrice || 0}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-base">
                        <span className="text-[#111111]/70 font-medium">
                          Discount
                        </span>
                        <span className="text-green-600 font-bold">
                          -₹{cart.cart?.discounte || 0}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-base">
                        <span className="text-[#111111]/70 font-medium">
                          Delivery
                        </span>
                        <div className="flex items-center gap-2">
                          <CheckCircleOutlineIcon
                            sx={{ fontSize: 18, color: "#10B981" }}
                          />
                          <span className="text-green-600 font-bold uppercase text-sm">
                            Free
                          </span>
                        </div>
                      </div>

                      {couponCode && coupon?.difference > 0 && (
                        <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <LocalOfferIcon
                                sx={{ fontSize: 20, color: "#059669" }}
                              />
                              <span className="text-green-800 font-bold text-sm">
                                Coupon Applied: {couponCode.toUpperCase()}
                              </span>
                            </div>
                            <span className="text-green-700 font-bold text-lg">
                              -₹{coupon.difference}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="border-t-2 border-[#DFF200] pt-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xl font-bold text-[#111111] uppercase">
                            Total
                          </span>
                          <span className="text-3xl font-bold text-[#111111]">
                            ₹
                            {(cart.cart?.totalDiscountedPrice || 0) -
                              (coupon?.difference || 0)}
                          </span>
                        </div>
                        {(cart.cart?.discounte > 0 ||
                          coupon?.difference > 0) && (
                          <div className="flex justify-end">
                            <div className="bg-[#DFF200] px-3 py-1 rounded-full">
                              <p className="text-sm font-bold text-[#111111]">
                                You saved ₹
                                {(cart.cart?.discounte || 0) +
                                  (coupon?.difference || 0)}
                                ! 🎉
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Coupon Section */}
                    <div className="border-t-2 border-[#DFF200] pt-6">
                      <button
                        onClick={toggleCoupons}
                        className="w-full flex items-center justify-between bg-[#FFFDF6] hover:bg-[#DFF200]/20 border-2 border-[#DFF200] rounded-xl px-4 py-3 transition-all duration-300 group"
                      >
                        <div className="flex items-center gap-3">
                          <LocalOfferIcon
                            sx={{ fontSize: 24, color: "#111111" }}
                          />
                          <span className="font-bold text-[#111111] uppercase text-sm">
                            {showAvailableCoupons
                              ? "Hide Coupons"
                              : "Apply Coupon Code"}
                          </span>
                        </div>
                        {showAvailableCoupons ? (
                          <KeyboardArrowUpIcon
                            sx={{ fontSize: 24, color: "#111111" }}
                          />
                        ) : (
                          <KeyboardArrowDownIcon
                            sx={{ fontSize: 24, color: "#111111" }}
                          />
                        )}
                      </button>

                      {/* Coupon Input */}
                      <div className="mt-4 space-y-3">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="ENTER CODE"
                            value={couponCode}
                            onChange={(e) =>
                              setCouponCode(e.target.value.toUpperCase())
                            }
                            className="flex-1 border-2 border-[#DFF200] bg-white rounded-xl px-4 py-3 text-sm font-semibold uppercase focus:outline-none focus:border-[#CBE600] focus:ring-2 focus:ring-[#DFF200]/30 transition-all placeholder:text-[#111111]/40"
                          />
                          <Button
                            variant="contained"
                            onClick={handleApplyCoupon}
                            disabled={!couponCode.trim()}
                            sx={{
                              px: 4,
                              py: 1.5,
                              textTransform: "uppercase",
                              fontWeight: 700,
                              fontSize: "0.875rem",
                              bgcolor: "#DFF200",
                              color: "#111111",
                              borderRadius: "12px",
                              border: "2px solid #CBE600",
                              "&:hover": {
                                bgcolor: "#CBE600",
                              },
                              "&:disabled": {
                                bgcolor: "#f5f5f5",
                                color: "#999",
                                border: "2px solid #e5e5e5",
                              },
                            }}
                          >
                            Apply
                          </Button>
                        </div>

                        {message && (
                          <div className="flex items-start gap-3 text-green-700 text-sm font-semibold bg-green-50 border-2 border-green-300 p-4 rounded-xl">
                            <CheckCircleOutlineIcon
                              sx={{ fontSize: 20, flexShrink: 0 }}
                            />
                            <span>
                              {message} (Saved ₹{discountAmount})
                            </span>
                          </div>
                        )}

                        {error && (
                          <div className="flex items-start gap-3 text-red-600 text-sm font-semibold bg-red-50 border-2 border-red-300 p-4 rounded-xl">
                            <ErrorOutlineIcon
                              sx={{ fontSize: 20, flexShrink: 0 }}
                            />
                            <span>{error}</span>
                          </div>
                        )}
                      </div>

                      {/* Available Coupons */}
                      {showAvailableCoupons && availableCoupons.length > 0 && (
                        <div className="mt-4 bg-[#FFFDF6] rounded-xl border-2 border-[#DFF200] p-4 max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-[#CBE600] scrollbar-track-transparent">
                          <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111] mb-4 flex items-center gap-2">
                            <LocalOfferIcon sx={{ fontSize: 18 }} />
                            Available Offers
                          </h3>
                          <div className="space-y-3">
                            {availableCoupons.map((c) => (
                              <div
                                key={c._id}
                                className="bg-white border-2 border-dashed border-[#DFF200] rounded-xl p-4 hover:border-[#CBE600] hover:shadow-md transition-all duration-300"
                              >
                                <div className="flex justify-between items-start gap-3">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <div className="bg-[#DFF200] px-3 py-1 rounded-lg">
                                        <p className="font-bold text-[#111111] text-sm">
                                          {c.code}
                                        </p>
                                      </div>
                                    </div>
                                    <p className="text-sm font-semibold text-[#111111] mb-1">
                                      {c.discountType === "flat"
                                        ? `Get ₹${c.discountValue} OFF`
                                        : `Get ${c.discountValue}% OFF (up to ₹${c.maxDiscountAmount})`}
                                    </p>
                                    <p className="text-xs text-[#111111]/60 font-medium">
                                      Min. order: ₹{c.minOrderAmount}
                                    </p>
                                    <p className="text-xs text-[#111111]/50 mt-1">
                                      Valid till{" "}
                                      {new Date(c.expiresAt).toLocaleDateString(
                                        "en-IN",
                                        {
                                          day: "numeric",
                                          month: "short",
                                          year: "numeric",
                                        }
                                      )}
                                    </p>
                                  </div>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() =>
                                      handleApplyCouponFromList(c.code)
                                    }
                                    sx={{
                                      minWidth: "70px",
                                      textTransform: "uppercase",
                                      fontWeight: 700,
                                      fontSize: "0.75rem",
                                      borderColor: "#DFF200",
                                      color: "#111111",
                                      borderWidth: "2px",
                                      borderRadius: "8px",
                                      "&:hover": {
                                        borderColor: "#CBE600",
                                        bgcolor: "#DFF200",
                                        borderWidth: "2px",
                                      },
                                    }}
                                  >
                                    Apply
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Checkout Button */}
                    <Button
                      onClick={() => navigate("/checkout?step=2")}
                      variant="contained"
                      fullWidth
                      sx={{
                        py: 2,
                        fontSize: "1.125rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        borderRadius: "16px",
                        bgcolor: "#DFF200",
                        color: "#111111",
                        border: "2px solid #CBE600",
                        boxShadow: "0 8px 24px rgba(223, 242, 0, 0.3)",
                        letterSpacing: "0.5px",
                        "&:hover": {
                          bgcolor: "#CBE600",
                          boxShadow: "0 12px 32px rgba(223, 242, 0, 0.4)",
                          transform: "translateY(-2px)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      Proceed to Checkout
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-xs text-[#111111]/60 font-medium pt-2">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Safe & Secure Payments</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Cart State */
        <div className="flex flex-col justify-center items-center py-20 min-h-[70vh] px-4">
          <div className="bg-white border-2 border-[#DFF200] rounded-3xl shadow-2xl p-12 text-center max-w-md">
            <div className="w-32 h-32 mx-auto mb-6 bg-[#DFF200]/20 rounded-full flex items-center justify-center">
              <ShoppingCartOutlinedIcon
                sx={{ fontSize: 80, color: "#DFF200" }}
              />
            </div>
            <h2 className="text-3xl font-bold text-[#111111] mb-3 uppercase">
              Your Cart is Empty
            </h2>
            <p className="text-[#111111]/60 mb-8 text-lg font-medium">
              Start adding items to your cart and make your shopping experience
              amazing!
            </p>
            <Button
              onClick={() => navigate("/")}
              variant="contained"
              size="large"
              sx={{
                px: 6,
                py: 2,
                fontSize: "1rem",
                fontWeight: 700,
                textTransform: "uppercase",
                borderRadius: "12px",
                bgcolor: "#DFF200",
                color: "#111111",
                border: "2px solid #CBE600",
                "&:hover": {
                  bgcolor: "#CBE600",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 24px rgba(223, 242, 0, 0.4)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Start Shopping
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
