import { createAction } from "redux-actions";
import { SolutionActionTypes } from "./types";
import { getAllSolutions, getSolutionById } from "service/solution";
import { Action } from "redux";
import { RootState } from "redux/reducer";
import Errors from "lib/errorMessages";
import { ClientError } from "lib/exceptions";
import { ThunkAction } from "redux-thunk";

const fetchSolutions = createAction(SolutionActionTypes.FETCH_SOLUTIONS);
const fetchSolutionsSuccess = createAction(
  SolutionActionTypes.FETCH_SOLUTIONS_SUCCESS,
  (solutions: any) => ({
    solutions,
  })
);
const fetchSolutionsError = createAction(
  SolutionActionTypes.FETCH_SOLUTIONS_ERROR,
  (message: string) => ({
    message,
  })
);

const fetchSingleSolution = createAction(
  SolutionActionTypes.FETCH_SINGLE_SOLUTION
);
const fetchSingleSolutionSuccess = createAction(
  SolutionActionTypes.FETCH_SINGLE_SOLUTION_SUCCESS,
  (solution: any) => ({
    solution,
  })
);
const fetchSingleSolutionError = createAction(
  SolutionActionTypes.FETCH_SINGLE_SOLUTION_ERROR,
  (message: string) => ({
    message,
  })
);

export const doFetchSolutions = (): ThunkAction<
  void,
  RootState,
  unknown,
  Action<string>
> => async (dispatch) => {
  dispatch(fetchSolutions());
  return await getAllSolutions().then(
    (response: any) => {
      dispatch(fetchSolutionsSuccess(response));
      return response;
    },
    (error: any) => {
      const _message = Errors.SOLUTIONS_ERROR;
      const message =
        error instanceof ClientError ? _message : Errors.GENERIC_ERROR;
      dispatch(fetchSolutionsError(message));
    }
  );
};

export const doFetchSingleSolution = (
  solutionId: String
): ThunkAction<void, RootState, unknown, Action<string>> => async (
  dispatch
) => {
  dispatch(fetchSingleSolution());
  return await getSolutionById(solutionId).then(
    (response: any) => {
      dispatch(fetchSingleSolutionSuccess(response));
      return response;
    },
    (error: any) => {
      const _message = Errors.SOLUTIONS_ERROR;
      const message =
        error instanceof ClientError ? _message : Errors.GENERIC_ERROR;
      dispatch(fetchSingleSolutionError(message));
    }
  );
};
