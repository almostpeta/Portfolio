import { createAction } from "redux-actions";
import { MethodActionTypes } from "./types";
import { getMethodById } from "service/method";
import { Action } from "redux";
import { RootState } from "redux/reducer";
import Errors from "lib/errorMessages";
import { ClientError } from "lib/exceptions";
import { ThunkAction } from "redux-thunk";

const fetchSingleMethod = createAction(MethodActionTypes.FETCH_SINGLE_METHOD);
const fetchSingleMethodSuccess = createAction(
  MethodActionTypes.FETCH_SINGLE_METHOD_SUCCESS,
  (method: any) => ({
    method,
  })
);
const fetchSingleMethodError = createAction(
  MethodActionTypes.FETCH_SINGLE_METHOD_ERROR,
  (message: string) => ({
    message,
  })
);

export const doFetchMethod = (
  methodId: String
): ThunkAction<void, RootState, unknown, Action<string>> => async (
  dispatch
) => {
  dispatch(fetchSingleMethod());
  return await getMethodById(methodId).then(
    (response: any) => {
      dispatch(fetchSingleMethodSuccess(response));
      return response;
    },
    (error: any) => {
      const _message = Errors.METHODS_ERROR;
      const message =
        error instanceof ClientError ? _message : Errors.GENERIC_ERROR;
      dispatch(fetchSingleMethodError(message));
    }
  );
};
