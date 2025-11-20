// Redux/Customers/Coupon/couponReducer.js
import {
  APPLY_COUPON_REQUEST,
  APPLY_COUPON_SUCCESS,
  APPLY_COUPON_FAILURE,
  ALL_COUPON_REQUEST,
  ALL_COUPON_SUCCESS,
  ALL_COUPON_FAIL,
  CLEAR_COUPON_STATE
} from "./couponActionTypes"; // Adjust path if needed

const initialState = {
  loading: false,
  discountAmount: 0,
  finalPayableAmount: null,
  appliedCode: "",
  message: "",
  error: "",
  difference:0,
  allCoupons: [],
};

export const couponReducer = (state = initialState, action) => {
  switch (action.type) {
    case APPLY_COUPON_REQUEST:
      return {
        ...state,
        loading: true,
        message: "",
        error: "",
      };

    case APPLY_COUPON_SUCCESS:
      return {
        ...state,
        loading: false,
        discountAmount: Math.floor(action.payload.discountAmount),
        finalPayableAmount: action.payload.finalPayableAmount || null,
        appliedCode: action.payload.appliedCode || "",
        difference: action.payload.difference || 0,
        message: action.payload.message,
        error: "",
      };

    case APPLY_COUPON_FAILURE:
      return {
        ...state,
        loading: false,
        discountAmount: 0,
        finalPayableAmount: null,
        appliedCode: "",
        message: "",
        error: action.payload,
      };

    case ALL_COUPON_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case ALL_COUPON_SUCCESS:
      return {
        ...state,
        loading: false,
        // message: action.payload.message || "",
        allCoupons: action.payload.coupons || [], // Optional if you want to list all
      };

    case ALL_COUPON_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CLEAR_COUPON_STATE: // Handle the new action
      return initialState;
    default:
      return state;
  }
};

