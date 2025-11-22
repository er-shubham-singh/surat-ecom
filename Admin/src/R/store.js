import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
import customerProductReducer from "./product/reducer";

const rootReducers = combineReducers({
  customersProduct: customerProductReducer,
});

export const store = legacy_createStore(rootReducers, applyMiddleware(thunk));
