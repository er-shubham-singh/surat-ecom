import api from "../../Config/api"
import { CHAT_FAIL, CHAT_REQUEST, CHAT_SUCCESS } from "./ActionType"


export const sendChatMessage = (message) => async (dispatch) => {
  try {
    dispatch({ type: CHAT_REQUEST, payload: message });

    const { data } = await api.post("/api/chat", { message });

    dispatch({
      type: CHAT_SUCCESS,
      payload: data.reply,
    });
  } catch (error) {
    dispatch({
      type: CHAT_FAIL,
      payload: error.response?.data?.reply || error.message,
    });
  }
};
