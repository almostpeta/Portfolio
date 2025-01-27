import { StudyActionTypes } from "./types";

const initialState = {
  currentStudy: {},
  loading: false,
  error: null,
  studies: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case StudyActionTypes.FETCH_STUDY:
      return {
        ...state,
        loading: true,
        error: null,
        currentStudy: null,
      };
    case StudyActionTypes.FETCH_STUDY_SUCCESS:
      return {
        ...state,
        loading: false,
        currentStudy: action.payload.study,
      };
    case StudyActionTypes.FETCH_STUDY_ERROR:
      return {
        ...state,
        error: action.payload.message,
        loading: false,
        currentStudy: null,
      };
    case StudyActionTypes.FETCH_STUDIES:
      return {
        ...state,
        loading: true,
        error: null,
        studies: null,
      };
    case StudyActionTypes.FETCH_STUDIES_SUCCESS:
      return {
        ...state,
        loading: false,
        studies: action.payload.studies,
      };
    case StudyActionTypes.FETCH_STUDIES_ERROR:
      return {
        ...state,
        error: action.payload.message,
        loading: false,
        studies: null,
      };
    default:
      return state;
  }
};

export default reducer;
