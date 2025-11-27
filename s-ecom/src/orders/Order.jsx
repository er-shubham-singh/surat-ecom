import { Box, Grid, Typography, Button, CircularProgress } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrderHistory } from "../redux/Order/Action";
import BackdropComponent from "../BackDrop/Backdrop";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { useNavigate } from "react-router-dom";
import OrderCard from "./OrderCard";

const Order = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const jwt = localStorage.getItem("jwt");
  const { order } = useSelector((store) => store);

  console.log("order on order page:", order);

  useEffect(() => {
    dispatch(getOrderHistory({ jwt }));
  }, [jwt]);

  return (
    <Box className="min-h-screen bg-[#FFFDF6] py-8 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-[#111111] flex items-center gap-3">
          <ShoppingBagOutlinedIcon sx={{ fontSize: { xs: 32, lg: 40 } }} />
          My Orders
        </h1>
        <p className="text-[#111111]/60 mt-2 text-sm lg:text-base font-medium">
          Track and manage your orders
        </p>
      </div>

      {/* Orders Display */}
      {order.loading ? (
        <Box className="flex justify-center items-center h-[60vh]">
          <CircularProgress sx={{ color: "#DFF200" }} size={60} />
        </Box>
      ) : order.orders?.length > 0 ? (
        <Box className="space-y-4">
          {order.orders.map((orderItem) =>
            orderItem?.orderItems?.map((item, index) => (
              <OrderCard
                key={item._id || index}
                item={item}
                order={orderItem}
                showViewDetails={true}
              />
            ))
          )}
        </Box>
      ) : (
        <Box className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="w-32 h-32 mb-6 bg-[#DFF200]/20 rounded-full flex items-center justify-center">
            <ShoppingBagOutlinedIcon sx={{ fontSize: 80, color: "#DFF200" }} />
          </div>
          <Typography className="text-2xl font-bold text-[#111111] mb-2">
            No Orders Found
          </Typography>
          <Typography className="text-[#111111]/60 mb-6">
            Looks like you haven't placed any orders yet
          </Typography>
          <Button
            onClick={() => navigate("/")}
            sx={{
              bgcolor: "#DFF200",
              color: "#111111",
              fontWeight: 700,
              fontSize: "1rem",
              border: "2px solid #CBE600",
              borderRadius: "12px",
              px: 4,
              py: 1.5,
              textTransform: "uppercase",
              "&:hover": {
                bgcolor: "#CBE600",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 24px rgba(223, 242, 0, 0.4)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Continue Shopping
          </Button>
        </Box>
      )}

      <BackdropComponent open={order.loading} />
    </Box>
  );
};

export default Order;
