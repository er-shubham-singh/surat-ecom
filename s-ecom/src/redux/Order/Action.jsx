import axios from "axios";
import {
  CREATE_ORDER_FAILURE,
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  GET_ORDER_BY_ID_FAILURE,
  GET_ORDER_BY_ID_REQUEST,
  GET_ORDER_BY_ID_SUCCESS,
  GET_ORDER_HISTORY_FAILURE,
  GET_ORDER_HISTORY_REQUEST,
  GET_ORDER_HISTORY_SUCCESS,
  RETURN_ORDER_REQUEST,
  RETURN_ORDER_SUCCESS,
  RETURN_ORDER_FAILURE,
  GET_RETURN_STATUS_REQUEST,
  GET_RETURN_STATUS_SUCCESS,
  GET_RETURN_STATUS_FAILURE,
} from "./ActionType";
import api, { API_BASE_URL } from "../../Config/api";

// export const createOrder = (reqData) => async (dispatch) => {
//   console.log("req data ", reqData);
//   try {
//     dispatch({ type: CREATE_ORDER_REQUEST });

//     const config = {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${reqData.jwt}`,
//       },
//     };

//     const { data } = await api.post(
//       `${API_BASE_URL}/api/orders/`,
//       reqData.address,
//       config
//     );
    
//     if (data._id) {
//       reqData.navigate({ search: `step=3&order_id=${data._id}` });
//     }
//     console.log("created order - ", data);
//     dispatch({
//       type: CREATE_ORDER_SUCCESS,
//       payload: data,
//     });
//   } catch (error) {
//     console.log("catch error : ", error);
//     dispatch({
//       type: CREATE_ORDER_FAILURE,
//       payload:
//         error.response && error.response.data.message
//           ? error.response.data.message
//           : error.message,
//     });
//   }
// };

export const createOrder = (reqData) => async (dispatch) => {
  console.log("createOrder reqData ➡️", reqData);

  try {
    dispatch({ type: CREATE_ORDER_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${reqData.jwt}`,
      },
    };

    // 🔥 Prepare payload including address & usedSuperCoins
   const payload = {
  shippingAddress: reqData.address,
  usedSuperCoins: reqData.usedSuperCoins || 0,
};


    const { data } = await api.post(
      `${API_BASE_URL}/api/orders/`,
      payload,
      config
    );

    // 🔀 Navigate to payment step if order created
    if (data._id) {
      reqData.navigate({ search: `step=3&order_id=${data._id}` });
    }

    console.log("✅ Order Created:", data);
    dispatch({
      type: CREATE_ORDER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.error("❌ Order Creation Error:", error);
    dispatch({
      type: CREATE_ORDER_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};


export const getOrderById = (orderId) => async (dispatch) => {
  console.log("get order req ", orderId);
  try {
    dispatch({ type: GET_ORDER_BY_ID_REQUEST });

    const { data } = await api.get(
      `/api/orders/${orderId}`,
      
    );
    console.log("order by id ", data);
    dispatch({
      type: GET_ORDER_BY_ID_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.log("catch ",error)
    dispatch({
      type: GET_ORDER_BY_ID_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getOrderHistory = (reqData) => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_ORDER_HISTORY_REQUEST });

    const { data } = await api.get(`/api/orders/user`);
    console.log("order history -------- ", data);
    dispatch({
      type: GET_ORDER_HISTORY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_ORDER_HISTORY_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};


export const returnOrder = (orderId, formData) => async (dispatch) => {
  try {
    dispatch({ type: RETURN_ORDER_REQUEST });

    const { data } = await api.put(
      `${API_BASE_URL}/api/orders/${orderId}/return`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" }, // 👈 necessary!
      }
    );

    dispatch({ type: RETURN_ORDER_SUCCESS, payload: data });
    dispatch(getOrderById(orderId));
  } catch (error) {
    dispatch({
      type: RETURN_ORDER_FAILURE,
      payload:
        error.response?.data?.message || error.message,
    });
  }
};


export const getReturnStatus = (orderId, jwt) => async (dispatch) => {
  try {
    dispatch({ type: GET_RETURN_STATUS_REQUEST })

    const { data } = await api.get(
      `${API_BASE_URL}/api/orders/${orderId}/return-status`,
    );

    dispatch({
      type: GET_RETURN_STATUS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_RETURN_STATUS_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
