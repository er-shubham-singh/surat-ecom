
import Confetti from "react-confetti";
import React, { useEffect, useState } from "react";
import CartItem from "./CartItem";
import { Backdrop, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCart } from "../redux/Cart/Action";
import RequireLogin from "../Component/auth/RequireLogin";
import DiscountIcon from "@mui/icons-material/Discount";
import VerifiedIcon from "@mui/icons-material/Verified";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Box } from "@mui/material";
import { applyCoupon, allCoupon, clearCouponState } from "../redux/Coupon/couponActions";

// A custom hook to get the window size for the confetti
const useWindowSize = () => {
  const getSize = () => ({
    width: window.innerWidth,
    height: Math.max(window.innerHeight, document.documentElement.clientHeight, document.body.scrollHeight),
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

  // This useEffect will run only once when the component mounts.
  // It dispatches an action to clear the coupon state in Redux,
  // preventing the success message and confetti from showing on page refresh.
  useEffect(() => {
    dispatch(clearCouponState());
  }, [dispatch]);

  useEffect(() => {
    if (jwt) {
      dispatch(getCart(jwt));
      dispatch(allCoupon());
    }
  }, [dispatch, jwt]);

  // This useEffect now correctly handles the celebration when a coupon is applied.
  // It depends on the Redux state, which is now clean on page load.
  useEffect(() => {
    if (message && !error) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000); // Confetti and message show for 5 seconds

      return () => clearTimeout(timer);
    }
  }, [message, error, dispatch]);


  const handleApplyCoupon = () => {
    if (!couponCode || !user || !user._id || !cart.cart?._id) return;
    const cartTotal = cart.cart.totalDiscountedPrice;
    dispatch(applyCoupon(couponCode, user._id, cart.cart._id, cartTotal));
  };

  const handleApplyCouponFromList = (code) => {
    setCouponCode(code);
    dispatch(applyCoupon(code, user._id, cart.cart._id, cart.cart.totalDiscountedPrice));
  };


  const toggleCoupons = () => {
    setShowAvailableCoupons((prev) => !prev);
  };
  
  // Renders a login requirement message if the user is not authenticated.
  if (!jwt) {
    return <RequireLogin message="Please log in to view your cart." />;
  }

  // Renders a loading spinner while the cart data is being fetched.
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
    <div className="bg-gray-50 min-h-screen p-4 md:p-8 font-sans relative">
      {/* Conditionally render confetti and celebration message */}
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
    top: "1.5rem", // same as top-6
    left: "50%",
    transform: "translateX(-50%)",
    bgcolor: "success.main", // MUI green from theme
    color: "common.white",   // <-- This ensures the text is white
    px: 3,
    py: 1.5,
    borderRadius: "12px",
    boxShadow: 6,
    fontSize: {
      xs: "0.875rem",
      sm: "1rem",
      md: "1.125rem",
    },
    fontWeight: 600,
    textAlign: "center",
    zIndex: (theme) => theme.zIndex.modal + 2, // High z-index
    width: {
      xs: "92%",
      sm: "auto",
    },
    maxWidth: 400,
    animation: "bounce 1s infinite",
    "@keyframes bounce": {
      "0%, 100%": {
        transform: "translateX(-50%) translateY(0)",
      },
      "50%": {
        transform: "translateX(-50%) translateY(-8px)",
      },
    },
  }}
>
  🎉 Coupon Applied Successfully!
</Box>

  </>
)}


      {cart.cartItems?.length > 0 ? (
        <div className="lg:grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items Section */}
          <div className="lg:col-span-2 space-y-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Shopping Cart ({cart.cart?.totalItem || 0})</h1>
            {cart.cartItems.flat().map((item, i) =>
              item ? (
                <CartItem
                  item={item}
                  showButton={true}
                  key={item._id || item.productId || i}
                />
              ) : null
            )}
          </div>

          {/* Price Summary Section */}
          <div className="lg:col-span-1 mt-6 lg:mt-0">
            <div className="sticky top-20 bg-white rounded-xl shadow-lg p-6">
              <p className="text-lg font-bold text-gray-700 pb-4 border-b">PRICE DETAILS</p>
              
              <div className="space-y-4 font-medium text-gray-600 my-4">
                <div className="flex justify-between items-center">
                  <span>Price ({cart.cart?.totalItem || 0} items)</span>
                  <span className="text-gray-800">₹{cart.cart?.totalPrice || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Discount</span>
                  <span className="text-green-600 font-semibold">-₹{cart.cart?.discounte || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Delivery Charges</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
                {couponCode && coupon?.difference > 0 && (
                  <div className="flex justify-between items-center text-sm font-semibold text-green-700 bg-green-50 px-3 py-1 rounded">
                    <span>Coupon Discount ({couponCode.toUpperCase()})</span>
                    <span>-₹{coupon.difference}</span>
                  </div>
                )}
                <div className="flex justify-between items-center border-t pt-4 font-bold text-lg text-gray-800">
                  <span>Total Amount</span>
                  <span className="text-green-600">
                    ₹
                    {(cart.cart?.totalDiscountedPrice || 0) - (coupon?.difference || 0)}
                  </span>
                </div>
              </div>

              {/* Coupon Application Section */}
              <div className="mt-6 border-t pt-6">
                <div className="flex items-center justify-between text-blue-600 cursor-pointer" onClick={toggleCoupons}>
                  <div className="flex items-center gap-2">
                    <DiscountIcon />
                    <p className="font-semibold">
                      {showAvailableCoupons ? "Hide Coupons" : "View & Apply Coupons"}
                    </p>
                  </div>
                  {showAvailableCoupons ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </div>

                {/* Coupon Input */}
                <div className="flex flex-col gap-3 mt-4">
                  <div className="flex w-full">
                    <input
                      type="text"
                      placeholder="Enter coupon code (e.g. FLUTEON100)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="border-gray-300 border rounded-l-lg px-4 py-2 w-full text-sm focus:outline-blue-500"
                    />
                    <Button
                      variant="contained"
                      onClick={handleApplyCoupon}
                      disabled={!couponCode.trim()}
                      sx={{
                        height: "42px",
                        textTransform: "none",
                        fontWeight: 600,
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        backgroundColor: "#1e40af",
                        '&:hover': {
                          backgroundColor: '#1c3d9a',
                        },
                      }}
                    >
                      Apply
                    </Button>
                  </div>

                  {message && (
                    <div className="flex items-center gap-2 text-green-600 text-sm font-medium bg-green-50 p-2 rounded-md">
                      <VerifiedIcon fontSize="small" />
                      <span>{message} (–₹{discountAmount})</span>
                    </div>
                  )}

                  {error && (
                    <div className="flex items-center gap-2 text-red-600 text-sm font-medium bg-red-50 p-2 rounded-md">
                      <ErrorOutlineIcon fontSize="small" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>

                {/* Available Coupons List */}
                {showAvailableCoupons && availableCoupons.length > 0 && (
                  <div className="bg-gray-100 rounded-lg border border-gray-200 mt-4 p-4 space-y-3 max-h-64 overflow-y-auto">
                    {availableCoupons.map((c) => (
                      <div
                        key={c._id}
                        className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-3 last:border-b-0"
                      >
                        <div className="flex flex-col gap-1">
                          <p className="font-semibold text-sm uppercase text-gray-800">{c.code}</p>
                          <p className="text-xs text-gray-600">
                            {c.discountType === "flat"
                              ? `Flat ₹${c.discountValue} off`
                              : `${c.discountValue}% off up to ₹${c.maxDiscountAmount}`}
                          </p>
                          <p className="text-xs text-gray-500">
                            Min Order Amount: ₹{c.minOrderAmount}
                          </p>
                          <p className="text-xs text-gray-400">
                            Valid till:{" "}
                            {new Date(c.expiresAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <Button
                          size="small"
                          variant="outlined"
                          sx={{
                            marginTop: "0.5rem",
                            minWidth: "80px",
                            textTransform: "none",
                            fontWeight: 600,
                          }}
                          onClick={() => handleApplyCouponFromList(c.code)}
                        >
                          Apply
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Checkout Button */}
              <Button
                onClick={() => navigate("/checkout?step=2")}
                variant="contained"
                sx={{
                  padding: ".8rem 2rem",
                  marginTop: "1.5rem",
                  width: "100%",
                  backgroundColor: "#1e40af",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  textTransform: "none",
                  borderRadius: "8px",
                  '&:hover': {
                    backgroundColor: '#1c3d9a',
                  },
                }}
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Cart State */
        <div className="flex flex-col justify-center items-center py-20 min-h-screen">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
            alt="Empty Cart"
            className="w-36 h-36 mb-6 opacity-60"
          />
          <p className="text-2xl font-bold text-gray-700 mb-2">
            Your cart is empty
          </p>
          <p className="text-gray-500 mb-6">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Button
            onClick={() => navigate("/")}
            variant="contained"
            sx={{
              padding: "12px 32px",
              backgroundColor: "#1e40af",
              '&:hover': {
                backgroundColor: '#1c3d9a',
              },
            }}
          >
            Continue Shopping
          </Button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
