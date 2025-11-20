import axios from "axios"; // ✅ Import axios
import {
  APPLY_COUPON_REQUEST,
  APPLY_COUPON_SUCCESS,
  APPLY_COUPON_FAILURE,
  ALL_COUPON_REQUEST,
  ALL_COUPON_SUCCESS,
  ALL_COUPON_FAIL,
  CLEAR_COUPON_STATE
} from "./couponActionTypes"; // ✅ Correct file name
import api, { API_BASE_URL } from "../../Config/api";

export const applyCoupon = (code, userId, cartId, cartTotal) => async (dispatch) => {
  try {
    dispatch({ type: APPLY_COUPON_REQUEST });

    const { data } = await api.post(`${API_BASE_URL}/api/cart/apply-cart-coupon`, {
      code,
      userId,
      cartId,
      cartTotal, // ✅ send this
    });

    dispatch({
      type: APPLY_COUPON_SUCCESS,
      payload: {
        discountAmount: data.discountAmount,
        message: data.message,
        appliedCode: data.code,
        originalTotal: data.originalTotal,
        finalPayableAmount: data.finalPayableAmount,
        difference: data.difference,
      },
    });
  } catch (error) {
    dispatch({
      type: APPLY_COUPON_FAILURE,
      payload: error.response?.data?.message || "Failed to apply coupon",
    });
  }
};

export const allCoupon = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_COUPON_REQUEST });

    const { data } = await api.get(`${API_BASE_URL}/api/cart/all-coupon`);

    dispatch({
      type: ALL_COUPON_SUCCESS,
      payload: {
        message: data.message || "Coupons fetched successfully",
        coupons: data.coupons || [], // make sure backend returns this
      },
    });
  } catch (error) {
    dispatch({
      type: ALL_COUPON_FAIL,
      payload: error.response?.data?.message || "Failed to fetch coupons",
    });
  }
};


export const clearCouponState = () => (dispatch) => {
  dispatch({ type: CLEAR_COUPON_STATE });
};


