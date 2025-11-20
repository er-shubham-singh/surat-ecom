// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import customerProductReducer from "./product/reducer";
import cartReducer from './Cart/Reducer'
import {applyMiddleware, combineReducers, legacy_createStore} from "redux"
import {thunk} from "redux-thunk";
import authReducer from "./Auth/reducer";
import {couponReducer} from './Coupon/couponReducer'

const rootReducers=combineReducers({

    auth: authReducer,
    customersProduct:customerProductReducer,
    cart:cartReducer,
    coupon:couponReducer


});


export const store = legacy_createStore(rootReducers,applyMiddleware(thunk))