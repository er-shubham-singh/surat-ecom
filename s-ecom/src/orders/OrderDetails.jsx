import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Typography, Chip } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOrderById, returnOrder } from "../redux/Order/Action";
import AddressCard from "../adreess/AdreessCard";
import OrderTraker from "./OrderTraker";
import BackdropComponent from "../BackDrop/Backdrop";
import { motion } from "framer-motion";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import ReturnDialog from "./ReturnDialog";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

import { AccessTime, Cancel, Replay, Done } from "@mui/icons-material";

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
      return <AccessTime fontSize="small" />;
    case "shipped":
      return <LocalShippingIcon fontSize="small" />;
    case "outfordelivery":
      return <DirectionsBikeIcon fontSize="small" />;
    case "delivered":
      return <Done fontSize="small" />;
    case "cancelled":
      return <Cancel fontSize="small" />;
    case "returned":
    case "returned_requested":
      return <Replay fontSize="small" />;
    case "return_rejected":
      return <Cancel fontSize="small" />;
    default:
      return <AccessTime fontSize="small" />;
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
  const status =
    currentOrder?.orderStatus?.toUpperCase().replace(/\s+/g, "") || "";

  const activeStep = statusStepMap[status] ?? 0;

  const baseSteps = [
    "Placed",
    "Confirmed",
    "Shipped",
    "Out For Delivery",
    "Delivered",
  ];

  const isDelivered = statusStepMap[status] >= statusStepMap["DELIVERED"];

  let steps = [...baseSteps];

  if (isDelivered) {
    if (status === "RETURNED_REQUESTED") {
      steps.push("Return Requested");
    } else if (status === "RETURN_REJECTED") {
      steps.push("Return Requested", "Return Rejected");
    } else if (status === "RETURNED") {
      steps.push("Return Requested", "Return Accepted");
    }
  }

  const createdDate = new Date(currentOrder?.createdAt);
  const expectedDateObj = new Date(createdDate);
  expectedDateObj.setDate(createdDate.getDate() + 4);

  const formattedExpectedDate = expectedDateObj.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });

  const shouldShowExpectedDate = ![
    "DELIVERED",
    "CANCELLED",
    "RETURNED",
    "RETURN_REJECTED",
  ].includes(status);
  const isOutForDelivery = status === "OUTFORDELIVERY";

  const getDeliveryText = () => {
    switch (status) {
      case "PLACED":
        return "Order Placed On";
      case "CONFIRMED":
        return "Confirmed On";
      case "SHIPPED":
        return "Shipped On";
      case "OUTFORDELIVERY":
        return "Out for Delivery On";
      case "DELIVERED":
        return "Delivered On";
      case "CANCELLED":
        return "Cancelled On";
      case "RETURNED":
        return "Returned On";
      default:
        return "Status Updated On";
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
          className="min-h-screen bg-[#FFFDF6] py-8 px-4 sm:px-6 lg:px-36"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Box className="space-y-6">
            {/* Page Header */}
            <Box className="mb-6">
              <Typography className="text-3xl font-bold text-[#111111] mb-2">
                Order Details
              </Typography>
              <Typography className="text-[#111111]/60 text-sm">
                Order ID: #{currentOrder?._id?.slice(-8)}
              </Typography>
            </Box>

            {/* Address and Tracking Row */}
            <Grid container spacing={3}>
              {/* Delivery Address Card */}
              <Grid item xs={12} md={4}>
                <Box className="bg-white rounded-2xl shadow-md border-2 border-[#DFF200] overflow-hidden h-full">
                  <Box className="bg-gradient-to-r from-[#DFF200] to-[#CBE600] px-6 py-4 flex items-center gap-3">
                    <LocationOnIcon sx={{ fontSize: 28, color: "#111111" }} />
                    <Typography className="text-xl font-bold text-[#111111] uppercase tracking-wide">
                      Delivery Address
                    </Typography>
                  </Box>
                  <Box className="p-6">
                    <AddressCard address={currentOrder?.shippingAddress} />
                  </Box>
                </Box>
              </Grid>

              {/* Order Tracker Card */}
              <Grid item xs={12} md={8}>
                <Box className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden h-full">
                  <Box className="bg-gradient-to-r from-[#DFF200] to-[#CBE600] px-6 py-4 flex items-center gap-3">
                    <LocalShippingIcon
                      sx={{ fontSize: 28, color: "#111111" }}
                    />
                    <Typography className="text-xl font-bold text-[#111111] uppercase tracking-wide">
                      Order Tracking
                    </Typography>
                  </Box>
                  <Box className="p-6">
                    <Grid
                      container
                      justifyContent="space-between"
                      alignItems="flex-start"
                      spacing={3}
                    >
                      <Grid item xs={12} md={9}>
                        <OrderTraker
                          activeStep={activeStep}
                          steps={steps || []}
                        />

                        {shouldShowExpectedDate && (
                          <Box className="mt-4 bg-orange-50 border-2 border-orange-200 rounded-xl px-4 py-3">
                            {isOutForDelivery ? (
                              <Box className="flex items-center gap-2">
                                <DirectionsBikeIcon
                                  sx={{ color: "#FB8C00", fontSize: 20 }}
                                />
                                <Typography
                                  sx={{
                                    color: "#FB8C00",
                                    fontWeight: 600,
                                    fontSize: "14px",
                                  }}
                                >
                                  Your item is Out for Delivery. It will be
                                  delivered today.
                                </Typography>
                              </Box>
                            ) : (
                              <Box className="flex items-center gap-2">
                                <AccessTime
                                  sx={{ color: "#FB8C00", fontSize: 20 }}
                                />
                                <Typography
                                  sx={{ color: "#111111", fontSize: "14px" }}
                                >
                                  Expected Delivery:{" "}
                                  <span
                                    style={{
                                      fontWeight: 700,
                                      color: "#FB8C00",
                                    }}
                                  >
                                    {formattedExpectedDate}
                                  </span>
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        )}
                      </Grid>

                      <Grid item xs={12} md={3} className="flex justify-end">
                        {status === "DELIVERED" &&
                          ![
                            "RETURNED_REQUESTED",
                            "RETURNED",
                            "RETURN_REJECTED",
                          ].includes(status) && (
                            <>
                              <Button
                                variant="contained"
                                color="error"
                                onClick={() => setReturnOpen(true)}
                                sx={{
                                  borderRadius: "12px",
                                  px: 3,
                                  py: 1.5,
                                  fontWeight: 700,
                                  textTransform: "uppercase",
                                }}
                              >
                                Return Order
                              </Button>
                              <ReturnDialog
                                open={returnOpen}
                                onClose={() => setReturnOpen(false)}
                                onConfirm={(formData) => {
                                  dispatch(returnOrder(orderId, formData));
                                  setReturnOpen(false);
                                }}
                              />
                            </>
                          )}

                        {status === "RETURNED_REQUESTED" && (
                          <Button
                            disabled
                            variant="outlined"
                            color="warning"
                            sx={{
                              borderRadius: "12px",
                              px: 3,
                              py: 1.5,
                              fontWeight: 700,
                            }}
                          >
                            Return Requested
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {/* Ordered Items Card */}
            <Box className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
              <Box className="bg-gradient-to-r from-[#DFF200] to-[#CBE600] px-6 py-4 flex items-center gap-3">
                <ShoppingBagIcon sx={{ fontSize: 28, color: "#111111" }} />
                <Typography className="text-xl font-bold text-[#111111] uppercase tracking-wide">
                  Order Items ({currentOrder?.orderItems?.length || 0})
                </Typography>
              </Box>
              <Box className="p-4">
                <Grid container spacing={3}>
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
                      <Box className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-[#DFF200] transition-all duration-300 hover:shadow-lg">
                        <Box className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <Box className="flex gap-4 items-start flex-1">
                            <Box className="w-24 h-24 rounded-xl overflow-hidden bg-white border-2 border-gray-200 flex-shrink-0">
                              <img
                                src={item?.product?.imageUrl?.[0]}
                                alt="Product"
                                className="w-full h-full object-cover"
                              />
                            </Box>
                            <Box className="space-y-2 flex-1">
                              <Typography className="font-bold text-lg text-[#111111]">
                                {item?.product?.title}
                              </Typography>
                              <Box className="flex flex-wrap gap-2">
                                <span className="bg-white px-3 py-1 rounded-lg text-xs font-medium text-gray-700 border border-gray-200">
                                  Color: {item?.product?.color}
                                </span>
                                <span className="bg-white px-3 py-1 rounded-lg text-xs font-medium text-gray-700 border border-gray-200">
                                  Size: {item?.size}
                                </span>
                                <span className="bg-white px-3 py-1 rounded-lg text-xs font-medium text-gray-700 border border-gray-200">
                                  Qty: {item?.quantity}
                                </span>
                              </Box>
                              <Typography className="font-bold text-xl text-[#111111]">
                                ₹{item?.discountedPrice}
                              </Typography>
                              <Typography className="text-sm text-gray-600">
                                Seller: {item?.product?.brand}
                              </Typography>
                            </Box>
                          </Box>

                          {/* Rate & Review */}
                          {status === "DELIVERED" && (
                            <Box
                              onClick={() =>
                                navigate(`/account/rate/${item?.product?._id}`)
                              }
                              sx={{
                                bgcolor: "#DFF200",
                                border: "2px solid #CBE600",
                                "&:hover": {
                                  bgcolor: "#CBE600",
                                  transform: "scale(1.02)",
                                  boxShadow:
                                    "0 8px 20px rgba(223, 242, 0, 0.3)",
                                },
                              }}
                              className="flex items-center gap-2 rounded-xl px-5 py-3 cursor-pointer transition-all"
                            >
                              <StarIcon
                                sx={{ fontSize: "1.25rem", color: "#111111" }}
                              />
                              <span className="text-sm font-bold text-[#111111] uppercase tracking-wide">
                                Rate & Review
                              </span>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>

            {/* Order Status Card */}
            <Box className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden p-6">
              <Box className="flex items-center gap-3 mb-4">
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
                  sx={{ fontSize: "16px", fontWeight: 700, px: 2, py: 3 }}
                />
              </Box>

              <Typography
                sx={{ fontSize: "15px", color: "#4B5563", fontWeight: 500 }}
              >
                {getDeliveryText()}:{" "}
                <span style={{ fontWeight: 700, color: "#111111" }}>
                  {getDeliveryDate()}
                </span>
              </Typography>

              {/* Admin note if exists */}
              {["RETURNED", "RETURN_REJECTED", "RETURN_APPROVED"].includes(
                status
              ) &&
                ((status === "RETURN_REJECTED" &&
                  currentOrder?.rejectionMessage) ||
                  currentOrder?.adminNote ||
                  currentOrder?.returnTime) && (
                  <Box className="mt-4 p-4 rounded-xl border-2 border-orange-200 bg-orange-50">
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "#111111", fontWeight: 700, mb: 1 }}
                    >
                      📢 Admin Message:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#4B5563", fontWeight: 500 }}
                    >
                      {status === "RETURN_REJECTED"
                        ? currentOrder.rejectionMessage
                        : currentOrder.adminNote}
                    </Typography>

                    {status === "RETURNED" && currentOrder?.returnTime && (
                      <Typography
                        variant="body2"
                        sx={{ color: "#4B5563", mt: 1, fontWeight: 500 }}
                      >
                        <strong>Expected return processing time:</strong>{" "}
                        {currentOrder.returnTime} day(s)
                      </Typography>
                    )}
                  </Box>
                )}
            </Box>
          </Box>
        </motion.div>
      )}
      <BackdropComponent open={order.loading || returnLoading} />
    </>
  );
};

export default OrderDetails;
