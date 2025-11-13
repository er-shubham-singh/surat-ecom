// src/redux/Auth/action.js
import api from "../../Config/api";
import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  SEND_VERIFY_OTP_REQUEST,
  SEND_VERIFY_OTP_SUCCESS,
  SEND_VERIFY_OTP_FAILURE,
  CONFIRM_VERIFY_OTP_REQUEST,
  CONFIRM_VERIFY_OTP_SUCCESS,
  CONFIRM_VERIFY_OTP_FAILURE,
  SEND_RESET_OTP_REQUEST,
  SEND_RESET_OTP_SUCCESS,
  SEND_RESET_OTP_FAILURE,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,
  LOGOUT,
} from "./actionType";

/**
 * Helper to extract error message
 */
const extractError = (error) => error?.response?.data?.error || error?.message || "Something went wrong";

/* ------------------ REGISTER ------------------ */
export const registerUser = (userData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    const res = await api.post("/api/register", userData);
    const data = res.data || {};

    if (data?.token) localStorage.setItem("token", data.token);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: data,
    });

    // return something useful to UI
    return { success: true, ...data };
  } catch (error) {
    const payload = extractError(error);
    dispatch({ type: REGISTER_FAILURE, payload });
    // keep same shape for UI
    return Promise.resolve({ success: false, error: payload });
  }
};

/* ------------------ LOGIN ------------------ */
export const loginUser = (userData) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const res = await api.post("/api/login", userData);
    const data = res.data || {};

    if (data?.token) localStorage.setItem("token", data.token);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: data,
    });

    return { success: true, ...data };
  } catch (error) {
    const payload = extractError(error);
    dispatch({ type: LOGIN_FAILURE, payload });
    return Promise.resolve({ success: false, error: payload });
  }
};

/* ------------------ OTP: Verify Email ------------------ */
export const sendVerifyOtp = (email) => async (dispatch) => {
  dispatch({ type: SEND_VERIFY_OTP_REQUEST });
  try {
    const res = await api.post("/api/request-verify-otp", { email });
    const msg = res.data?.message || "OTP sent";
    dispatch({ type: SEND_VERIFY_OTP_SUCCESS, payload: msg });
    return { success: true, message: msg };
  } catch (error) {
    const payload = extractError(error);
    dispatch({ type: SEND_VERIFY_OTP_FAILURE, payload });
    return Promise.resolve({ success: false, error: payload });
  }
};

export const confirmVerifyOtp = (email, otp) => async (dispatch) => {
  dispatch({ type: CONFIRM_VERIFY_OTP_REQUEST });
  try {
    const res = await api.post("/api/confirm-verify-otp", { email, otp });
    const msg = res.data?.message || "Verified";
    dispatch({ type: CONFIRM_VERIFY_OTP_SUCCESS, payload: msg });
    // set isVerified true in reducer based on this action
    return { success: true, message: msg };
  } catch (error) {
    const payload = extractError(error);
    dispatch({ type: CONFIRM_VERIFY_OTP_FAILURE, payload });
    return Promise.resolve({ success: false, error: payload });
  }
};

/* ------------------ FORGOT / RESET PASSWORD ------------------ */
export const sendResetOtp = (email) => async (dispatch) => {
  dispatch({ type: SEND_RESET_OTP_REQUEST });
  try {
    const res = await api.post("/api/request-reset-otp", { email });
    const msg = res.data?.message || "Reset OTP sent";
    dispatch({ type: SEND_RESET_OTP_SUCCESS, payload: msg });
    return { success: true, message: msg };
  } catch (error) {
    const payload = extractError(error);
    dispatch({ type: SEND_RESET_OTP_FAILURE, payload });
    return Promise.resolve({ success: false, error: payload });
  }
};

export const resetPassword = (email, otp, newPassword) => async (dispatch) => {
  dispatch({ type: RESET_PASSWORD_REQUEST });
  try {
    const res = await api.post("/api/reset-password", { email, otp, newPassword });
    const msg = res.data?.message || "Password reset success";
    dispatch({ type: RESET_PASSWORD_SUCCESS, payload: msg });
    return { success: true, message: msg };
  } catch (error) {
    const payload = extractError(error);
    dispatch({ type: RESET_PASSWORD_FAILURE, payload });
    return Promise.resolve({ success: false, error: payload });
  }
};

/* ------------------ LOGOUT ------------------ */
export const logout = () => (dispatch) => {
  localStorage.removeItem("token");
  dispatch({ type: LOGOUT });
  return { success: true };
};
