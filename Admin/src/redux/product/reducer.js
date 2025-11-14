// reducers/product.reducer.js
import {
  CREATE_PRODUCT_FAILURE,
  CREATE_PRODUCT_REQUEST,
  CREATE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAILURE,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  GET_PRODUCT_FAILURE,
  GET_PRODUCT_REQUEST,
  GET_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAILURE,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
} from "./actionType";

const initialState = {
  products: [],
  loading: false,
  error: null,
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PRODUCT_REQUEST:
    case CREATE_PRODUCT_REQUEST:
    case UPDATE_PRODUCT_REQUEST:
    case DELETE_PRODUCT_REQUEST:
      return { ...state, loading: true, error: null };

    case GET_PRODUCT_SUCCESS:
      return { ...state, products: action.payload, loading: false };

    case CREATE_PRODUCT_SUCCESS:
      // add new product to list (if backend returns created product)
      return { ...state, loading: false, products: [...state.products, action.payload] };

    case UPDATE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        products: state.products.map((p) =>
          p._id === action.payload._id ? action.payload : p
        ),
      };

    case DELETE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        products: state.products.filter((p) => p._id !== action.payload),
      };

    case GET_PRODUCT_FAILURE:
    case CREATE_PRODUCT_FAILURE:
    case UPDATE_PRODUCT_FAILURE:
    case DELETE_PRODUCT_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default productReducer;
