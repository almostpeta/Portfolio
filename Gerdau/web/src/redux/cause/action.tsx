import { createAction } from "redux-actions";
import { CauseActionTypes } from "./types";
import { getAllCauses, getCauseById } from "service/cause";
import Errors from "lib/errorMessages";
import { ClientError } from "lib/exceptions";

const fetchCauses = createAction(CauseActionTypes.FETCH_CAUSES);
const fetchCause = createAction(CauseActionTypes.FETCH_CAUSE);

const fetchCausesSuccess = createAction(
  CauseActionTypes.FETCH_CAUSES_SUCCESS,
  (causes: any) => ({
    causes,
  })
);

const fetchCauseSuccess = createAction(
  CauseActionTypes.FETCH_CAUSE_SUCCESS,
  (cause: any) => ({
    cause,
  })
);

const fetchCausesError = createAction(
  CauseActionTypes.FETCH_CAUSES_ERROR,
  (message: string) => ({
    message,
  })
);

const fetchCauseError = createAction(
  CauseActionTypes.FETCH_CAUSE_ERROR,
  (message: any) => ({
    message,
  })
);

export const doFetchCauses = () => {
  return (dispatch: any) => {
    console.log("executing");
    dispatch(fetchCauses());
    return getAllCauses()
      .then((response: any) => {
        dispatch(fetchCausesSuccess(response));
        return response;
      })
      .catch((error: any) => {
        const _message = Errors.CAUSES_ERROR;
        const message =
          error instanceof ClientError ? _message : Errors.GENERIC_ERROR;
        dispatch(fetchCausesError(message));
      });
  };
};

export const doFetchCause = (causeId: string) => {
  return (dispatch: any) => {
    dispatch(fetchCause());
    return getCauseById(causeId)
      .then((response: any) => {
        dispatch(fetchCauseSuccess(response));
        return response;
      })
      .catch((error: any) => {
        const _message = Errors.FAULTS_ERROR;
        const message =
          error instanceof ClientError ? _message : Errors.GENERIC_ERROR;
        dispatch(fetchCauseError(message));
      });
  };
};
