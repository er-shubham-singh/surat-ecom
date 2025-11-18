// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Auth/reducer";
import customerProductReducer from "./product/reducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customersProduct:customerProductReducer
  },
});
