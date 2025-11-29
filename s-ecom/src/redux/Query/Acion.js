import axios from "axios";
import api, { API_BASE_URL } from "../../Config/api";
import {
  SEND_QUERY_REQUEST,
  SEND_QUERY_SUCCESS,
  SEND_QUERY_FAILURE,
} from "./ActionType";

export const sendUserQuery = (queryData) => async (dispatch) => {
  dispatch({ type: SEND_QUERY_REQUEST });
  try {
    const res = await api.post(`/api/user/user-query`, queryData); // ✅ use `api` not axios
    dispatch({ type: SEND_QUERY_SUCCESS, payload: res.data });
  } catch (err) {
    dispatch({
      type: SEND_QUERY_FAILURE,
      payload: err.response?.data?.message || err.message,
    });
  }
};
