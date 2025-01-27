import { SolutionActionTypes } from "./types";

const initialState = {
  currentSolution: null,
  error: null,
  loading: false,
  solutions: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SolutionActionTypes.FETCH_SOLUTIONS:
      return {
        ...state,
        error: null,
        loading: true,
        solutions: [],
      };
    case SolutionActionTypes.FETCH_SOLUTIONS_SUCCESS:
      return {
        ...state,
        error: null,
        loading: false,
        solutions: action.payload.solutions,
      };
    case SolutionActionTypes.FETCH_SOLUTIONS_ERROR:
      return {
        ...state,
        error: action.payload.message,
        loading: false,
        solutions: [],
      };
    case SolutionActionTypes.FETCH_SINGLE_SOLUTION:
      return {
        ...state,
        currentSolution: null,
        error: null,
        loading: true,
      };
    case SolutionActionTypes.FETCH_SINGLE_SOLUTION_SUCCESS:
      return {
        ...state,
        currentSolution: action.payload.solution,
        error: null,
        loading: false,
      };
    case SolutionActionTypes.FETCH_SINGLE_SOLUTION_ERROR:
      return {
        ...state,
        currentSolution: null,
        error: action.payload.message,
        loading: false,
      };
    default:
      return { ...state, loading: false, error: null };
  }
};

export default reducer;
