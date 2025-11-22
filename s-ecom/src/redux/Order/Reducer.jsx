import {
    CREATE_ORDER_REQUEST,
    CREATE_ORDER_SUCCESS,
    CREATE_ORDER_FAILURE,
    GET_ORDER_BY_ID_REQUEST,
    GET_ORDER_BY_ID_SUCCESS,
    GET_ORDER_BY_ID_FAILURE,
    GET_ORDER_HISTORY_REQUEST,
    GET_ORDER_HISTORY_SUCCESS,
    GET_ORDER_HISTORY_FAILURE,
    RETURN_ORDER_REQUEST,
    RETURN_ORDER_SUCCESS,
    RETURN_ORDER_FAILURE,
    GET_RETURN_STATUS_REQUEST,
    GET_RETURN_STATUS_SUCCESS,
    GET_RETURN_STATUS_FAILURE,
  } from './ActionType';

  const initialState={
    orders:[],
    order:null,
    error:null,
    loading:false,
    returnLoading: false,
    returnStatus:null
  }
  
  export const orderReducer = (state = initialState, action) => {
    switch (action.type) {
      case CREATE_ORDER_REQUEST:
        return {
          loading: true,
        };
      case CREATE_ORDER_SUCCESS:
        return {
          loading: false,
          success: true,
          order: action.payload,
        };
      case CREATE_ORDER_FAILURE:
        return {
          loading: false,
          error: action.payload,
        };
        case GET_ORDER_BY_ID_REQUEST:
        return {
          loading: true,
        };
      case GET_ORDER_BY_ID_SUCCESS:
        return {
          loading: false,
          order: action.payload,
        };
      case GET_ORDER_BY_ID_FAILURE:
        return {
          loading: false,
          error: action.payload,
        };
        case GET_ORDER_HISTORY_REQUEST:
            return {
              loading: true,
              orders: [],
            };
          case GET_ORDER_HISTORY_SUCCESS:
            return {
              loading: false,
              orders: action.payload,
            };
          case GET_ORDER_HISTORY_FAILURE:
            return {
              loading: false,
              error: action.payload,
              orders: [],
            };
       case RETURN_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        returnStatus: "success",
      };

    case GET_RETURN_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        returnStatus: action.payload,
      };
    case RETURN_ORDER_FAILURE:
    case GET_RETURN_STATUS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
      default:
        return state;
    }
  };
  
 
  