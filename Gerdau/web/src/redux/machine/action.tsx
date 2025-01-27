import { Action } from "redux";
import { RootState } from "redux/reducer";
import { createAction } from "redux-actions";
import { MachineActionTypes } from "./types";
import { getAllMachines, getMachineById } from "service/machine";
import Errors from "lib/errorMessages";
import { ClientError } from "lib/exceptions";
import { ThunkAction } from "redux-thunk";

const fetchMachine = createAction(MachineActionTypes.FETCH_MACHINE);
const fetchMachineSuccess = createAction(
  MachineActionTypes.FETCH_MACHINE_SUCCESS,
  (machine: any) => ({
    machine,
  })
);

const fetchMachineError = createAction(
  MachineActionTypes.FETCH_MACHINE_ERROR,
  (message: string) => ({
    message,
  })
);

const fetchMachines = createAction(MachineActionTypes.FETCH_MACHINES);
const fetchMachinesSuccess = createAction(
  MachineActionTypes.FETCH_MACHINES_SUCCESS,
  (machines: any) => ({
    machines,
  })
);

const fetchMachinesError = createAction(
  MachineActionTypes.FETCH_MACHINES_ERROR,
  (message: string) => ({
    message,
  })
);

const fetchModels = createAction(MachineActionTypes.FETCH_MODELS);
const fetchModelsSuccess = createAction(
  MachineActionTypes.FETCH_MODELS_SUCCESS,
  (models: any) => ({
    models,
  })
);

const fetchModelsError = createAction(
  MachineActionTypes.FETCH_MODELS_ERROR,
  (message: string) => ({
    message,
  })
);

const fetchMakes = createAction(MachineActionTypes.FETCH_MAKES);
const fetchMakesSuccess = createAction(
  MachineActionTypes.FETCH_MAKES_SUCCESS,
  (makes: any) => ({
    makes,
  })
);

const fetchMakesError = createAction(
  MachineActionTypes.FETCH_MAKES_ERROR,
  (message: string) => ({
    message,
  })
);

export const doFetchMachines =
  (): ThunkAction<void, RootState, unknown, Action<string>> => (dispatch) => {
    dispatch(fetchMachines());
    return getAllMachines()
      .then((response: any) => {
        dispatch(fetchMachinesSuccess(response));
        return response;
      })
      .catch((error: any) => {
        const _message = Errors.MACHINES_ERROR;
        const message =
          error instanceof ClientError ? _message : Errors.GENERIC_ERROR;
        dispatch(fetchMachinesError(message));
      });
  };

export const doFetchMachine =
  (machineId: string): ThunkAction<void, RootState, unknown, Action<string>> =>
  (dispatch) => {
    dispatch(fetchMachine());
    console.log("machineID at fecth machine", machineId);
    return getMachineById(machineId).then(
      (response: any) => {
        dispatch(fetchMachineSuccess(response));
        return response;
      },
      (error: any) => {
        const _message = Errors.MACHINES_ERROR;
        const message =
          error instanceof ClientError ? _message : Errors.GENERIC_ERROR;
        dispatch(fetchMachineError(message));
      }
    );
  };
