

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  Chip,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOrderById, returnOrder } from "../redux/Order/Action";
import AddressCard from "../adreess/AdreessCard";
import OrderTraker from "./OrderTraker";
import BackdropComponent from "../BackDrop/Backdrop";
import { deepPurple } from "@mui/material/colors";
import { motion } from "framer-motion";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import ReturnDialog from "./ReturnDialog";

import {
  AccessTime,
  LocalShipping,
  Cancel,
  Replay,
  Done,
} from "@mui/icons-material";

// Map of statuses to tracker step indexes
const statusStepMap = {
  PLACED: 0,
  CONFIRMED: 1,
  SHIPPED: 2,
  OUTFORDELIVERY: 3,
  DELIVERED: 4,
  RETURNED_REQUESTED: 5,
  RETURNED: 5,
  RETURN_REJECTED: 6,
  CANCELLED: 4,
};

// Status → Icon mapping
const getStatusIcon = (status) => {
  const normalized = status?.toLowerCase().replace(/\s+/g, "");
  switch (normalized) {
    case "confirmed":
      return <AccessTime fontSize="small" color="action" />;
    case "shipped":
      return <LocalShipping fontSize="small" color="primary" />;
    case "outfordelivery":
      return <DirectionsBikeIcon fontSize="small" sx={{ color: "#FB8C00" }} />;
    case "delivered":
      return <Done fontSize="small" color="success" />;
    case "cancelled":
      return <Cancel fontSize="small" color="error" />;
    case "returned":
    case "returned_requested":
      return <Replay fontSize="small" color="warning" />;
    case "return_rejected":
      return <Cancel fontSize="small" sx={{ color: "#9e9e9e" }} />;
    default:
      return <AccessTime fontSize="small" color="action" />;
  }
};

const OrderDetails = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { order } = useSelector((store) => store);
const returnLoading = order?.returnLoading;
  const [returnOpen, setReturnOpen] = useState(false);

  useEffect(() => {
    dispatch(getOrderById(orderId));
  }, [dispatch, orderId]);

  const currentOrder = order?.order;
  const status = currentOrder?.orderStatus?.toUpperCase().replace(/\s+/g, "") || "";

  console.log("current order",currentOrder)
  const activeStep = statusStepMap[status] ?? 0;

const baseSteps = ["Placed", "Confirmed", "Shipped", "Out For Delivery", "Delivered"];
const extendedSteps = [...baseSteps, "Return Requested", "Return Rejected"];


const isDelivered = statusStepMap[status] >= statusStepMap["DELIVERED"];

let steps = [...baseSteps];

if (isDelivered) {
  if (status === "RETURNED_REQUESTED") {
    steps.push("Return Requested");
  } else if (status === "RETURN_REJECTED") {
    steps.push("Return Requested", "Return Rejected");
  } else if (status === "RETURNED") {
    steps.push("Return Requested", "Return Accepted"); // ✅ show correct status
  }
}


  const createdDate = new Date(currentOrder?.createdAt);
  const expectedDateObj = new Date(createdDate);
  expectedDateObj.setDate(createdDate.getDate() + 4);

  const formattedExpectedDate = expectedDateObj.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });

  const shouldShowExpectedDate = !["DELIVERED", "CANCELLED", "RETURNED", "RETURN_REJECTED"].includes(status);
  const isOutForDelivery = status === "OUTFORDELIVERY";

  const getDeliveryText = () => {
    switch (status) {
      case "PLACED": return "Order Placed On";
      case "CONFIRMED": return "Confirmed On";
      case "SHIPPED": return "Shipped On";
      case "OUTFORDELIVERY": return "Out for Delivery On";
      case "DELIVERED": return "Delivered On";
      case "CANCELLED": return "Cancelled On";
      case "RETURNED": return "Returned On";
      default: return "Status Updated On";
    }
  };

  const getDeliveryDate = () => {
    const statusUpdated = new Date(currentOrder?.statusUpdatedAt);
    return statusUpdated.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  };


  return (
    <>
      {!order.loading && (
        <motion.div
          className="px-2 lg:px-36 space-y-7"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Address */}
          <Grid container className="p-3 shadow-lg bg-white rounded-md">
            <Grid item xs={12}>
              <Typography className="font-bold text-lg pb-2">Delivery Address</Typography>
              <AddressCard address={currentOrder?.shippingAddress} />
            </Grid>
          </Grid>

          {/* Order Tracker & Actions */}
          <Box className="p-5 shadow-lg border rounded-md bg-white">
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item xs={12} md={9}>
<OrderTraker activeStep={activeStep} steps={steps || []} />

                {shouldShowExpectedDate && (
                  <Box className="pt-2 text-sm text-gray-700">
                    {isOutForDelivery ? (
                      <Typography sx={{ color: "#FB8C00", fontWeight: 500 }}>
                        Your item is Out for Delivery. It will be delivered today.
                      </Typography>
                    ) : (
                      <Typography sx={{ color: "#FB8C00", fontSize: "14px" }}>
                        Expected Delivery:{" "}
                        <span style={{ fontWeight: 600, color: "#000000" }}>
                          {formattedExpectedDate}
                        </span>
                      </Typography>
                    )}
                  </Box>
                )}
              </Grid>

             <Grid item>
  {/* Return / Cancel Buttons */}
  {status === "DELIVERED" && !["RETURNED_REQUESTED", "RETURNED", "RETURN_REJECTED"].includes(status) && (
    <>
      <Button variant="text" color="error" onClick={() => setReturnOpen(true)}>RETURN</Button>
      <ReturnDialog
        open={returnOpen}
        onClose={() => setReturnOpen(false)}
        onConfirm={(formData) => {
          dispatch(returnOrder(orderId, formData)); // use as-is
          setReturnOpen(false);
        }}
      />
    </>
  )}

  {status === "RETURNED_REQUESTED" && (
    <Button disabled variant="outlined" color="warning">Return Requested</Button>
  )}

  {/* Cancel Order button temporarily disabled */}
  {/*
  {!["DELIVERED", "CANCELLED", "RETURNED_REQUESTED", "RETURNED"].includes(status) && (
    <Button variant="text" sx={{ color: deepPurple[500] }}>Cancel Order</Button>
  )}
  */}
</Grid>

            </Grid>
          </Box>

          {/* Ordered Items */}
          <Grid container spacing={2}>
            {currentOrder?.orderItems?.map((item, index) => (
              <Grid
                key={index}
                item
                xs={12}
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Box className="p-5 shadow-md rounded-md border bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex gap-4 items-start w-full md:w-auto">
                    <img
                      src={item?.product?.imageUrl?.[0]}
                      alt="Product"
                      className="w-[80px] h-[80px] object-cover rounded"
                    />
                    <Box className="space-y-1">
                      <Typography className="font-medium">{item?.product?.title}</Typography>
                      <Typography className="text-sm text-gray-600">
                        Color: {item?.product?.color} | Size: {item?.size}
                      </Typography>
                      <Typography className="text-sm text-gray-600">
                        ₹{item?.discountedPrice} | Quantity : {item?.quantity}
                      </Typography>
                      <Typography className="text-sm text-gray-600">
                        Seller: {item?.product?.brand}
                      </Typography>
                    </Box>
                  </div>

                  {/* Rate & Review */}
                  {status === "DELIVERED" && (
                    <Box
                      sx={{ color: deepPurple[500] }}
                      className="flex items-center cursor-pointer w-full md:w-auto justify-start md:justify-end"
                      onClick={() => navigate(`/account/rate/${item?.product?._id}`)}
                    >
                      <StarIcon sx={{ fontSize: "1.8rem", mr: 1 }} />
                      <span>Rate & Review</span>
                    </Box>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Status Chip */}
          <Box className="pt-4 pb-10">
            <Chip
              label={
                status === "RETURNED_REQUESTED"
                  ? "Return Requested"
                  : status === "RETURN_REJECTED"
                  ? "Return Rejected"
                  : currentOrder?.orderStatus
              }
              icon={getStatusIcon(status)}
              color={
                status === "DELIVERED"
                  ? "success"
                  : status === "CANCELLED"
                  ? "error"
                  : ["RETURNED", "RETURNED_REQUESTED"].includes(status)
                  ? "warning"
                  : status === "RETURN_REJECTED"
                  ? "default"
                  : status === "OUTFORDELIVERY"
                  ? "warning"
                  : "primary"
              }
            />

            {/* Status updated date */}
            <Typography sx={{ fontSize: "14px", color: "#4B5563", mt: 1 }}>
              {getDeliveryText()}:{" "}
              <span style={{ fontWeight: 500, color: "#000000" }}>{getDeliveryDate()}</span>
            </Typography>

            {/* Admin note if exists */}
{["RETURNED", "RETURN_REJECTED", "RETURN_APPROVED"].includes(status) &&
  ((status === "RETURN_REJECTED" && currentOrder?.rejectionMessage) ||
    currentOrder?.adminNote || currentOrder?.returnTime) && (
    <Box className="mt-3 p-3 rounded-md border bg-gray-50">
      <Typography variant="subtitle2" sx={{ color: "black", fontWeight: 500 }}>
        Admin Message:
      </Typography>
      <Typography variant="body2" sx={{ color: "#4B5563" }}>
        {status === "RETURN_REJECTED"
          ? currentOrder.rejectionMessage
          : currentOrder.adminNote}
      </Typography>

      {status === "RETURNED" && currentOrder?.returnTime && (
        <Typography variant="body2" sx={{ color: "#4B5563", mt: 1 }}>
          <strong>Expected return processing time:</strong> {currentOrder.returnTime} day(s)
        </Typography>
      )}
    </Box>
)}


          </Box>
        </motion.div>
      )}
    <BackdropComponent open={order.loading || returnLoading} />

    </>
  );
};

export default OrderDetails;
