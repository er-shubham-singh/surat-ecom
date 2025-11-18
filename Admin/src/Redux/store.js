// src/Redux/Store.js
import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import {thunk} from "redux-thunk"; // <-- default import
import authReducer from "./Auth/Reducer";
import customerProductReducer from "./Customers/Product/Reducer";
import productReducer from "./Admin/Product/Reducer";
import adminOrderReducer from "./Admin/Orders/Reducer";

const rootReducers = combineReducers({
  auth: authReducer,
  customersProduct: customerProductReducer,
  // admin
  adminsProduct: productReducer,
  adminsOrder: adminOrderReducer,
});

const store = legacy_createStore(rootReducers, applyMiddleware(thunk));

export default store; // default export to match import in main.jsx
// (If you prefer named export, use: export { store }; then change main.jsx accordingly)
