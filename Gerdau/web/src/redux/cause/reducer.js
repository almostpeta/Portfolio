import { CauseActionTypes } from "./types";

const initialState = {
  currentCause: {},
  loading: false,
  error: null,
  causes: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CauseActionTypes.FETCH_CAUSES:
      return {
        ...state,
        loading: true,
        error: null,
        causes: [],
      };
    case CauseActionTypes.FETCH_CAUSES_SUCCESS:
      return {
        ...state,
        loading: false,
        causes: action.payload.causes,
      };
    case CauseActionTypes.FETCH_CAUSES_ERROR:
      return {
        ...state,
        error: action.payload.message,
        loading: false,
        causes: [],
      };
    case CauseActionTypes.FETCH_CAUSE:
      return {
        ...state,
        currentCause: null,
        loading: true,
        error: null,
      };
    case CauseActionTypes.FETCH_CAUSE_SUCCESS:
      return {
        ...state,
        currentCause: action.payload.cause,
        loading: false,
        error: null,
      };
    case CauseActionTypes.FETCH_CAUSE_ERROR:
      return {
        ...state,
        currentCause: null,
        loading: false,
        error: action.payload.message,
      };
    default:
      return { ...state, loading: false, error: null };
  }
};

export default reducer;
