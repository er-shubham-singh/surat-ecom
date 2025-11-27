
import {
  CREATE_REVIEW_SUCCESS,
  CREATE_REVIEW_FAILURE,
  GET_ALL_REVIEWS_SUCCESS,
  GET_ALL_REVIEWS_FAILURE,
  CREATE_RATING_SUCCESS,
  CREATE_RATING_FAILURE,
  GET_ALL_RATINGS_SUCCESS,
  GET_ALL_RATINGS_FAILURE,
  GET_RATING_SUMMARY_SUCCESS,
  GET_RATING_SUMMARY_FAILURE,
} from './ActionTyp';

import api from '../../Config/api';

// ------------------- CREATE REVIEW -------------------
export const createReview = (resData) => {
  return async (dispatch) => {
    try {
      const response = await api.post('/api/reviews/create', resData);
      dispatch({
        type: CREATE_REVIEW_SUCCESS,
        payload: response.data,
      });
      // console.log("create review ", response.data);
    } catch (error) {
      dispatch({
        type: CREATE_REVIEW_FAILURE,
        payload: error.message,
      });
    }
  };
};

// ------------------- GET ALL REVIEWS -------------------
export const getAllReviews = (productId) => {
  return async (dispatch) => {
    try {
      const response = await api.get(`/api/reviews/product/${productId}`);
      dispatch({
        type: GET_ALL_REVIEWS_SUCCESS,
        payload: response.data,
      });
      // console.log("all reviews", response.data);
    } catch (error) {
      dispatch({
        type: GET_ALL_REVIEWS_FAILURE,
        payload: error.message,
      });
    }
  };
};

// ------------------- CREATE RATING -------------------
export const createRating = (resData) => {
  return async (dispatch) => {
    try {
      const response = await api.post('/api/ratings/create', resData);
      dispatch({
        type: CREATE_RATING_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: CREATE_RATING_FAILURE,
        payload: error.message,
      });
    }
  };
};

// ------------------- GET ALL RATINGS -------------------
export const getAllRatings = (productId) => {
  return async (dispatch) => {
    try {
      const response = await api.get(`/api/ratings/product/${productId}`);
      dispatch({
        type: GET_ALL_RATINGS_SUCCESS,
        payload: response.data,
      });
      // console.log("all ratings", response.data);
    } catch (error) {
      dispatch({
        type: GET_ALL_RATINGS_FAILURE,
        payload: error.message,
      });
    }
  };
};

// ------------------- GET RATING SUMMARY (Bar Chart) -------------------
export const getRatingSummary = (productId) => {
  return async (dispatch) => {
    try {
      const response = await api.get(`/api/ratings/summary/${productId}`);
      dispatch({
        type: GET_RATING_SUMMARY_SUCCESS,
        payload: response.data,
      });
      // console.log("rating summary", response.data);
    } catch (error) {
      dispatch({
        type: GET_RATING_SUMMARY_FAILURE,
        payload: error.message,
      });
    }
  };
};
