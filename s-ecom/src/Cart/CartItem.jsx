import React from "react";
import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { removeCartItem, updateCartItem, getCart } from "../redux/Cart/Action";
import { IconButton } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

const CartItem = ({ item,showButton }) => {
  console.log("items....",item)
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
const baseUrl = import.meta.env.VITE_React_BASE_API_URL

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
    dispatch(getCart(jwt)); // ✅ Fetch updated cart totals immediately
  });
};
return (
  <div className="p-4 shadow-lg border rounded-md bg-white">
    <div className="flex flex-col lg:flex-row lg:items-center">
      {/* Image Section */}
      <div className="w-full h-[20rem] lg:w-[9rem] lg:h-[9rem] mx-auto lg:mx-0">
        <img
          className="object-cover object-top w-full h-full hover:scale-105 transition-transform duration-300"
          src={item?.product?.imageUrl?.[0]}
          alt="No image available"
        />
      </div>

      {/* Details Section */}
      <div className="mt-4 lg:mt-0 lg:ml-5 w-full space-y-1">
        <p className="font-semibold text-base">{item?.product?.title}</p>
        <p className="opacity-70 text-sm">Size: {item?.size}</p>
        <p className="opacity-70 text-sm">Seller: {item?.product?.brand}</p>

        <div className="flex flex-wrap gap-2 items-center pt-2">
          <p className="text-sm line-through text-gray-500">
            ₹{item?.product?.price * item?.quantity}
          </p>
          <p className="font-semibold text-md text-black">
            ₹{item?.product?.discountedPrice * item?.quantity}
          </p>
          <p className="text-green-600 font-semibold text-sm">
            {item?.product?.discountPersent}% off
          </p>
        </div>
      </div>
    </div>

    {/* Buttons */}
    {showButton && (
      <div className="flex flex-col lg:flex-row justify-between lg:items-center mt-4 gap-3">
        {/* Quantity Controls */}
        <div className="flex items-center justify-center space-x-2">
          <IconButton
            onClick={() => handleUpdateCartItem(-1)}
            disabled={item?.quantity <= 1}
            color="primary"
          >
            <RemoveCircleOutlineIcon />
          </IconButton>

          <span className="py-1 px-6 border rounded text-sm font-medium">
            {item?.quantity}
          </span>

          <IconButton
            onClick={() => handleUpdateCartItem(1)}
            color="primary"
          >
            <AddCircleOutlineIcon />
          </IconButton>
        </div>

        {/* Remove Button */}
        <Button
          onClick={handleRemoveItemFromCart}
          variant="text"
          className="text-sm"
        >
          Remove
        </Button>
      </div>
    )}
  </div>
);

};

export default CartItem;
