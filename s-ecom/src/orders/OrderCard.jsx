import { Box, Chip, Grid, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CancelIcon from "@mui/icons-material/Cancel";
import ReplayIcon from "@mui/icons-material/Replay";
import DoneIcon from "@mui/icons-material/Done";
import StarIcon from "@mui/icons-material/Star";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike"; // 🛵 for Out For Delivery

import React from "react";
import { useNavigate } from "react-router-dom";

const getStatusIcon = (status) => {
  const normalizedStatus = status.toLowerCase();
  switch (normalizedStatus) {
    case "confirmed":
      return <AccessTimeIcon fontSize="small" color="action" />;
    case "shipped":
      return <LocalShippingIcon fontSize="small" color="primary" />;
    case "delivered":
      return <DoneIcon fontSize="small" color="success" />;
    case "cancelled":
      return <CancelIcon fontSize="small" color="error" />;
    case "returned":
      return <ReplayIcon fontSize="small" color="warning" />;
    case "outfordelivery":
      return <DirectionsBikeIcon fontSize="small" sx={{ color: "#FB8C00" }} />; // orange-ish
    default:
      return <AccessTimeIcon fontSize="small" color="action" />;
  }
};


const OrderCard = ({ item, order }) => {
  const navigate = useNavigate();
  // console.log("items... on order card : ", item)

  const isDelivered = order.orderStatus?.toLowerCase() === "delivered";

  // Format updated date
  const updatedDate = new Date(order.statusUpdatedAt);
  const formattedUpdatedDate = updatedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });

  // Calculate expected delivery: 5 days from order creation
  const createdDate = new Date(order.createdAt);
  const expectedDateObj = new Date(createdDate);
  expectedDateObj.setDate(createdDate.getDate() + 5);
  const formattedExpectedDate = expectedDateObj.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });

const getDeliveryText = () => {
  const status = order.orderStatus?.toLowerCase();
  switch (status) {
    case "confirmed":
      return "Expected Delivery";
    case "shipped":
      return "Shipped On";
    case "outfordelivery":
      return "Out For Delivery On";
    case "delivered":
      return "Delivered On";
    case "cancelled":
      return "Cancelled On";
    case "returned":
      return "Returned On";
    default:
      return "Expected Delivery";
  }
};

const getDeliveryDate = () => {
  const status = order.orderStatus?.toLowerCase();
  const statusUpdated = new Date(order.statusUpdatedAt);
  const expected = new Date(order.createdAt);
  expected.setDate(expected.getDate() + 4); // expected delivery 4 days from creation

  if (status === "confirmed") return expected.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  if (["shipped", "outfordelivery", "delivered", "cancelled", "returned"].includes(status)) {
    return statusUpdated.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  }
  return expected.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
};

const shouldShowExpectedDate = () => {
  const status = order.orderStatus?.toLowerCase();
  return status === "confirmed" || status === "shipped";
};

const getExpectedDate = () => {
  const expected = new Date(order.createdAt);
  expected.setDate(expected.getDate() + 4);
  return expected.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
};

const getExpectedMessage = () => {
  const status = order.orderStatus?.toLowerCase();
  const expectedDate = getExpectedDate();

  if (status === "delivered") return null;
  if (status === "outfordelivery") return "Your item's is Out for Delivery, It will be delivered today";
  return `Expected by: ${expectedDate}`;
};

  return (
    <Box className="bg-white p-4 rounded-lg shadow-md border">
      <Grid container spacing={2} >
        <Grid item xs={4} onClick={() => navigate(`/account/order/${order?._id}`)}>
          <img
            src={item?.product?.imageUrl?.[0]}
            alt={item?.product?.title}
            className="w-[120px] h-[120px] object-cover rounded-md"
          />
        </Grid>

        <Grid item xs={8} onClick={() => navigate(`/account/order/${order?._id}`)}>
          <Typography className="text-sm font-semibold mb-1">
            {item?.product?.title}
            <p className="text-gray-600 text-xs font-normal ml-1">
              ₹{item?.discountedPrice}
            </p>
            <p className="text-gray-600 text-xs font-normal ml-1">
            Size : {item?.size}
          </p>
            <p className="text-gray-600 text-xs font-normal ml-1">
            Quantity : {item?.quantity}
          </p>
           <p className="text-gray-600 text-xs font-normal ml-1">
            Color : {item?.product?.color}
          </p>
          </Typography>

<Box className="mt-1 mb-2">
  <Chip
    label={order.orderStatus}
    icon={getStatusIcon(order.orderStatus)}
    color={
      order.orderStatus.toLowerCase() === "delivered"
        ? "success"
        : order.orderStatus.toLowerCase() === "cancelled"
        ? "error"
        : order.orderStatus.toLowerCase() === "returned"
        ? "warning"
        : order.orderStatus.toLowerCase() === "outfordelivery"
        ? "warning"
        : "primary"
    }
    size="small"
  />

  {/* ✅ Show the action date like: Shipped On: 08 Jul */}
  <Box sx={{marginTop : "6px", fontSize: '16px'}} className="">
    {getDeliveryText()}:{" "}
    <span className="font-medium text-black">{getDeliveryDate()}</span>
  </Box>
</Box>





        </Grid>
{getExpectedMessage() && (
  <Box className=" mx-2 mt-1 flex items-center gap-1 text-orange-500 text-xs font-medium">
    <AccessTimeIcon fontSize="small" />
    {getExpectedMessage()}
  </Box>
)}
        {/* Full width Rate & Review (xs=12) */}
        {isDelivered && (
          <Grid item xs={12}>
            <div
              onClick={() => navigate(`/account/rate/${item?.product?._id}`)}
              className="flex items-center text-blue-600 mt-2 cursor-pointer"
            >
              <StarIcon sx={{ fontSize: "1.5rem" }} className="mr-1" />
              <span className="text-sm font-medium">Rate & Review Product</span>
            </div>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default OrderCard;
