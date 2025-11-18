import {
  GET_RATING_SUMMARY_SUCCESS,
  GET_RATING_SUMMARY_FAILURE
} from './ActionTyp';

const initialState = {
  ratingSummary: null,
  error: null,
};

const RatingSummaryReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_RATING_SUMMARY_SUCCESS:
      return {
        ...state,
        ratingSummary: action.payload,
        error: null,
      };
    case GET_RATING_SUMMARY_FAILURE:
      return {
        ...state,
        ratingSummary: null,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default RatingSummaryReducer;
