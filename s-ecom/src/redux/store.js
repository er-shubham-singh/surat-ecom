// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import customerProductReducer from "./product/reducer";
import cartReducer from './Cart/Reducer'
import {applyMiddleware, combineReducers, legacy_createStore} from "redux"
import {thunk} from "redux-thunk";
import authReducer from "./Auth/reducer";
import {couponReducer} from './Coupon/couponReducer'
import {orderReducer} from './Order/Reducer'
import ReviewReducer from "./Review/Reducer";
import RatingSummaryReducer from './Review/ratingSummaryReducer'
import queryReducer from "./Query/Reducer";
import { chatReducer } from "./Chat/Reducer";
const rootReducers=combineReducers({

    auth: authReducer,
    customersProduct:customerProductReducer,
    cart:cartReducer,
    order:orderReducer,
    coupon:couponReducer,
    review:ReviewReducer,
    ratingSummaryState: RatingSummaryReducer,
    query: queryReducer,
    chat:chatReducer


});


export const store = legacy_createStore(rootReducers,applyMiddleware(thunk))