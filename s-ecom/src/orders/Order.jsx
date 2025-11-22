
import {
  Box,
  Grid,
  Typography,
  Button,
  IconButton,
  Chip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrderHistory } from "../redux/Order/Action";
import BackdropComponent from "../BackDrop/Backdrop";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import FilterListIcon from "@mui/icons-material/FilterList";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CancelIcon from "@mui/icons-material/Cancel";
import ReplayIcon from "@mui/icons-material/Replay";
import DoneIcon from "@mui/icons-material/Done";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import StarIcon from "@mui/icons-material/Star";
import OrderCard from "./OrderCard";


const orderStatus = [
  { label: "On The Way", value: "onTheWay" },
  { label: "Delivered", value: "delevered" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Returned", value: "returned" },
  { label: "Out For Delivery", value: "outForDelivery" }, // ✅ new
];


const Order = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const jwt = localStorage.getItem("jwt");
  const { order } = useSelector((store) => store);
  const [showFilters, setShowFilters] = useState(false);

  console.log("prder on order order page:",order)

  useEffect(() => {
    dispatch(getOrderHistory({ jwt }));
  }, [jwt]);

  return (
    <Box className="px-4 sm:px-6 md:px-10 mt-4 max-w-screen-xl mx-auto">
      {/* Mobile: Filter Toggle */}
      <Box className="flex justify-between items-center mb-4 md:hidden">
        <Typography variant="h6" className="font-semibold">
          My Orders
        </Typography>
        <IconButton onClick={() => setShowFilters(!showFilters)} size="small">
          <FilterListIcon />
        </IconButton>
      </Box>

      <Grid container spacing={3}>
        {/* Filters Section */}
        {(showFilters || window.innerWidth >= 768) && (
          <Grid item xs={12} md={3}>
            <Box className="shadow-md bg-white border p-5 rounded-md md:sticky md:top-5">
              <Typography variant="h6" className="font-bold mb-4">
                Filters
              </Typography>
              <Typography variant="body1" className="font-semibold mb-2">
                ORDER STATUS
              </Typography>
              <div className="space-y-3">
                {orderStatus.map((option) => (
                  <div key={option.value} className="flex items-center">
                    <input
                      type="checkbox"
                      defaultValue={option.value}
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </Box>
          </Grid>
        )}

        {/* Orders Display */}
        <Grid item xs={12} md={9}>
{order.loading ? (
  <Box className="flex justify-center items-center h-[60vh]">
    <CircularProgress color="primary" />
  </Box>
) : order.orders?.length > 0 ? (
  <Box className="space-y-5">
    {order.orders.map((orderItem) =>
      orderItem?.orderItems?.map((item, index) => (
        <OrderCard
          key={item._id || index}
          item={item}
          order={orderItem}
        />
      ))
    )}
  </Box>
) : (
  <Box className="flex flex-col items-center justify-center h-[60vh] text-center">
    <ShoppingBagOutlinedIcon
      sx={{ fontSize: 80 }}
      className="text-gray-400 mb-4"
    />
    <Typography variant="h6" className="text-gray-600 mb-2">
      No Orders Found
    </Typography>
    <Button
      onClick={() => navigate("/")}
      variant="contained"
      className="bg-indigo-600 text-white hover:bg-indigo-700"
    >
      Continue Shopping
    </Button>
  </Box>
)}

        </Grid>
      </Grid>

      <BackdropComponent open={order.loading} />
    </Box>
  );
};

export default Order;
