// actions/product.actions.js
import api from "../../Config/api";
import {
  CREATE_PRODUCT_FAILURE,
  CREATE_PRODUCT_REQUEST,
  CREATE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAILURE,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  GET_PRODUCT_FAILURE,
  GET_PRODUCT_REQUEST,
  GET_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAILURE,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
} from "./actionType";

// GET all products
export const getProduct = () => async (dispatch) => {
  try {
    dispatch({ type: GET_PRODUCT_REQUEST });
    const { data } = await api.get("/api/product/allProduct"); // await + correct path
    dispatch({ type: GET_PRODUCT_SUCCESS, payload: data }); // payload = array of products
  } catch (error) {
    dispatch({
      type: GET_PRODUCT_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// CREATE product (handles FormData)
export const createProduct = (product) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_PRODUCT_REQUEST });
    const { data } = await api.post("/api/product/createproduct", product);
    dispatch({ type: CREATE_PRODUCT_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: CREATE_PRODUCT_FAILURE,
      payload:
        error.response && (error.response.data.message || error.response.data.error)
          ? error.response.data.message || error.response.data.error
          : error.message,
    });
  }
};

// UPDATE product
export const updateProduct = (productId, productData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PRODUCT_REQUEST });
    const { data } = await api.put(`/api/product/${productId}`, productData);
    dispatch({ type: UPDATE_PRODUCT_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: UPDATE_PRODUCT_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// DELETE product
export const deleteProduct = (productId) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_PRODUCT_REQUEST });
    await api.delete(`/api/product/${productId}`);
    dispatch({ type: DELETE_PRODUCT_SUCCESS, payload: productId });
  } catch (error) {
    dispatch({
      type: DELETE_PRODUCT_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
