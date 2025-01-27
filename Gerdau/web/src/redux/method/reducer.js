import { MethodActionTypes } from "./types";

const initialState = {
  currentMethod: null,
  error: null,
  loading: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case MethodActionTypes.FETCH_SINGLE_METHOD:
      return {
        ...state,
        currentMethod: null,
        error: null,
        loading: true,
      };
    case MethodActionTypes.FETCH_SINGLE_METHOD_SUCCESS:
      return {
        ...state,
        currentMethod: action.payload.method,
        error: null,
        loading: false,
      };
    case MethodActionTypes.FETCH_SINGLE_METHOD_ERROR:
      return {
        ...state,
        currentMethod: null,
        error: action.payload.message,
        loading: false,
      };
    default:
      return { ...state, loading: false, error: null };
  }
};

export default reducer;
