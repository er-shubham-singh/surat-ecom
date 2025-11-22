
import React, { useEffect, useState } from "react";
import {
  Backdrop,
  Button,
  CircularProgress,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import CartItem from "../Cart/CartItem";
import AddressCard from "../adreess/AdreessCard";
import { getOrderById } from "../redux/Order/Action";
import { createPayment } from "../redux/Payment/Action";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

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
      <Backdrop open sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
        <span className="ml-3 text-white font-medium">Loading Order...</span>
      </Backdrop>
    );
  }

  return (
    <div className="space-y-5">
      {/* Address Card */}
      <div className="p-5 shadow-lg rounded-md border">
        <AddressCard address={order?.shippingAddress} />
      </div>

      <div className="lg:grid grid-cols-3 relative justify-between">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-3">
            {order?.orderItems?.map((item) => (
              <CartItem key={item._id} item={item} showButton={false} />
            ))}
          </div>
        </div>

        {/* Right Side: Coupon + Price Summary */}
        <div className="sticky top-0 mt-5 lg:mt-0 lg:ml-5">
          <div className="border p-5 bg-white shadow-lg rounded-md">

            {/* 💰 Price Details */}
            <p className="font-bold opacity-60 pb-4">PRICE DETAILS</p>
            <hr />
            {/* 🪙 Super Coin Usage Section */}
<div className="mb-6 border p-4 rounded-md bg-yellow-50 shadow">
  <div className="flex items-center gap-2 mb-2">
    <MonetizationOnIcon sx={{ color: "#f9a825" }} />
    <p className="font-semibold text-gray-700">Super Coins</p>
  </div>

  <div className="flex items-center justify-between text-sm font-medium text-gray-800">
    <div>
      <span>Available:</span>{" "}
<span className="text-green-600 font-semibold">
  {user?.superCoins || 0}
</span>
{order?.earnedSuperCoins > 0 && (
  <span className="text-sm text-blue-600 font-medium ml-2">
    (+{order.earnedSuperCoins} earned from this order)
  </span>
)}
    </div>
    <div>
      <span className="text-blue-600">₹1 = 1 Coin</span>
    </div>
  </div>

  {/* Optional: input to use coins manually */}
<div className="mt-3 flex gap-2">
  <input
    type="number"
    placeholder="Use coins"
    value={usedCoins}
    onChange={(e) => {
      const value = Math.min(Number(e.target.value), user?.superCoins || 0);
      setUsedCoins(value >= 0 ? value : 0);
    }}
    className="border rounded-md px-3 py-1 w-full focus:outline-blue-500"
  />
  <Button
    size="small"
    variant="outlined"
    onClick={() => {
      // Optional logic if you want a manual apply button
      if (usedCoins > (user?.superCoins || 0)) {
        setUsedCoins(user?.superCoins || 0);
      }
    }}
  >
    Apply
  </Button>
</div>


  {/* Info note */}
  <p className="mt-2 text-xs text-gray-600 italic">
    You’ll earn more Super Coins after this order!
  </p>
</div>

            <div className="space-y-3 font-semibold">
              <div className="flex justify-between pt-3 text-black">
                <span>Price ({order?.totalItem} item)</span>
                <span>₹{order?.totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span className="text-green-700">
                  -₹{order?.discounte}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="text-green-700">Free</span>
              </div>
              <div className="flex justify-between">
  <span>Coupon Applied</span>
  <span className="text-green-700">
    -₹{order?.couponDiscount || 0}
  </span>
</div>

              <hr />
<div className="flex justify-between font-bold text-lg">
  <span>Total Amount</span>
  <span className="text-green-700">
    ₹{Math.max((order?.totalDiscountedPrice || 0) - usedCoins, 0)}
  </span>
</div>


            </div>

            {/* 💳 Payment Button */}
            <Button
              onClick={handleCreatePayment}
              variant="contained"
              type="submit"
              sx={{ padding: ".8rem 2rem", marginTop: "2rem", width: "100%" }}
            >
              Payment
            </Button>
          </div>
        </div>
      </div>

      {/* ⏳ Loader for payment */}
      {isLoadingPayment && (
        <Backdrop open sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <CircularProgress color="inherit" />
          <span className="ml-3 text-white font-medium">
            Redirecting to payment...
          </span>
        </Backdrop>
      )}
    </div>
  );
};

export default OrderSummary;
