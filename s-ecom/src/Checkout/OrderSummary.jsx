import React, { useEffect, useState } from "react";
import { Backdrop, Button, CircularProgress } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import CartItem from "../Cart/CartItem";
import AddressCard from "../adreess/AdreessCard";
import { getOrderById } from "../redux/Order/Action";
import { createPayment } from "../redux/Payment/Action";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const OrderSummary = () => {
  const [usedCoins, setUsedCoins] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get("order_id");
  const jwt = localStorage.getItem("jwt");
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [isLoadingOrder, setIsLoadingOrder] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const { order: orderState } = useSelector((state) => state);
  const order = orderState.order;

  useEffect(() => {
    if (order) {
      console.log("🧾 Order Object:", order);
    }
  }, [order]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoadingOrder(true);
        await dispatch(getOrderById(orderId));
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setIsLoadingOrder(false);
      }
    };

    if (orderId) fetchOrder();
  }, [dispatch, orderId]);

  const handleCreatePayment = () => {
    const data = {
      orderId: order?._id,
      jwt,
      usedSuperCoins: usedCoins,
    };

    setIsLoadingPayment(true);
    dispatch(createPayment(data)).finally(() => setIsLoadingPayment(false));
  };

  if (
    isLoadingOrder ||
    !order ||
    !order.totalDiscountedPrice ||
    !order.orderItems
  ) {
    return (
      <Backdrop
        open
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <div className="text-center">
          <CircularProgress color="inherit" />
          <span className="ml-3 text-white font-bold text-lg">
            Loading Order...
          </span>
        </div>
      </Backdrop>
    );
  }

  return (
    <div className="space-y-6">
      {/* Address Card */}
      <div className="bg-white rounded-2xl border-2 border-[#DFF200] shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-[#DFF200] to-[#CBE600] px-6 py-4 border-b-2 border-[#CBE600]">
          <h2 className="text-xl font-bold text-[#111111] uppercase tracking-wide flex items-center gap-2">
            <LocationOnIcon sx={{ fontSize: 24 }} />
            Delivery Address
          </h2>
        </div>
        <div className="p-6">
          <AddressCard address={order?.shippingAddress} />
        </div>
      </div>

      <div className="lg:grid grid-cols-3 gap-6">
        {/* Cart Items - UPDATED WITH ENHANCED SHADOWS AND HOVER */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[#DFF200] to-[#CBE600] px-6 py-4">
              <h2 className="text-xl font-bold text-[#111111] uppercase tracking-wide flex items-center gap-2">
                <ReceiptLongIcon sx={{ fontSize: 24 }} />
                Order Items ({order?.totalItem})
              </h2>
            </div>
            <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
              {order?.orderItems?.map((item) => (
                <div
                  key={item._id}
                  className="transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 rounded-xl"
                  style={{
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 12px 32px rgba(0, 0, 0, 0.18)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 4px 16px rgba(0, 0, 0, 0.12)";
                  }}
                >
                  <CartItem item={item} showButton={false} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Price Summary */}
        <div className="lg:col-span-1 mt-6 lg:mt-0">
          <div className="sticky top-6">
            <div className="bg-white rounded-2xl border-2 border-[#DFF200] shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#DFF200] to-[#CBE600] px-6 py-4 border-b-2 border-[#CBE600]">
                <h2 className="text-xl font-bold text-[#111111] uppercase tracking-wide">
                  Price Details
                </h2>
              </div>

              <div className="p-6 space-y-6">
                {/* 🪙 Super Coin Usage Section */}
                <div className="border-2 border-[#DFF200] rounded-xl p-4 bg-[#FFFDF6]">
                  <div className="flex items-center gap-2 mb-3">
                    <MonetizationOnIcon
                      sx={{ color: "#f9a825", fontSize: 24 }}
                    />
                    <p className="font-bold text-[#111111] text-base">
                      Super Coins
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm font-medium text-[#111111]">
                      <div>
                        <span>Available: </span>
                        <span className="text-green-600 font-bold text-base">
                          {user?.superCoins || 0}
                        </span>
                      </div>
                      <div className="bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                        <span className="text-blue-700 font-semibold text-xs">
                          ₹1 = 1 Coin
                        </span>
                      </div>
                    </div>

                    {order?.earnedSuperCoins > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-center">
                        <span className="text-sm text-blue-700 font-semibold">
                          🎉 +{order.earnedSuperCoins} coins from this order!
                        </span>
                      </div>
                    )}

                    {/* Coin Input */}
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Use coins"
                        value={usedCoins}
                        onChange={(e) => {
                          const value = Math.min(
                            Number(e.target.value),
                            user?.superCoins || 0
                          );
                          setUsedCoins(value >= 0 ? value : 0);
                        }}
                        className="border-2 border-[#DFF200] rounded-xl px-3 py-2 w-full focus:outline-none focus:border-[#CBE600] focus:ring-2 focus:ring-[#DFF200]/30 font-semibold"
                      />
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          if (usedCoins > (user?.superCoins || 0)) {
                            setUsedCoins(user?.superCoins || 0);
                          }
                        }}
                        sx={{
                          borderColor: "#DFF200",
                          color: "#111111",
                          fontWeight: 700,
                          borderWidth: 2,
                          "&:hover": {
                            borderColor: "#CBE600",
                            bgcolor: "#DFF200",
                            borderWidth: 2,
                          },
                        }}
                      >
                        Apply
                      </Button>
                    </div>

                    <p className="text-xs text-[#111111]/60 italic text-center">
                      💡 Use your coins to reduce the final amount
                    </p>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-base">
                    <span className="text-[#111111]/70 font-medium">
                      Price ({order?.totalItem} items)
                    </span>
                    <span className="font-bold text-[#111111]">
                      ₹{order?.totalPrice}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-base">
                    <span className="text-[#111111]/70 font-medium">
                      Discount
                    </span>
                    <span className="text-green-600 font-bold">
                      -₹{order?.discounte}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-base">
                    <span className="text-[#111111]/70 font-medium">
                      Delivery Charges
                    </span>
                    <span className="text-green-600 font-bold uppercase text-sm">
                      Free
                    </span>
                  </div>

                  {order?.couponDiscount > 0 && (
                    <div className="bg-green-50 border-2 border-green-300 rounded-xl p-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <LocalOfferIcon
                            sx={{ fontSize: 20, color: "#059669" }}
                          />
                          <span className="text-green-800 font-bold text-sm">
                            Coupon Applied
                          </span>
                        </div>
                        <span className="text-green-700 font-bold text-lg">
                          -₹{order?.couponDiscount}
                        </span>
                      </div>
                    </div>
                  )}

                  {usedCoins > 0 && (
                    <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <MonetizationOnIcon
                            sx={{ fontSize: 20, color: "#f9a825" }}
                          />
                          <span className="text-yellow-800 font-bold text-sm">
                            Super Coins Used
                          </span>
                        </div>
                        <span className="text-yellow-700 font-bold text-lg">
                          -₹{usedCoins}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="border-t-2 border-[#DFF200] pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xl font-bold text-[#111111] uppercase">
                        Total Amount
                      </span>
                      <span className="text-3xl font-bold text-[#111111]">
                        ₹
                        {Math.max(
                          (order?.totalDiscountedPrice || 0) - usedCoins,
                          0
                        )}
                      </span>
                    </div>
                    {(order?.discounte > 0 ||
                      order?.couponDiscount > 0 ||
                      usedCoins > 0) && (
                      <div className="flex justify-end">
                        <div className="bg-[#DFF200] px-4 py-2 rounded-full">
                          <p className="text-sm font-bold text-[#111111]">
                            You saved ₹
                            {(order?.discounte || 0) +
                              (order?.couponDiscount || 0) +
                              usedCoins}
                            ! 🎉
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Button */}
                <Button
                  onClick={handleCreatePayment}
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
                  Proceed to Payment
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

      {/* Payment Loading */}
      {isLoadingPayment && (
        <Backdrop
          open
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <div className="text-center">
            <CircularProgress color="inherit" />
            <span className="ml-3 text-white font-bold text-lg">
              Redirecting to payment gateway...
            </span>
          </div>
        </Backdrop>
      )}

      {/* Custom Scrollbar Styling */}
      <style>{`
        .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #CBE600;
          border-radius: 4px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #DFF200;
        }
      `}</style>
    </div>
  );
};

export default OrderSummary;
