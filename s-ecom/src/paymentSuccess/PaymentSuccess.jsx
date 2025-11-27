import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePayment } from "../redux/Payment/Action";
import { Alert, AlertTitle, Box, Grid, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { getOrderById } from "../redux/Order/Action";
import OrderTraker from "../orders/OrderTraker";
import AddressCard from "../adreess/AdreessCard";
import { useParams } from "react-router-dom";

const PaymentSuccess = () => {
  const baseUrl = import.meta.env.VITE_React_BASE_API_URL;
  const [paymentId, setPaymentId] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const { orderId } = useParams();
  const jwt = localStorage.getItem("jwt");
  const dispatch = useDispatch();
  const { order } = useSelector((store) => store);

  useEffect(() => {
    console.log("orderId", orderId);
    const urlParams = new URLSearchParams(window.location.search);
    setPaymentId(urlParams.get("razorpay_payment_id"));
    setReferenceId(urlParams.get("razorpay_payment_link_reference_id"));
    setPaymentStatus(urlParams.get("razorpay_payment_link_status"));
  }, []);

  useEffect(() => {
    if (paymentId && paymentStatus === "paid") {
      const data = { orderId, paymentId, jwt };
      dispatch(updatePayment(data));
      dispatch(getOrderById(orderId));
    }
  }, [orderId, paymentId]);

  console.log("payment success", order);

  return (
    <div className="min-h-screen bg-[#FFFDF6] py-8 px-4 lg:px-36">
      {/* Success Header - Blended, No Borders */}
      <div className="flex flex-col justify-center items-center mb-8">
        <div className="bg-gradient-to-br from-[#DFF200]/30 via-[#CBE600]/20 to-transparent backdrop-blur-sm p-8 text-center max-w-2xl w-full rounded-2xl">
          <div className="w-20 h-20 bg-gradient-to-br from-[#DFF200] to-[#CBE600] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <CheckCircleIcon sx={{ fontSize: 48, color: "#111111" }} />
          </div>
          <h1 className="text-3xl font-bold text-[#111111] mb-2">
            🎉 Payment Successful!
          </h1>
          <p className="text-lg text-[#111111]/70 font-medium mb-4">
            Congratulations! Your order has been placed successfully
          </p>
          {paymentId && (
            <div className="bg-white/50 backdrop-blur-sm pl-4 py-2 rounded-lg inline-block">
              <p className="text-sm text-[#111111]/60 font-semibold">
                Payment ID
              </p>
              <p className="text-base font-bold text-[#111111]">{paymentId}</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Tracker */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <LocalShippingIcon sx={{ fontSize: 28, color: "#111111" }} />
          <h2 className="text-2xl font-bold text-[#111111]">Order Status</h2>
        </div>
        <OrderTraker activeStep={1} />
        <p className="text-sm text-gray-500 mt-4 text-center">
          💡 Track status anytime in{" "}
          <span className="font-bold">My Orders</span>
        </p>
      </div>

      {/* Order Items */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-[#111111] mb-4">
          📦 Order Items ({order.order?.orderItems?.length || 0})
        </h2>

        {order.order?.orderItems?.map((item, index) => (
          <div
            key={item._id || index}
            className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
          >
            <Grid container className="p-6">
              {/* Product Details */}
              <Grid item xs={12} md={7}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div
                    className="w-full sm:w-32 h-32 rounded-xl overflow-hidden flex-shrink-0 border-2 border-[#DFF200]"
                    style={{
                      boxShadow: "0 4px 12px rgba(223, 242, 0, 0.2)",
                    }}
                  >
                    <img
                      className="w-full h-full object-cover object-top"
                      src={item?.product?.imageUrl[0]}
                      alt="Product"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-bold text-[#111111] leading-tight">
                      {item.product.title}
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      <span className="bg-[#FFFDF6] border border-[#DFF200] px-3 py-1 rounded-lg text-xs font-semibold text-[#111111]">
                        Size: {item.size}
                      </span>
                      <span className="bg-[#FFFDF6] border border-[#DFF200] px-3 py-1 rounded-lg text-xs font-semibold text-[#111111]">
                        Qty: {item.quantity}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-[#111111]">
                        ₹{item.discountedPrice}
                      </span>
                      {item.price > item.discountedPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{item.price}
                        </span>
                      )}
                    </div>

                    <div className="bg-[#DFF200]/20 border-l-2 border-[#DFF200] pl-3 py-1 rounded-r inline-block">
                      <p className="text-xs text-[#111111]/60 font-semibold">
                        Brand
                      </p>
                      <p className="text-sm font-bold text-[#111111]">
                        {item.product.brand}
                      </p>
                    </div>
                  </div>
                </div>
              </Grid>

              {/* Delivery Address */}
              <Grid item xs={12} md={5} className="mt-6 md:mt-0 md:pl-6">
                <div className="bg-[#FFFDF6] rounded-xl p-4 border-2 border-[#DFF200]/50">
                  <h4 className="text-sm font-bold text-[#111111] mb-3 flex items-center gap-2">
                    <LocalShippingIcon sx={{ fontSize: 18 }} />
                    Delivery Address
                  </h4>
                  <AddressCard address={order.order?.shippingAddress} />
                </div>
              </Grid>
            </Grid>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-8 bg-gradient-to-r from-[#DFF200]/20 to-[#CBE600]/10 rounded-2xl p-6 text-center border-2 border-[#DFF200]/30">
        <p className="text-base font-semibold text-[#111111] mb-2">
          📧 Order confirmation has been sent to your email
        </p>
        <p className="text-sm text-[#111111]/70">
          Thank you for shopping with us! 🛍️
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
