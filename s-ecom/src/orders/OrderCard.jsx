import { Box, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CancelIcon from "@mui/icons-material/Cancel";
import ReplayIcon from "@mui/icons-material/Replay";
import DoneIcon from "@mui/icons-material/Done";
import StarIcon from "@mui/icons-material/Star";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import React from "react";
import { useNavigate } from "react-router-dom";

const getStatusIcon = (status) => {
  if (!status) return <AccessTimeIcon fontSize="small" />;
  const normalizedStatus = status.toLowerCase();
  switch (normalizedStatus) {
    case "confirmed":
      return <AccessTimeIcon fontSize="small" />;
    case "shipped":
      return <LocalShippingIcon fontSize="small" />;
    case "delivered":
      return <DoneIcon fontSize="small" />;
    case "cancelled":
      return <CancelIcon fontSize="small" />;
    case "returned":
      return <ReplayIcon fontSize="small" />;
    case "outfordelivery":
      return <DirectionsBikeIcon fontSize="small" />;
    default:
      return <AccessTimeIcon fontSize="small" />;
  }
};

const getStatusColor = (status) => {
  if (!status) return { bg: "#F3F4F6", color: "#6B7280", border: "#6B7280" };
  const normalizedStatus = status.toLowerCase();
  switch (normalizedStatus) {
    case "confirmed":
      return { bg: "#FFF9E8", color: "#F59E0B", border: "#F59E0B" };
    case "shipped":
      return { bg: "#DBEAFE", color: "#2563EB", border: "#2563EB" };
    case "delivered":
      return { bg: "#D1FAE5", color: "#059669", border: "#059669" };
    case "cancelled":
      return { bg: "#FEE2E2", color: "#DC2626", border: "#DC2626" };
    case "returned":
      return { bg: "#FED7AA", color: "#EA580C", border: "#EA580C" };
    case "outfordelivery":
      return { bg: "#E9D5FF", color: "#9333EA", border: "#9333EA" };
    default:
      return { bg: "#F3F4F6", color: "#6B7280", border: "#6B7280" };
  }
};

const OrderCard = ({ item, order, showViewDetails = true }) => {
  const navigate = useNavigate();

  // Safety check - return null if critical data is missing
  if (!item) {
    console.warn("OrderCard: item is undefined");
    return null;
  }

  // Handle cases where order might be undefined or incomplete
  const safeOrder = order || {};
  const orderStatus = safeOrder.orderStatus || "confirmed";
  const orderId = safeOrder._id || "unknown";
  const createdAt = safeOrder.createdAt || new Date().toISOString();
  const totalDiscountedPrice =
    safeOrder.totalDiscountedPrice || item?.discountedPrice || 0;
  const orderItemsLength =
    safeOrder.orderItems?.length || safeOrder.totalItem || 1;

  const isDelivered = orderStatus.toLowerCase() === "delivered";
  const statusColors = getStatusColor(orderStatus);

  const getExpectedMessage = () => {
    try {
      const status = orderStatus.toLowerCase();
      const expected = new Date(createdAt);
      expected.setDate(expected.getDate() + 4);
      const expectedDate = expected.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      });

      if (status === "delivered") return null;
      if (status === "outfordelivery") return `Expected by: ${expectedDate}`;
      return `Expected by: ${expectedDate}`;
    } catch (error) {
      console.error("Error in getExpectedMessage:", error);
      return null;
    }
  };

  const placedDate = (() => {
    try {
      return new Date(createdAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch (error) {
      return "N/A";
    }
  })();

  const handleCardClick = () => {
    if (orderId !== "unknown") {
      console.log("Navigating to order:", orderId);
      navigate(`/account/order/${orderId}`);
    }
  };

  return (
    <Box className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-[#DFF200]">
      {/* Main Content Row */}
      <Box
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Left: Image + Order Info */}
        <Box className="flex items-center gap-4 flex-1">
          <Box className="w-20 h-20 rounded-xl overflow-hidden bg-white border-2 border-gray-200 hover:scale-105 transition-transform flex-shrink-0">
            <img
              src={item?.product?.imageUrl?.[0] || "/placeholder-image.jpg"}
              alt={item?.product?.title || "Product"}
              className="w-full h-full object-cover"
            />
          </Box>

          <Box>
            <Typography className="font-bold text-lg text-gray-900 mb-1">
              Order #{orderId.slice(-4)}
            </Typography>
            <Typography className="text-sm text-gray-500 mb-0.5">
              Placed on: {placedDate}
            </Typography>
            <Typography className="text-sm text-gray-600 font-medium">
              Items: {orderItemsLength}
            </Typography>
          </Box>
        </Box>

        {/* Center: Status Badge */}
        <Box className="flex justify-start md:justify-center flex-1">
          <Box
            sx={{
              backgroundColor: statusColors.bg,
              color: statusColors.color,
              border: `2px solid ${statusColors.border}`,
            }}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-bold text-sm uppercase"
          >
            {getStatusIcon(orderStatus)}
            {orderStatus}
          </Box>
        </Box>

        {/* Right: Price + Button */}
        <Box className="flex items-center gap-6 justify-end flex-1">
          <Typography className="text-2xl font-black text-gray-900">
            ₹{totalDiscountedPrice}
          </Typography>

          {showViewDetails && orderId !== "unknown" && (
            <Box
              onClick={(e) => {
                e.stopPropagation();
                console.log("View Details clicked for order:", orderId);
                navigate(`/account/order/${orderId}`);
              }}
              sx={{
                bgcolor: "#DFF200",
                color: "#111111",
                border: "2px solid #CBE600",
                "&:hover": {
                  bgcolor: "#CBE600",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 24px rgba(223, 242, 0, 0.4)",
                },
              }}
              className="px-6 py-2.5 rounded-xl font-bold text-sm cursor-pointer transition-all uppercase tracking-wide whitespace-nowrap"
            >
              View Details
            </Box>
          )}
        </Box>
      </Box>

      {/* Expected Delivery Message */}
      {getExpectedMessage() && (
        <Box className="px-6 pb-5">
          <Box className="flex items-center gap-2.5 text-orange-600 text-sm font-semibold bg-orange-50 border-2 border-orange-200 px-4 py-3 rounded-xl inline-flex">
            <AccessTimeIcon sx={{ fontSize: 18 }} />
            {getExpectedMessage()}
          </Box>
        </Box>
      )}

      {/* Rate & Review for Delivered Orders */}
      {isDelivered && item?.product?._id && (
        <Box className="px-6 pb-5">
          <Box
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/account/rate/${item.product._id}`);
            }}
            sx={{
              bgcolor: "#DFF200",
              border: "2px solid #CBE600",
              "&:hover": {
                bgcolor: "#CBE600",
                transform: "scale(1.02)",
                boxShadow: "0 8px 20px rgba(223, 242, 0, 0.3)",
              },
            }}
            className="flex items-center gap-2.5 rounded-xl px-5 py-3 cursor-pointer transition-all inline-flex font-bold"
          >
            <StarIcon sx={{ fontSize: "1.25rem", color: "#111111" }} />
            <span className="text-sm text-gray-900 uppercase tracking-wide">
              Rate & Review Product
            </span>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default OrderCard;
