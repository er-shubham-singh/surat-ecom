// src/redux/Auth/authActions.js
import axios from "axios";
import * as types from "./actionType";

const API_URL = import.meta.env.VITE_API_URL;

// ------------------ REGISTER ------------------
export const registerUser = (userData) => async (dispatch) => {
  dispatch({ type: types.REGISTER_REQUEST });
  try {
    const res = await axios.post(`${API_URL}/register`, userData);
    dispatch({
      type: types.REGISTER_SUCCESS,
      payload: res.data,
    });
    return res.data;
  } catch (error) {
    dispatch({
      type: types.REGISTER_FAILURE,
      payload: error.response?.data?.error || error.message,
    });
  }
};

// ------------------ LOGIN ------------------
export const loginUser = (credentials) => async (dispatch) => {
  dispatch({ type: types.LOGIN_REQUEST });
  try {
    const res = await axios.post(`${API_URL}/login`, credentials);
    dispatch({
      type: types.LOGIN_SUCCESS,
      payload: res.data,
    });
    localStorage.setItem("token", res.data.token);
    return res.data;
  } catch (error) {
    dispatch({
      type: types.LOGIN_FAILURE,
      payload: error.response?.data?.error || error.message,
    });
  }
};

// ------------------ OTP: Verify Email ------------------
export const sendVerifyOtp = (email) => async (dispatch) => {
  dispatch({ type: types.SEND_VERIFY_OTP_REQUEST });
  try {
    const res = await axios.post(`${API_URL}/request-verify-otp`, { email });
    dispatch({
      type: types.SEND_VERIFY_OTP_SUCCESS,
      payload: res.data.message,
    });
    return res.data;
  } catch (error) {
    dispatch({
      type: types.SEND_VERIFY_OTP_FAILURE,
      payload: error.response?.data?.error || error.message,
    });
  }
};

export const confirmVerifyOtp = (email, otp) => async (dispatch) => {
  dispatch({ type: types.CONFIRM_VERIFY_OTP_REQUEST });
  try {
    const res = await axios.post(`${API_URL}/confirm-verify-otp`, {
      email,
      otp,
    });
    dispatch({
      type: types.CONFIRM_VERIFY_OTP_SUCCESS,
      payload: res.data.message,
    });
    return res.data;
  } catch (error) {
    dispatch({
      type: types.CONFIRM_VERIFY_OTP_FAILURE,
      payload: error.response?.data?.error || error.message,
    });
  }
};

// ------------------ FORGOT PASSWORD ------------------
export const sendResetOtp = (email) => async (dispatch) => {
  dispatch({ type: types.SEND_RESET_OTP_REQUEST });
  try {
    const res = await axios.post(`${API_URL}/request-reset-otp`, { email });
    dispatch({
      type: types.SEND_RESET_OTP_SUCCESS,
      payload: res.data.message,
    });
    return res.data;
  } catch (error) {
    dispatch({
      type: types.SEND_RESET_OTP_FAILURE,
      payload: error.response?.data?.error || error.message,
    });
  }
};

export const resetPassword = (email, otp, newPassword) => async (dispatch) => {
  dispatch({ type: types.RESET_PASSWORD_REQUEST });
  try {
    const res = await axios.post(`${API_URL}/reset-password`, {
      email,
      otp,
      newPassword,
    });
    dispatch({
      type: types.RESET_PASSWORD_SUCCESS,
      payload: res.data.message,
    });
    return res.data;
  } catch (error) {
    dispatch({
      type: types.RESET_PASSWORD_FAILURE,
      payload: error.response?.data?.error || error.message,
    });
  }
};

// ------------------ LOGOUT ------------------
export const logout = () => (dispatch) => {
  localStorage.removeItem("token");
  dispatch({ type: types.LOGOUT });
};
