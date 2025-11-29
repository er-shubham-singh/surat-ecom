import { CHAT_FAIL, CHAT_REQUEST, CHAT_RESET, CHAT_SUCCESS } from "./ActionType"


const initialState={
    loading:false,
    messages:[],
    error:null
}

export const chatReducer =(state=initialState,action)=>{
    switch(action.type){
        case CHAT_REQUEST:
  return {
    ...state,
    loading: true,
    messages: [...state.messages, { sender: "user", text: action.payload }],
  };

case CHAT_SUCCESS:
  return {
    ...state,
    loading: false,
    messages: [
      ...state.messages,
      typeof action.payload === "string"
        ? { sender: "bot", text: action.payload }
        : action.payload,
    ],
    error: null,
  };


         case CHAT_FAIL:
      return { ...state, loading: false, error: action.payload };

    case CHAT_RESET:
      return initialState;

    default:
      return state;
    }
}