// src/components/ProductsTable.jsx
import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { findProducts, deleteProduct } from '../Redux/Customers/Product/Action';


const ProductsTable = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const customersProduct = useSelector((store) => store.customersProduct);
  // customersProduct.products is expected to be { content: [], currentPage, totalPages }
  const productsState = customersProduct.products || { content: [], currentPage: 1, totalPages: 1 };
  const loading = customersProduct.loading;
  const error = customersProduct.error;

  const [filterValue, setFilterValue] = useState({
    availability: "",
    category: "",
    sort: "",
  });

  // query params
  const searchParams = new URLSearchParams(location.search);
  const availability = searchParams.get("availability");
  const category = searchParams.get("category");
  const sort = searchParams.get("sort");
  const page = Number(searchParams.get("page")) || 1;

  // Build the request payload shape your thunk expects
  const buildReqData = () => {
    return {
      category: category || "",
      colors: [], // keep empty for now
      sizes: [], // keep empty for now
      minPrice: 0,
      maxPrice: 100000,
      minDiscount: 0,
      sort: sort || "price_low",
      pageNumber: page || 1,
      pageSize: 10,
      stock: availability && availability !== "All" ? availability : "",
    };
  };

  useEffect(() => {
    // Keep UI filter state in sync with query params
    setFilterValue({
      availability: availability || "",
      category: category || "",
      sort: sort || "",
    });

    // dispatch findProducts
    const reqData = buildReqData();
    dispatch(findProducts(reqData)).catch((err) => {
      console.error("findProducts error:", err);
    });
    // re-run whenever query params change OR when a deletion occurred
    // customersProduct.deleteProduct is set by reducer after delete — triggers refetch
  }, [availability, category, sort, page, dispatch, customersProduct.deleteProduct]);

  const handlePaginationChange = (event, value) => {
    // keep same behavior you had (it previously set page = value-1)
    // Here we will set page query param to (value) to keep 1-based pages
    // if your server expects 0-based pageNumber, findProducts uses pageNumber: page (1-based)
    searchParams.set("page", value);
    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };

  const handleFilterChange = (e, sectionId) => {
    setFilterValue((values) => ({ ...values, [sectionId]: e.target.value }));
    if (!e.target.value) searchParams.delete(sectionId);
    else searchParams.set(sectionId, e.target.value);
    // reset page to 1 on filter change
    searchParams.set("page", 1);
    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };

  const handleDeleteProduct = async (productId) => {
    if (!productId) return;
    try {
      if (!window.confirm("Delete this product?")) return;
      await dispatch(deleteProduct(productId));
      // Optionally re-fetch current filters (deleteProduct reducer already removes item from state)
      // dispatch(findProducts(buildReqData()));
    } catch (err) {
      console.error("Delete product error:", err);
      alert(err.response?.data?.message || err.message || "Delete failed");
    }
  };



const handleUpdateProduct = (product)=>{
  navigate("/add-product", {state:{product}})
}

  return (
    <Box width={"100%"}>
      <Card className="p-3">
        <CardHeader
          title="Sort"
          sx={{
            pt: 0,
            alignItems: "center",
            "& .MuiCardHeader-action": { mt: 0.6 },
          }}
        />
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
                id="category-select"
                value={filterValue.category}
                label="Category"
                onChange={(e) => handleFilterChange(e, "category")}
              >
                <MenuItem value={""}>All</MenuItem>
                <MenuItem value={"pant"}>Men's Pants</MenuItem>
                <MenuItem value={"mens_kurta"}>Men's Kurta</MenuItem>
                <MenuItem value={"saree"}>Saree</MenuItem>
                <MenuItem value={"lengha_choli"}>Lengha Choli</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id="availability-select-label">Availability</InputLabel>
              <Select
                labelId="availability-select-label"
                id="availability-select"
                value={filterValue.availability}
                label="Availability"
                onChange={(e) => handleFilterChange(e, "availability")}
              >
                <MenuItem value={""}>All</MenuItem>
                <MenuItem value={"in_stock"}>Instock</MenuItem>
                <MenuItem value={"out_of_stock"}>Out Of Stock</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id="sort-select-label">Sort By Price</InputLabel>
              <Select
                labelId="sort-select-label"
                id="sort-select"
                value={filterValue.sort}
                label="Sort By Price"
                onChange={(e) => handleFilterChange(e, "sort")}
              >
                <MenuItem value={"price_high"}>High - Low</MenuItem>
                <MenuItem value={"price_low"}>Low - High</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>

      <Card className="mt-2">
        <CardHeader
          title="All Products"
          sx={{
            pt: 2,
            alignItems: "center",
            "& .MuiCardHeader-action": { mt: 0.6 },
          }}
        />
        <TableContainer>
          <Table sx={{ minWidth: 800 }} aria-label="table in dashboard">
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Title</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Category</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Price</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Quantity</TableCell>
<TableCell sx={{ textAlign: "center" }}>Update</TableCell>
<TableCell sx={{ textAlign: "center" }}>Delete</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">Loading...</TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">Error: {error}</TableCell>
                </TableRow>
              ) : (productsState?.content?.length || 0) === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">No products found</TableCell>
                </TableRow>
              ) : (
                productsState.content.map((item) => (
                  <TableRow
                    hover
                    key={item._id || item.id || item.title}
                    sx={{ "&:last-of-type td, &:last-of-type th": { border: 0 } }}
                  >
                    <TableCell>
                      <Avatar alt={item.title} src={item.imageUrl?.[0] || item.images?.[0]} />
                    </TableCell>

                    <TableCell sx={{ py: (theme) => `${theme.spacing(0.5)} !important` }}>
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography sx={{ fontWeight: 500, fontSize: "0.875rem !important" }}>
                          {item.title}
                        </Typography>
                        <Typography variant="caption">{item.brand}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{item.category?.name || item.category}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{item.discountedPrice ?? item.price}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{item.quantity}</TableCell>

<TableCell sx={{ textAlign: "center" }}>
  <Button variant="text" onClick={() => handleUpdateProduct(item)}>Update</Button>
</TableCell>

<TableCell sx={{ textAlign: "center" }}>
  <Button variant="text" onClick={() => handleDeleteProduct(item._id)}>Delete</Button>
</TableCell>

                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Card className="mt-2 border">
        <div className="mx-auto px-4 py-5 flex justify-center shadow-lg rounded-md">
          <Pagination
            count={productsState?.totalPages || 1}
            color="primary"
            onChange={handlePaginationChange}
            page={Number(page)}
          />
        </div>
      </Card>
    </Box>
  );
};

export default ProductsTable;
