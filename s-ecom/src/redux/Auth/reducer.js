// src/redux/Auth/authReducer.js
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

const initialState = {
  loading: false,
  user: null,
  token: null,
  message: "",
  success: "",
  error: "",
  isAuthenticated: false,
  isVerified: false,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    /* ---------- REGISTER ---------- */
    case REGISTER_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
        success: "",
      };

    case REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload.user || null,
        token: action.payload.token || null,
        isAuthenticated: Boolean(action.payload.token),
        message: action.payload.message || "",
        success: action.payload.message || "Registered successfully",
        error: "",
      };

    case REGISTER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload || "Registration failed",
        success: "",
      };

    /* ---------- LOGIN ---------- */
    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
        success: "",
      };

    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload.user || null,
        token: action.payload.token || null,
        isAuthenticated: Boolean(action.payload.token),
        message: action.payload.message || "",
        success: action.payload.message || "Logged in successfully",
        error: "",
      };

    case LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload || "Login failed",
        success: "",
      };

    /* ---------- OTP / RESET ---------- */
    case SEND_VERIFY_OTP_REQUEST:
    case CONFIRM_VERIFY_OTP_REQUEST:
    case SEND_RESET_OTP_REQUEST:
    case RESET_PASSWORD_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
        success: "",
      };

    case SEND_VERIFY_OTP_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload || "",
        success: action.payload || "OTP sent",
        error: "",
      };

    case CONFIRM_VERIFY_OTP_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload || "Email verified",
        success: action.payload || "Verified",
        isVerified: true,
        error: "",
      };

    case SEND_RESET_OTP_SUCCESS:
    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload || "",
        success: action.payload || "",
        error: "",
      };

    case SEND_VERIFY_OTP_FAILURE:
    case CONFIRM_VERIFY_OTP_FAILURE:
    case SEND_RESET_OTP_FAILURE:
    case RESET_PASSWORD_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload || "",
        success: "",
      };

    /* ---------- LOGOUT ---------- */
    case LOGOUT:
      return {
        ...initialState,
      };

    default:
      return state;
  }
}
