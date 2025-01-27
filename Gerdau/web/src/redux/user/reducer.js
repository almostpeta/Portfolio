import { UserActionTypes } from "./types";

const initialState = {
  currentUser: null,
  loading: false,
  error: null,
  users: null,
  loginSuccess: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case UserActionTypes.LOGIN_USER:
      return { ...state, loading: true, loginSuccess: false, error: null };
    case UserActionTypes.LOGIN_USER_SUCCESS:
      return {
        ...state,
        currentUser: action.payload.user.user,
        loading: false,
        loginSuccess: true,
      };
    case UserActionTypes.LOGIN_USER_ERROR:
      return {
        ...state,
        error: action.payload.message,
        loading: false,
        loginSuccess: false,
      };
    case UserActionTypes.FETCH_USERS:
      return {
        ...state,
        loading: true,
        error: null,
        users: null,
      };
    case UserActionTypes.FETCH_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload.users,
      };
    case UserActionTypes.FETCH_USERS_ERROR:
      return {
        ...state,
        error: action.payload.message,
        loading: false,
      };
    case UserActionTypes.FETCH_USER:
      return {
        ...state,
        loading: true,
        error: null,
        currentUser: null,
      };
    case UserActionTypes.FETCH_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        currentUser: action.payload.user,
      };
    case UserActionTypes.FETCH_USER_ERROR:
      return {
        ...state,
        error: action.payload.message,
        loading: false,
        currentUser: null,
      };
    default:
      return {
        ...state,
        loading: false,
        loginSuccess: false,
        error: null,
        currentUser: null,
      };
  }
};

export default reducer;
