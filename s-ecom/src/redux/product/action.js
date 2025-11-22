import axios from "axios";

import {
  FIND_PRODUCTS_BY_CATEGORY_REQUEST,
  FIND_PRODUCTS_BY_CATEGORY_SUCCESS,
  FIND_PRODUCTS_BY_CATEGORY_FAILURE,
  FIND_PRODUCT_BY_ID_REQUEST,
  FIND_PRODUCT_BY_ID_SUCCESS,
  FIND_PRODUCT_BY_ID_FAILURE,
  CREATE_PRODUCT_REQUEST,
  CREATE_PRODUCT_SUCCESS,
  CREATE_PRODUCT_FAILURE,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAILURE,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAILURE,
  FETCH_HOMEPAGE_CATEGORY_PRODUCTS_REQUEST,
  FETCH_HOMEPAGE_CATEGORY_PRODUCTS_SUCCESS,
  FETCH_HOMEPAGE_CATEGORY_PRODUCTS_FAILURE,
  SEARCH_PRODUCTS_REQUEST,
  SEARCH_PRODUCTS_SUCCESS,
  SEARCH_PRODUCTS_FAILURE,
} from "./actionType";
import api from "../../Config/api";

export const findProducts = (reqData) => async (dispatch) => {
  try {
    dispatch({ type: FIND_PRODUCTS_BY_CATEGORY_REQUEST });

    const params = new URLSearchParams();
    if (reqData.colors?.length > 0) params.append("color", reqData.colors);
    if (reqData.sizes?.length > 0) params.append("size", reqData.sizes);
    if (reqData.minPrice) params.append("minPrice", reqData.minPrice);
    if (reqData.maxPrice) params.append("maxPrice", reqData.maxPrice);
    if (reqData.minDiscount) params.append("minDiscount", reqData.minDiscount);
    if (reqData.category) params.append("category", reqData.category);
    if (reqData.stock) params.append("stock", reqData.stock);
    if (reqData.sort) params.append("sort", reqData.sort);
    if (reqData.pageNumber) params.append("pageNumber", reqData.pageNumber);
    if (reqData.pageSize) params.append("pageSize", reqData.pageSize);

    const { data } = await api.get(`/api/products?${params.toString()}`);

    dispatch({ type: FIND_PRODUCTS_BY_CATEGORY_SUCCESS, payload: data });
    return data; // <--- return for caller
  } catch (error) {
    dispatch({
      type: FIND_PRODUCTS_BY_CATEGORY_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};



export const findProductById = (reqData) => async (dispatch) => {
  try {
    dispatch({ type: FIND_PRODUCT_BY_ID_REQUEST });

    const { data } = await api.get(`/api/products/id/${reqData.productId}`);

    console.log("products by  id : ", data);
    dispatch({
      type: FIND_PRODUCT_BY_ID_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FIND_PRODUCT_BY_ID_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};




// --- createProduct (accepts FormData) ---
export const createProduct = (formData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_PRODUCT_REQUEST });

    // If you use `api` axios instance, use it. We pass headers to let axios set boundary.
    const token = localStorage.getItem("jwt") || null;

    const { data } = await api.post(
      `${API_BASE_URL}/api/admin/products/`, // adjust if your backend endpoint differs
      formData,
      {
        headers: {
          // Don't set boundary manually. Let axios set `Content-Type: multipart/form-data; boundary=...`
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          // If your api axios instance has a default Content-Type = application/json,
          // explicitly override it to allow multipart:
          "Content-Type": "multipart/form-data",
        },
        // important: if your axios instance has transformRequest that converts data, ensure it doesn't run.
        // You can also call axios directly (import axios) if needed.
      }
    );

    dispatch({ type: CREATE_PRODUCT_SUCCESS, payload: data });

    console.log("created product ", data);
    // Return to component
    return data;
  } catch (error) {
    console.error("Create product error:", error.response?.data || error.message);
    dispatch({
      type: CREATE_PRODUCT_FAILURE,
      payload:
        error.response && (error.response.data.message || error.response.data.error)
          ? error.response.data.message || error.response.data.error
          : error.message,
    });
    // Re-throw so component can catch
    throw error;
  }
};

export const updateProduct = (formData, productId) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PRODUCT_REQUEST });

    const token = localStorage.getItem("jwt") || null;

    const { data } = await api.put(
      `${API_BASE_URL}/api/admin/products/${productId}`,
      formData,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Content-Type": "multipart/form-data",
        },
      }
    );

    dispatch({ type: UPDATE_PRODUCT_SUCCESS, payload: data });
    console.log("update product ", data);
    return data;
  } catch (error) {
    console.error("Update product error:", error.response?.data || error.message);
    dispatch({
      type: UPDATE_PRODUCT_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
    throw error;
  }
};


export const deleteProduct = (productId) => async (dispatch) => {
  console.log("delete product action",productId)
  try {
    dispatch({ type: DELETE_PRODUCT_REQUEST });

    let {data}=await api.delete(`/api/admin/products/${productId}`);

    console.log("delete product ",data)

    dispatch({
      type: DELETE_PRODUCT_SUCCESS,
      payload: productId,
    });

    console.log("product delte ",data)
  } catch (error) {
    console.log("catch error ",error)
    dispatch({
      type: DELETE_PRODUCT_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};


export const fetchHomepageCategoryProducts = (reqData) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_HOMEPAGE_CATEGORY_PRODUCTS_REQUEST });

    const params = new URLSearchParams();
    console.log("category second ...",params)
    if (reqData.category) params.append("category", reqData.category);
    if (reqData.pageNumber) params.append("pageNumber", reqData.pageNumber);
    if (reqData.pageSize) params.append("pageSize", reqData.pageSize);
    console.log("category second ...",params)
    const { data } = await api.get(`/api/products?${params.toString()}`);

    dispatch({ type: FETCH_HOMEPAGE_CATEGORY_PRODUCTS_SUCCESS, payload: data });
    return data; // ✅ Return so you can use in Homepage.js
  } catch (error) {
    dispatch({
      type: FETCH_HOMEPAGE_CATEGORY_PRODUCTS_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};


export const searchProducts = (query) => async (dispatch) => {
  try {
    dispatch({ type: SEARCH_PRODUCTS_REQUEST });

    const { data } = await api.get(`/api/products/search?query=${query}`);

    dispatch({ type: SEARCH_PRODUCTS_SUCCESS, payload: data });

    return data; // ⬅️ return to use in component
  } catch (error) {
    dispatch({ type: SEARCH_PRODUCTS_FAILURE, payload: error.message });
    throw error;
  }
};