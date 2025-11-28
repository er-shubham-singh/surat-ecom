import {
  Button,
  Grid,
  Rating,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { useDispatch, useSelector } from "react-redux";
import { createReview } from "../redux/Review/Action";
import { useNavigate, useParams } from "react-router-dom";
import { findProductById } from "../redux/product/action";


const RateProduct = () => {
  const [formData, setFormData] = useState({ description: "" });
  const [rating, setRating] = useState(null);
  const isLargeScreen = useMediaQuery("(min-width:1200px)");
  const dispatch = useDispatch();
  const { customersProduct } = useSelector((store) => store);
  const { productId } = useParams();
  const navigate = useNavigate();

// console.log("description : ",customersProduct)

  const handleRateProduct = (e, value) => {
    setRating(value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!rating || !formData.description.trim()) {
      alert("Please provide a rating and description before submitting.");
      return;
    }

    const fixedTitle = `Review for ${customersProduct?.product?.title || "Product"}`;

    dispatch(
      createReview({
        review: fixedTitle,
        description: formData.description,
        rating,
        productId,
      })
    );

    setFormData({ description: "" });
    setRating(null);
    navigate(`/product/${productId}#reviews`);
  };

  useEffect(() => {
    dispatch(findProductById({ productId }));
  }, [dispatch, productId]);

  return (
    <div className="px-5 lg:px-20">
      <h1 className="text-xl p-5 shadow-lg mb-8 font-bold">
        Rate & Review Product
      </h1>
      <Grid sx={{ justifyContent: "space-between" }} container>
        <Grid
          className="flex lg:items-center shadow-lg border rounded-md p-5"
          item
          xs={12}
          lg={5.8}
        >
          <div>
            <img
              className="w-[5rem] lg:w-[15rem]"
              src={customersProduct.product?.imageUrl?.[0]}
              alt=""
            />
          </div>
          <div className="ml-3 lg:ml-5 space-y-2 lg:space-y-4">
            <p className="lg:text-lg">{customersProduct.product?.title}</p>
            <p className="opacity-70 font-semibold">
              {customersProduct.product?.brand}
            </p>
            <p className="opacity-70 font-semibold">₹{customersProduct.product?.discountedPrice}</p>
            {customersProduct.product?.color && (
              <p className="opacity-70 font-semibold"> {customersProduct.product?.color}</p>
            )}
          </div>
        </Grid>

        {/* Review Form */}
        <Grid item xs={12} lg={6}>
          <div className={`${!isLargeScreen ? "py-10" : ""} space-y-5`}>
            <div className="shadow-md border rounded-md p-5">
              <Typography className="font-semibold" component="legend">
                Rate This Product
              </Typography>
              <Rating
                name="simple-controlled"
                value={rating}
                onChange={(event, newValue) => {
                  handleRateProduct(event, newValue);
                }}
              />
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5 shadow-md border rounded-md"
            >
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                required
                margin="normal"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
                name="description"
              />
              <Button type="submit" variant="contained" color="primary">
                Submit Review
              </Button>
            </form>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default RateProduct;
