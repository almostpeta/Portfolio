import { CompanyActionTypes } from "./types";

const initialState = {
  loading: false,
  plants: null,
  areas: null,
  sublevels: null,
  error: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CompanyActionTypes.FETCH_PLANTS:
      return {
        ...state,
        loading: true,
        error: null,
        plants: null,
      };
    case CompanyActionTypes.FETCH_PLANTS_SUCCESS:
      return {
        ...state,
        loading: false,
        plants: action.payload.plants,
      };
    case CompanyActionTypes.FETCH_PLANTS_ERROR:
      return {
        ...state,
        error: action.payload.message,
        loading: false,
      };

    case CompanyActionTypes.FETCH_AREAS:
      return {
        ...state,
        loading: true,
        error: null,
        areas: null,
      };
    case CompanyActionTypes.FETCH_AREAS_SUCCESS:
      return {
        ...state,
        loading: false,
        areas: action.payload.areas,
      };
    case CompanyActionTypes.FETCH_AREAS_ERROR:
      return {
        ...state,
        error: action.payload.message,
        loading: false,
      };

    case CompanyActionTypes.FETCH_SUBLEVELS:
      return {
        ...state,
        loading: true,
        error: null,
        sublevels: null,
      };
    case CompanyActionTypes.FETCH_SUBLEVELS_SUCCESS:
      return {
        ...state,
        loading: false,
        sublevels: action.payload.sublevels,
      };
    case CompanyActionTypes.FETCH_SUBLEVELS_ERROR:
      return {
        ...state,
        error: action.payload.message,
        loading: false,
      };

    default:
      return { ...state, loading: true, error: null };
  }
};

export default reducer;
