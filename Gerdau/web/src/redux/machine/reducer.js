import { MachineActionTypes } from "./types";

const initialState = {
  currentMachine: {},
  loading: false,
  machineLoading: false,
  makes: null,
  models: null,
  error: null,
  machines: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case MachineActionTypes.FETCH_MACHINE:
      return {
        ...state,
        machineLoading: true,
        error: null,
        currentMachine: null,
      };
    case MachineActionTypes.FETCH_MACHINE_SUCCESS:
      return {
        ...state,
        machineLoading: false,
        currentMachine: action.payload.machine,
      };
    case MachineActionTypes.FETCH_MACHINE_ERROR:
      return {
        ...state,
        error: action.payload.message,
        machineLoading: false,
      };

    case MachineActionTypes.FETCH_MACHINES:
      return {
        ...state,
        loading: true,
        error: null,
        machines: null,
      };
    case MachineActionTypes.FETCH_MACHINES_SUCCESS:
      console.log("action", action);
      console.log("action payload", action.payload.MACHINES);
      return {
        ...state,
        loading: false,
        machines: action.payload.machines,
      };
    case MachineActionTypes.FETCH_MACHINES_ERROR:
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
