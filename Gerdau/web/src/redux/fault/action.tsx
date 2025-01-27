import { createAction } from "redux-actions";
import { FaultActionTypes } from "./types";
import { getAllFaults, getFaultById } from "service/fault";
import Errors from "lib/errorMessages";
import { ClientError } from "lib/exceptions";

const fetchFaults = createAction(FaultActionTypes.FETCH_FAULTS);
const fetchFault = createAction(FaultActionTypes.FETCH_FAULT);

const fetchFaultSuccess = createAction(
  FaultActionTypes.FETCH_FAULT_SUCCESS,
  (fault: any) => ({
    fault,
  })
);

const fetchFaultError = createAction(
  FaultActionTypes.FETCH_FAULT_ERROR,
  (message: any) => ({
    message,
  })
);

const fetchFaultsSuccess = createAction(
  FaultActionTypes.FETCH_FAULTS_SUCCESS,
  (faults: any) => ({
    faults,
  })
);

const fetchFaultsError = createAction(
  FaultActionTypes.FETCH_FAULTS_ERROR,
  (message: string) => ({
    message,
  })
);

export const doFetchFaults = () => {
  return (dispatch: any) => {
    dispatch(fetchFaults());
    return getAllFaults()
      .then((response: any) => {
        dispatch(fetchFaultsSuccess(response));
        return response;
      })
      .catch((error: any) => {
        const _message = Errors.FAULTS_ERROR;
        const message =
          error instanceof ClientError ? _message : Errors.GENERIC_ERROR;
        dispatch(fetchFaultsError(message));
      });
  };
};

export const doFetchFault = (faultId: string) => {
  return (dispatch: any) => {
    dispatch(fetchFault());
    return getFaultById(faultId)
      .then((response: any) => {
        dispatch(fetchFaultSuccess(response));
        return response;
      })
      .catch((error: any) => {
        const _message = Errors.FAULTS_ERROR;
        const message =
          error instanceof ClientError ? _message : Errors.GENERIC_ERROR;
        dispatch(fetchFaultError(message));
      });
  };
};
