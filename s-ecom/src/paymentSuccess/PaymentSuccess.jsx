import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePayment } from "../redux/Payment/Action";
import { Alert, AlertTitle, Box, Grid, Typography } from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import StarIcon from "@mui/icons-material/Star";
import { getOrderById } from "../redux/Order/Action";
import OrderTraker from "../orders/OrderTraker";
import AddressCard from "../adreess/AdreessCard";
import { useParams } from "react-router-dom";

const PaymentSuccess = () => {
  const baseUrl = import.meta.env.VITE_React_BASE_API_URL
  const [paymentId, setPaymentId] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const {orderId}=useParams();
  const jwt = localStorage.getItem("jwt");
  const dispatch = useDispatch();
  const { order } = useSelector((store) => store);

  useEffect(() => {
    console.log("orderId",orderId)
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
console.log("payment success", order)
  return (
<div className="px-2 lg:px-36">
  <div className="flex flex-col justify-center items-center">
    <Alert
      variant="filled"
      severity="success"
      sx={{ mb: 6, width: "fit-content" }}
    >
      <AlertTitle>Payment Success</AlertTitle>
      Congratulation Your Order Get Placed
    </Alert>
  </div>

  <OrderTraker activeStep={1} />
 <Typography className="text-xs text-gray-500 mt-4 pt-4">
                      Track status anytime in My Orders.
                    </Typography>
  <Grid container className="space-y-5 py-5 pt-10">
    {order.order?.orderItems.map((item) => (
      <Grid
        container
        item
        className="shadow-xl rounded-md p-5 border"
        sx={{ alignItems: "center", justifyContent: "space-between" }}
      >
        <Grid item xs={12} md={6}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <img
              className="w-full sm:w-[5rem] h-auto sm:h-[5rem] object-cover object-top rounded"
              src={item?.product?.imageUrl[0]}
              alt="No image available"
            />
            <div className="space-y-2 sm:ml-5">
              <p className="">{item.product.title}</p>
              <p className="opacity-50 text-xs font-semibold space-x-5">
                <span>Color: pink</span> <span>Size: {item.size}</span>
              </p>
              <p>Quantity : {item.quantity}</p>
              <p>₹{item.discountedPrice}</p>
              <p>Seller: {item.product.brand}</p>
              
            </div>
          </div>
        </Grid>
        <Grid item xs={12} md="auto" className="mt-4 sm:mt-0">
          <AddressCard address={order.order?.shippingAddress} />
        </Grid>

      </Grid>
    ))}
  </Grid>
</div>

  );
};

export default PaymentSuccess;
