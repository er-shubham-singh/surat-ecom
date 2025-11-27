import React from "react";
import { Avatar, Rating, Box, Grid, useMediaQuery } from "@mui/material";

const ProductReviewCard = ({ item }) => {
  const isMobile = useMediaQuery("(max-width:600px)");

  // User details
  const userName =
    item?.user
      ? `${item.user.firstName || ""} ${item.user.lastName || ""}`.trim()
      : "User";

  const userInitial = userName?.charAt(0)?.toUpperCase() || "U";

  // Review details
  const ratingValue = item?.rating || 0;
  const reviewTitle = item?.review || "No Title Provided";
  const reviewDescription = item?.description || "";

  // Date formatting
  const reviewDate = new Date(
    item?.createdAt || Date.now()
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="pb-4 border-b border-gray-200 last:border-0">
      <Grid container spacing={2}>
        
        {/* Avatar Section */}
        <Grid item xs={2}>
          <Avatar
            sx={{
              bgcolor: "#8A6F4F",
              width: isMobile ? 36 : 48,
              height: isMobile ? 36 : 48,
              fontSize: isMobile ? "0.9rem" : "1.2rem",
              color: "white",
            }}
          >
            {userInitial}
          </Avatar>
        </Grid>

        {/* Review Content */}
        <Grid item xs={10}>
          <Box className="space-y-1">

            {/* Name & Date */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <p className={`font-semibold text-gray-900 ${isMobile ? "text-sm" : "text-base"}`}>
                {userName}
              </p>
              <span className={`text-gray-500 ${isMobile ? "text-xs" : "text-sm"}`}>
                {reviewDate}
              </span>
            </div>

            {/* Rating */}
            <Rating
              value={ratingValue}
              readOnly
              precision={0.5}
              size={isMobile ? "small" : "medium"}
            />

            {/* Review Title */}
            <p className={`font-semibold text-gray-900 ${isMobile ? "text-sm" : "text-base"}`}>
              {reviewTitle}
            </p>

            {/* Review Description */}
            {reviewDescription && (
              <p className={`${isMobile ? "text-xs" : "text-sm"} text-gray-700 leading-relaxed`}>
                {reviewDescription}
              </p>
            )}

          </Box>
        </Grid>

      </Grid>
    </div>
  );
};

export default ProductReviewCard;
