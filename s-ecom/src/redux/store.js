// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Auth/reducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
