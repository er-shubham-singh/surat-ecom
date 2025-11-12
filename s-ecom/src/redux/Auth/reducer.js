// src/redux/Auth/authReducer.js
import { createSlice } from "@reduxjs/toolkit";
import * as types from "./actionType";

const initialState = {
  loading: false,
  user: null,
  token: null,
  message: "",
  error: "",
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // logout can stay as local reducer
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(types.REGISTER_REQUEST, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(types.REGISTER_SUCCESS, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.message = action.payload.message;
      })
      .addCase(types.REGISTER_FAILURE, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOGIN
      .addCase(types.LOGIN_REQUEST, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(types.LOGIN_SUCCESS, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.message = action.payload.message;
      })
      .addCase(types.LOGIN_FAILURE, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // OTP + Forgot password combined
      .addMatcher(
        (action) => action.type.endsWith("_REQUEST"),
        (state) => {
          state.loading = true;
          state.error = "";
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("_SUCCESS"),
        (state, action) => {
          state.loading = false;
          state.message = action.payload;
          state.error = "";
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("_FAILURE"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
