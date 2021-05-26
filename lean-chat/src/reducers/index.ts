import { combineReducers } from "redux";

const initialState = {
  me: null,
};

const userReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "SET_ME":
      return {
        ...state,
        me: action.me,
      };
    default:
      return state;
  }
};

export default combineReducers({
  userState: userReducer,
});
