import { StageActionTypes } from "./types";

const initialState = {
  loading: false,
  error: null,
  allStages: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case StageActionTypes.FETCH_STAGES:
      return {
        ...state,
        loading: true,
        error: null,
        allStages: null,
      };
    case StageActionTypes.FETCH_STAGES_SUCCESS:
      return {
        ...state,
        loading: false,
        allStages: action.payload.stages,
      };
    case StageActionTypes.FETCH_STAGES_ERROR:
      return {
        ...state,
        error: action.payload.message,
        loading: false,
        allStages: null,
      };
    default:
      return state;
  }
};

export default reducer;
