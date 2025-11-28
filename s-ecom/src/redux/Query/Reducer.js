import {
  SEND_QUERY_REQUEST,
  SEND_QUERY_SUCCESS,
  SEND_QUERY_FAILURE,
} from "./ActionType";

const initialState = {
  loading: false,
  successMessage: "",
  error: null,
};

const queryReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEND_QUERY_REQUEST:
      return { ...state, loading: true, successMessage: "", error: null };
    case SEND_QUERY_SUCCESS:
      return { ...state, loading: false, successMessage: "Thank you for reaching out!" };
    case SEND_QUERY_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default queryReducer;
