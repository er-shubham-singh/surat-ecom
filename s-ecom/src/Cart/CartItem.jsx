import React from "react";
import { IconButton } from "@mui/material";
import { useDispatch } from "react-redux";
import { removeCartItem, updateCartItem, getCart } from "../redux/Cart/Action";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const CartItem = ({ item, showButton }) => {
  console.log("items....", item);
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const baseUrl = import.meta.env.VITE_React_BASE_API_URL;

  const handleRemoveItemFromCart = () => {
    const data = { cartItemId: item?._id, jwt };
    dispatch(removeCartItem(data));
  };

  const handleUpdateCartItem = (num) => {
    const data = {
      data: { quantity: item.quantity + num },
      cartItemId: item?._id,
      jwt,
    };
    console.log("update data ", data);
    dispatch(updateCartItem(data)).then(() => {
      dispatch(getCart(jwt));
    });
  };

  return (
    <div className="bg-white rounded-2xl  overflow-hidden hover:shadow-xl hover:border-[#CBE600] transition-all duration-300">
      <div className="p-5">
        <div className="flex gap-5">
          {/* Product Image */}
          <div className="relative flex-shrink-0 w-32 h-32 sm:w-36 sm:h-36 bg-[#FFFDF6] rounded-xl overflow-hidden border-2 border-[#DFF200] group">
            <img
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
              src={item?.product?.imageUrl?.[0]}
              alt={item?.product?.title || "Product"}
            />
            {item?.product?.discountPersent > 0 && (
              <div className="absolute top-2 left-2 bg-[#DFF200] text-[#111111] text-xs font-bold px-3 py-1.5 rounded-lg shadow-md border-2 border-[#CBE600]">
                {item?.product?.discountPersent}% OFF
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start gap-3 mb-3">
                <h3 className="font-bold text-[#111111] text-base sm:text-lg line-clamp-2 leading-snug">
                  {item?.product?.title}
                </h3>
                {showButton && (
                  <IconButton
                    onClick={handleRemoveItemFromCart}
                    size="small"
                    sx={{
                      color: "#111111",
                      "&:hover": {
                        bgcolor: "#fee",
                        color: "#dc2626",
                      },
                    }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-[#111111]/70 mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#111111]">Size:</span>
                  <span className="px-3 py-1 bg-[#DFF200] text-[#111111] font-bold rounded-lg text-xs uppercase border border-[#CBE600]">
                    {item?.size}
                  </span>
                </div>
                <span className="text-[#111111]/30">•</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#111111]">Brand:</span>
                  <span className="font-bold text-[#111111]">
                    {item?.product?.brand}
                  </span>
                </div>
              </div>

              {/* Price Section */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-2xl sm:text-3xl font-bold text-[#111111]">
                  ₹{item?.product?.discountedPrice * item?.quantity}
                </span>
                {item?.product?.price !== item?.product?.discountedPrice && (
                  <>
                    <span className="text-base sm:text-lg text-[#111111]/40 line-through font-medium">
                      ₹{item?.product?.price * item?.quantity}
                    </span>
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-bold border border-green-300">
                      SAVE {item?.product?.discountPersent}%
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Quantity Controls */}
            {showButton && (
              <div className="flex items-center gap-4 mt-4">
                <div className="inline-flex items-center border-2 border-[#DFF200] rounded-xl overflow-hidden bg-white">
                  <IconButton
                    onClick={() => handleUpdateCartItem(-1)}
                    disabled={item?.quantity <= 1}
                    size="small"
                    sx={{
                      borderRadius: 0,
                      color: "#111111",
                      px: 1.5,
                      py: 1,
                      "&:hover": {
                        bgcolor: "#DFF200",
                      },
                      "&.Mui-disabled": {
                        opacity: 0.3,
                        color: "#111111",
                      },
                    }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>

                  <span className="px-5 py-1.5 font-bold text-[#111111] text-base min-w-[3rem] text-center border-x-2 border-[#DFF200]">
                    {item?.quantity}
                  </span>

                  <IconButton
                    onClick={() => handleUpdateCartItem(1)}
                    size="small"
                    sx={{
                      borderRadius: 0,
                      color: "#111111",
                      px: 1.5,
                      py: 1,
                      "&:hover": {
                        bgcolor: "#DFF200",
                      },
                    }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </div>

                <span className="text-xs text-[#111111]/60 font-medium">
                  ₹{item?.product?.discountedPrice} each
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
