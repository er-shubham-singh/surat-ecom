import { applyMiddleware, combineReducers, legacy_createStore } from "@reduxjs/toolkit";

import productReducer from "./product/reducer";
import { thunk } from "redux-thunk";



const rootReducers = combineReducers({
    product:productReducer
})

export const store = legacy_createStore(rootReducers,applyMiddleware(thunk))