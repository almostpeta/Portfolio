import { FaultActionTypes } from "./types";

const initialState = {
  currentFault: {},
  loading: false,
  error: null,
  faults: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FaultActionTypes.FETCH_FAULTS:
      return {
        ...state,
        loading: true,
        error: null,
        faults: null,
      };
    case FaultActionTypes.FETCH_FAULTS_SUCCESS:
      return {
        ...state,
        loading: false,
        faults: action.payload.faults,
      };
    case FaultActionTypes.FETCH_FAULTS_ERROR:
      return {
        ...state,
        error: action.payload.message,
        loading: false,
      };
    case FaultActionTypes.FETCH_FAULT:
      return {
        ...state,
        currentFault: null,
        loading: true,
        error: null,
      };
    case FaultActionTypes.FETCH_FAULT_SUCCESS:
      return {
        ...state,
        currentFault: action.payload.fault,
        loading: false,
        error: null,
      };
    case FaultActionTypes.FETCH_FAULT_ERROR:
      return {
        ...state,
        currentFault: null,
        loading: false,
        error: action.payload.message,
      };
    default:
      return { ...state, loading: false, error: null };
  }
};

export default reducer;
